# FSAD-PS34 — Professional Skill Certification Tracking Platform

> **Stack**: Vite + React 18 · Tailwind CSS · Framer Motion · Zustand · React Router v6 · React Hook Form + Zod · Recharts · Sonner · Lucide React

---

## 📁 Project Structure

```
src/
├── animations/
│   └── variants.js              # All Framer Motion variants (page, card, modal, stagger…)
├── components/
│   ├── charts/                  # Recharts wrappers (CertDonutChart, ExpiryBarChart…)
│   ├── calendar/                # RenewalCalendar, RenewalTimeline
│   ├── layout/
│   │   ├── DashboardLayout.jsx  # Sidebar + Navbar wrapper
│   │   ├── Navbar.jsx           # Top bar (hamburger, theme toggle, notifications, avatar)
│   │   ├── PageWrapper.jsx      # Standard page padding + Framer Motion page transition
│   │   └── Sidebar.jsx          # Role-based nav links + mobile drawer (AnimatePresence)
│   ├── shared/                  # CertCard, StatCard, SearchBar, EmptyState, SkeletonCard…
│   └── ui/                      # Button, Input, Dialog, CertForm (RHF + Zod)
├── data/
│   ├── proxyUsers.js            # Mock user store (4 users — id, name, email, role, avatar…)
│   └── proxyCertificates.js     # Mock cert store (9 certs — title, org, dates, status, userId…)
├── hooks/
│   └── usePageLoader.js         # 800 ms skeleton delay hook
├── pages/
│   ├── auth/Login.jsx           # Login page (RHF + Zod)
│   ├── user/                    # UserDashboard, MyCertifications, AddCertification…
│   ├── admin/                   # AdminDashboard, AllCertifications, UserManagement…
│   ├── NotFound.jsx             # 404 page
│   └── Unauthorized.jsx         # 403 page
├── routes/
│   ├── AppRouter.jsx            # BrowserRouter + lazy routes + Toaster
│   └── ProtectedRoute.jsx       # Role-based guard → /unauthorized
├── store/
│   ├── authStore.js             # Zustand: user, isAuthenticated, login, logout, updateUser
│   ├── certStore.js             # Zustand: certificates[], addCertificate, updateCertificate, deleteCertificate
│   ├── uiStore.js               # Zustand: sidebarOpen, toggleSidebar
│   └── themeStore.js            # Zustand: isDark, toggleTheme (persisted in localStorage)
└── utils/
    ├── certHelpers.js           # getCertsByUser, getCertStats, getDaysRemaining
    ├── helpers.js               # getInitials, avatarColor
    └── dateUtils.js             # formatDate
```

---

## 🔐 Authentication Flow

### 1 · Login Page — `src/pages/auth/Login.jsx`

```jsx
// Uses React Hook Form + Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

const onSubmit = (data) => {
  const found = proxyUsers.find(u => u.email === data.email && u.password === data.password);
  if (found) login(found);           // → authStore
  else setError('root', { message: 'Invalid credentials' });
};
```

### 2 · Auth Store — `src/store/authStore.js`

```js
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login:  (user) => set({ user, isAuthenticated: true }),
      logout: ()     => set({ user: null, isAuthenticated: false }),
      updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
    }),
    { name: 'fsad-auth' }   // localStorage key
  )
);
```

### 3 · Route Guard — `src/routes/ProtectedRoute.jsx`

```jsx
export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/unauthorized" replace />;
  return children;
}
```

### 4 · Route Registration — `src/routes/AppRouter.jsx`

```jsx
// All pages are lazy-loaded
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));

// Protected helper: wraps page in DashboardLayout + ProtectedRoute
function Protected({ role, children }) {
  return (
    <ProtectedRoute allowedRole={role}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

<Route path="/user/dashboard" element={<Protected role="user"><UserDashboard /></Protected>} />
<Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard /></Protected>} />
<Route path="*" element={<NotFound />} />
```

**Login → Root redirect flow:**
```
/  →  RootRedirect()
         ├─ not authenticated → /login
         └─ authenticated → /user/dashboard  or  /admin/dashboard
```

---

## 📦 Data Layer (No Backend)

### Proxy Data Files

**`src/data/proxyUsers.js`**
```js
export const proxyUsers = [
  { id: 'u1', name: 'Ashish Dohare', email: 'ashish@gmail.com', password: 'user123',
    role: 'user', designation: 'Software Engineer', department: 'Engineering', avatar: '...' },
  { id: 'u2', name: 'Admin User',   email: 'admin@gmail.com',  password: 'admin123',
    role: 'admin', designation: 'Platform Administrator', ... },
  // u3, u4 …
];
```

**`src/data/proxyCertificates.js`**
```js
export const proxyCertificates = [
  { id: 'c1', userId: 'u1', title: 'AWS Certified Solutions Architect',
    organization: 'Amazon Web Services', issueDate: '2024-08-10',
    expiryDate: '2027-08-10', status: 'active', category: 'Cloud',
    credentialId: 'AWS-SAA-001', badgeUrl: '...', certificateUrl: '...' },
  // … 8 more
];
```

### Cert Store — `src/store/certStore.js`

```js
export const useCertStore = create(
  persist(
    (set) => ({
      certificates: proxyCertificates,       // seeded from proxy data

      addCertificate: (cert) =>
        set((s) => ({
          certificates: [...s.certificates, { ...cert, id: `c${Date.now()}` }],
        })),

      updateCertificate: (id, patch) =>
        set((s) => ({
          certificates: s.certificates.map((c) => c.id === id ? { ...c, ...patch } : c),
        })),

      deleteCertificate: (id) =>
        set((s) => ({
          certificates: s.certificates.filter((c) => c.id !== id),
        })),
    }),
    { name: 'fsad-certs' }
  )
);
```

---

## ✏️ CRUD — Certifications

### CREATE — `src/pages/user/AddCertification.jsx`

```jsx
import { useCertStore } from '../../store/certStore';
import canvasConfetti  from 'canvas-confetti';

const addCertificate = useCertStore((s) => s.addCertificate);

const handleSubmit = async (data) => {
  await new Promise(r => setTimeout(r, 700));     // simulated async
  addCertificate({ ...data, userId: user.id, status: 'active' });
  fireConfetti();                                  // burst animation
  toast.success('Certification added! 🎉');
  navigate('/user/certifications');
};

// Form rendered by:
<CertForm onSubmit={handleSubmit} submitLabel="Add Certification" />
```

**`CertForm` — `src/components/ui/CertForm.jsx`**
Uses `react-hook-form` + `zod` for every field (title, organization, issueDate, expiryDate, category, credentialId).

---

### READ — `src/pages/user/MyCertifications.jsx`

```jsx
// Pull from store via certHelpers
const certs = getCertsByUser(user.id);  // → certHelpers.js filters by userId

// useMemo filter (search + status + category)
const filtered = useMemo(() => certs.filter(c => {
  const q = query.toLowerCase();
  return (!q || c.title.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q))
      && (!status   || c.status   === status)
      && (!category || c.category === category);
}), [certs, query, status, category]);
```

**Admin read (all certs) — `src/pages/admin/AllCertifications.jsx`**
```jsx
// Searches across ALL certs (title + org + owner name)
const filtered = useMemo(() => allCerts.filter(c => {
  const owner = proxyUsers.find(u => u.id === c.userId)?.name ?? '';
  return q
    ? c.title.toLowerCase().includes(q)
    || c.organization.toLowerCase().includes(q)
    || owner.toLowerCase().includes(q)
    : true;
}), [allCerts, q]);
```

**Cert helper — `src/utils/certHelpers.js`**
```js
export function getCertsByUser(userId) {
  const certs = useCertStore.getState().certificates;
  return certs.filter(c => c.userId === userId);
}

export function getCertStats(userId) {
  const certs = getCertsByUser(userId);
  return {
    total:       certs.length,
    active:      certs.filter(c => c.status === 'active').length,
    expiringSoon:certs.filter(c => c.status === 'expiring_soon').length,
    expired:     certs.filter(c => c.status === 'expired').length,
  };
}
```

---

### UPDATE — `src/pages/user/EditCertification.jsx`

```jsx
// Pre-populate form via useParams → id
const cert = useCertStore(s => s.certificates.find(c => c.id === id));
const updateCertificate = useCertStore(s => s.updateCertificate);

const handleSubmit = async (data) => {
  await new Promise(r => setTimeout(r, 600));
  updateCertificate(id, data);              // patches in certStore
  toast.success('Certificate updated!');
  navigate('/user/certifications');
};

<CertForm defaultValues={cert} onSubmit={handleSubmit} submitLabel="Save Changes" />
```

**Admin update — `src/pages/admin/AdminEditModal.jsx`**
```jsx
// Wraps CertForm in a full-screen modal
<AdminEditModal
  cert={editingCert}
  onClose={() => setEditingCert(null)}
  onSave={(updated) => {
    updateCertificate(updated.id, updated);
    toast.success('Certificate updated!');
    setEditingCert(null);
  }}
/>
```

---

### DELETE — `src/pages/user/MyCertifications.jsx`

```jsx
const handleDelete = () => {
  setCerts(prev => prev.filter(c => c.id !== toDelete.id));   // optimistic UI
  toast.success(`"${toDelete.title}" removed`);
  setToDelete(null);
};

// Triggered via ConfirmModal
<ConfirmModal
  isOpen={!!toDelete}
  onClose={() => setToDelete(null)}
  onConfirm={handleDelete}
  title="Delete Certification"
  description={`Are you sure you want to delete "${toDelete?.title}"?`}
/>
```

---

## 👤 User CRUD (Admin only)

| Action | File | Notes |
|---|---|---|
| List users | `UserManagement.jsx` | Searchable by name/department |
| View user's certs | `UserCertDetail.jsx` | Route: `/admin/users/:userId/certifications` |
| Edit/delete cert | `AdminCertCard.jsx` → `AdminEditModal.jsx` + `ConfirmModal.jsx` | Admin can manage any user's cert |
| Toggle user active | `UserCard.jsx` | Local UI state toggle (no backend) |

---

## 🗺️ Complete Route Map

| Path | Role | Component |
|---|---|---|
| `/` | any | Smart redirect |
| `/login` | public | `Login.jsx` |
| `/unauthorized` | public | `Unauthorized.jsx` |
| `/user/dashboard` | user | `UserDashboard.jsx` |
| `/user/certifications` | user | `MyCertifications.jsx` |
| `/user/certifications/add` | user | `AddCertification.jsx` |
| `/user/certifications/edit/:id` | user | `EditCertification.jsx` |
| `/user/certifications/:id` | user | `CertificateDetail.jsx` |
| `/user/profile` | user | `Profile.jsx` |
| `/admin/dashboard` | admin | `AdminDashboard.jsx` |
| `/admin/certifications` | admin | `AllCertifications.jsx` |
| `/admin/users` | admin | `UserManagement.jsx` |
| `/admin/users/:userId/certifications` | admin | `UserCertDetail.jsx` |
| `/admin/reports` | admin | `ExpiryReports.jsx` |
| `*` | any | `NotFound.jsx` |

---

## 🔔 Notification & Toast System

- **Toaster** (`sonner`) configured in `AppRouter.jsx` — `position="top-right"`, `richColors`
- `toast.success(...)`, `toast.error(...)` called directly after mutations
- **NotificationPanel** — slide-in drawer from right (`x: 320 → 0`), 4 mock notifications, mark-read per item or all

---

## ♿ Accessibility Highlights

- `ConfirmModal`: `role="alertdialog"`, `aria-modal`, `aria-labelledby`, auto-focuses Cancel, closes on `Escape`
- All icon-only buttons: `aria-label` on every `<button>`
- Avatar dropdown: `aria-expanded`, `aria-haspopup="true"`, `aria-label="Open user menu"`
- Sidebar: keyboard-navigable `NavLink` items

---

## 📊 Data Export (ExpiryReports)

```jsx
// Excel export — xlsx library
import * as XLSX from 'xlsx';
const ws = XLSX.utils.json_to_sheet(rows);      // rows = [{User, Certificate, Org, Expiry, Days}]
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Expiry Report');
XLSX.writeFile(wb, 'expiry-report.xlsx');

// PDF export — browser print-to-PDF (no extra package)
const win = window.open('', '_blank');
win.document.write(`<html>…formatted table HTML…</html>`);
win.document.close();
win.print();
```
#   C e r t r a k  
 