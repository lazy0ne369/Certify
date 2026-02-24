# FSAD-PS34: Professional Skill Certification Tracking Platform

## What This Project Is About

A full-stack web application for professionals to manage their certifications—think of it as a digital certification wallet. Users can track all certifications, receive expiry notifications, and store/access certificates digitally. Admins oversee all records, trigger renewals, and verify certifications across the organization.

---

## Folder Structure

### Frontend (Vite + React + Tailwind + Framer Motion)

```
frontend/
├── public/
│   └── assets/             # static images, icons
├── src/
│   ├── assets/             # fonts, logos, illustrations
│   ├── components/
│   │   ├── ui/             # reusable: Button, Modal, Badge, Card, Input
│   │   ├── layout/         # Navbar, Sidebar, Footer, PageWrapper
│   │   ├── charts/         # Recharts/Chart.js wrappers
│   │   └── shared/         # Loader, Toast, ConfirmDialog, EmptyState
│   ├── pages/
│   │   ├── auth/           # Login, Register, ForgotPassword
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageCertifications.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── ExpiryReports.jsx
│   │   └── user/
│   │       ├── Dashboard.jsx
│   │       ├── MyCertifications.jsx
│   │       ├── AddCertification.jsx
│   │       └── CertificateViewer.jsx
│   ├── hooks/              # useAuth, useCertifications, useNotifications
│   ├── context/            # AuthContext, ThemeContext
│   ├── services/           # axios API calls (authService, certService)
│   ├── store/              # Zustand or Redux slices
│   ├── utils/              # dateHelpers, validators, formatters
│   ├── animations/         # Framer Motion variants (pageTransitions, cardAnimations)
│   ├── routes/             # ProtectedRoute, AdminRoute, AppRouter
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Tools & Libraries for Frontend

| Purpose       | Tool/Library          |
| ------------- | --------------------- |
| Build Tool    | Vite                  |
| UI Framework  | React 18              |
| Styling       | Tailwind CSS          |
| Animations    | Framer Motion         |
| Routing       | React Router v6       |
| State Mgmt    | Zustand               |
| HTTP Client   | Axios                 |
| Charts        | Recharts              |
| Forms         | React Hook Form + Zod |
| Date Handling | date-fns              |
| PDF Viewer    | react-pdf             |
| Notifications | react-hot-toast       |
| Icons         | Lucide React          |

---

## Advanced UI Features

### Animations & Interactions

- Page transition animations (Framer Motion AnimatePresence)
- Staggered card entrance animations
- Animated progress rings for certification health score
- Drag-to-reorder certifications (@dnd-kit)

### Dashboard UX

- Radial/donut chart for certification status breakdown
- Timeline view for upcoming renewals (Gantt-style scroll)
- Expiry countdown badges with color-coded urgency and pulse animations

### Certificate Viewer

- In-app PDF viewer with zoom, pan, and modal overlay
- QR code generation per certificate for quick verification

### Micro-interactions

- Skeleton loaders
- Optimistic UI updates
- Confetti burst animation on new certification
- Smooth number counters on stat cards

### Theme & Accessibility

- Dark/Light mode toggle with smooth transitions
- Glassmorphism cards with backdrop-blur
- Fully keyboard navigable modals and dropdowns

---

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

---

## License

MIT License

---

## Author

FSAD-PS34 Team
