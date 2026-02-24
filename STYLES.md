# FSAD-PS34 — Styles & Animations Reference

> Design system, Tailwind conventions, dark mode, glassmorphism, and every Framer Motion animation used across the platform.

---

## 🎨 Design Tokens

| Token | Value | Usage |
|---|---|---|
| **Primary** | `indigo-600` / `#4f46e5` | Buttons, active links, highlights |
| **Font** | `Inter` (Google Fonts) | All text globally |
| **Border radius** | `rounded-xl` | Cards · `rounded-2xl` modals · `rounded-full` badges |
| **Shadow** | `shadow-md` | Cards · `shadow-lg` modals/buttons |
| **Min width** | `375px` | Mobile breakpoint |

```html
<!-- index.html — Inter font loaded -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

```css
/* src/index.css */
body { font-family: 'Inter', sans-serif; }
```

---

## 🌑 Dark Mode System

Dark mode is managed by **`src/store/themeStore.js`** (Zustand + `localStorage`).

```js
// themeStore.js
function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
}

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((s) => {
        const next = !s.isDark;
        applyTheme(next);
        return { isDark: next };
      }),
    }),
    {
      name: 'fsad-theme',
      onRehydrateStorage: () => (state) => { if (state) applyTheme(state.isDark); },
    }
  )
);
```

`App.jsx` has a `useEffect` that re-applies the class on `isDark` change as a React-side fallback.

### Tailwind Configuration — `tailwind.config.js`
```js
darkMode: 'class'   // 'dark' class on <html> element
```

### Dark Mode Class Convention

| Element | Light | Dark |
|---|---|---|
| Page background | `bg-gray-50` | `dark:bg-gray-950` |
| Card background | `bg-white` | `dark:bg-gray-900` |
| Glassmorphism card | `bg-white/80` | `dark:bg-gray-800/80` |
| Primary text | `text-gray-900` | `dark:text-white` |
| Muted text | `text-gray-500` | `dark:text-gray-400` |
| Border | `border-gray-200` | `dark:border-gray-700` |
| Input | `bg-white` | `dark:bg-gray-700` |
| Sidebar | `bg-white` | `dark:bg-gray-900` |
| Navbar | `bg-white/80` | `dark:bg-gray-900/80` |

---

## 🪟 Glassmorphism

Applied to the **Navbar** and **modal backdrops**:

```jsx
// Navbar — src/components/layout/Navbar.jsx
<header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80
                   border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm">

// Modal backdrop
<motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
```

---

## 🎭 Framer Motion Animations

All variants are defined in **`src/animations/variants.js`** and imported where needed.

```js
// src/animations/variants.js

export const pageVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const listItemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const cardVariants = {
  hidden:  { opacity: 0, scale: 0.97, y: 12 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.3 } },
  exit:    { opacity: 0, scale: 0.97, y: -8 },
};

export const cardHover = {
  whileHover: { y: -3, transition: { duration: 0.18 } },
  whileTap:   { scale: 0.98 },
};

export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

export const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

export const sidebarVariants = {
  hidden:  { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};
```

---

## 📄 Page Transition

Every page is wrapped by **`src/components/layout/PageWrapper.jsx`**:

```jsx
// PageWrapper.jsx
import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/variants';

export default function PageWrapper({ children }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex-1 p-4 sm:p-6 min-h-[calc(100vh-4rem)]
                 bg-gray-50 dark:bg-gray-950"
    >
      {children}
    </motion.main>
  );
}
```

---

## 🃏 Staggered Card Grid

Used in **`MyCertifications`**, **`AllCertifications`**, **`UserCertDetail`**:

```jsx
// Motion wrapper on the grid
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
>
  {certs.map((cert) => (
    <motion.div key={cert.id} variants={cardVariants}>
      <CertCard cert={cert} />
    </motion.div>
  ))}
</motion.div>
```

---

## 📊 StatCard — Animated Number Counter

**`src/components/shared/StatCard.jsx`**

```jsx
import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

function AnimatedNumber({ value }) {
  const count   = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: 'easeOut' });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}
```

Counts from **0 → final value** in 1 second on mount, every time the page loads.

---

## 🌙 Navbar Dark Mode Toggle — Animated Icon Swap

**`src/components/layout/Navbar.jsx`**

```jsx
<button onClick={toggleTheme} className="relative w-9 h-9 overflow-hidden ...">
  <AnimatePresence mode="wait" initial={false}>
    {isDark ? (
      <motion.span
        key="sun"
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={{ opacity: 1, scale: 1,   rotate: 0   }}
        exit   ={{ opacity: 0, scale: 0.5, rotate:  90 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-amber-400" />
      </motion.span>
    ) : (
      <motion.span
        key="moon"
        initial={{ opacity: 0, scale: 0.5, rotate:  90 }}
        animate={{ opacity: 1, scale: 1,   rotate: 0   }}
        exit   ={{ opacity: 0, scale: 0.5, rotate: -90 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5" />
      </motion.span>
    )}
  </AnimatePresence>
</button>
```

`mode="wait"` ensures the exiting icon fully disappears before the new one enters.

---

## 🧭 Sidebar — Active Link Spring Indicator

**`src/components/layout/Sidebar.jsx`**

```jsx
// Shared layoutId → Framer Motion animates the background between active links
{isActive && (
  <motion.div
    layoutId="sidebar-active"
    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl"
    transition={{ type: 'spring', stiffness: 380, damping: 35 }}
  />
)}
<Icon className="relative w-4 h-4 shrink-0" />
<span className="relative">{label}</span>
```

The `layoutId` prop makes Framer Motion **smoothly slide** the background pill from the old active link to the new one on navigation.

---

## 📱 Sidebar — Mobile Drawer Slide-In

**`src/components/layout/Sidebar.jsx`**

```jsx
<AnimatePresence>
  {sidebarOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer — uses sidebarVariants: x: '-100%' → 0 */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden" animate="visible" exit="exit"
        className="fixed top-0 left-0 z-40 w-72 h-full bg-white dark:bg-gray-900
                   shadow-2xl border-r border-gray-200 dark:border-gray-700 lg:hidden"
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </motion.aside>
    </>
  )}
</AnimatePresence>
```

---

## 🪟 Modals — Scale + Fade

**`src/components/shared/ConfirmModal.jsx`** and **`AdminEditModal.jsx`**

```jsx
// Backdrop fades in independently
<motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

// Modal panel scales from 0.95 → 1 while fading in
<motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit"
  className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
             // mobile: bottom sheet
             inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2
             w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl ...">
```

**Mobile sheet pattern**: On `< sm` screens the modal slides up from the bottom with `rounded-t-2xl`. On `sm+` it's a centered overlay.

---

## 🎉 Canvas Confetti — AddCertification

**`src/pages/user/AddCertification.jsx`**

```js
import canvasConfetti from 'canvas-confetti';

function fireConfetti() {
  const burst = (angle, spread) =>
    canvasConfetti({
      particleCount: 60,
      angle, spread,
      origin: { x: 0.5, y: 0.3 },
      colors: ['#4f46e5', '#818cf8', '#fbbf24', '#fff', '#34d399'],
      scalar: 1.1,
      zIndex: 9999,
    });

  burst(60, 70);                              // left burst
  setTimeout(() => burst(120, 70), 150);      // right burst, 150ms delayed
}
```

Triggered after `addCertificate()` is called and `toast.success()` fires.

---

## 💀 Skeleton Loaders

**`src/components/shared/SkeletonCard.jsx`**

The shimmer effect uses Framer Motion `backgroundPosition` animation:

```jsx
const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
};

const shimmerStyle = {
  background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)',
  backgroundSize: '200% 100%',
};

function ShimmerBlock({ className = '' }) {
  return (
    <motion.div {...shimmer} style={shimmerStyle}
      className={`rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />
  );
}
```

**Exported components:**

| Export | Used In | Shape |
|---|---|---|
| `CertCardSkeleton` | MyCertifications | Card with image area + 3 text lines + badge row |
| `StatCardSkeleton` | UserDashboard | Icon circle + 3 text lines |
| `CertGridSkeleton` | MyCertifications | 6 × CertCardSkeleton |
| `StatRowSkeleton` | UserDashboard, AdminDashboard | 4 × StatCardSkeleton |
| `TableRowSkeleton` | (available) | N column shimmer cells |

**`src/hooks/usePageLoader.js`** — 800 ms loading hook:
```js
export function usePageLoader(ms = 800) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return { loading };
}
```

Used in **UserDashboard**, **AdminDashboard**, **MyCertifications** — shows skeleton while `loading === true`, then renders actual content.

---

## 🔔 Notification Panel — Slide from Right

**`src/components/shared/NotificationPanel.jsx`**

```js
const SLIDE_IN = {
  hidden:  { opacity: 0, x: 320 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 320, transition: { duration: 0.25, ease: 'easeIn' } },
};
```

Panel is a fixed `w-80 sm:w-96` aside rendered via `AnimatePresence`. Backdrop (`bg-black/30 backdrop-blur-sm`) fades independently.

---

## 🃏 CertCard — Hover Lift

**`src/components/shared/CertCard.jsx`** and **`StatCard.jsx`**

```jsx
import { cardHover } from '../../animations/variants';

<motion.div
  variants={cardVariants}
  {...cardHover}           // whileHover: { y: -3 }, whileTap: { scale: 0.98 }
  className="rounded-xl shadow-md bg-white dark:bg-gray-900 ..."
>
```

---

## 📊 Charts (Recharts)

All charts in **`src/components/charts/`** use dark-aware stroke/fill colors:

```jsx
// CertDonutChart.jsx — example
<PieChart>
  <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={100}>
    {data.map((entry) => (
      <Cell key={entry.name} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip
    contentStyle={{
      backgroundColor: isDark ? '#1f2937' : '#fff',
      border: '1px solid #374151',
      borderRadius: '8px',
    }}
  />
</PieChart>
```

Charts are wrapped in `<div className="overflow-x-auto">` for horizontal scroll on mobile.

---

## 📦 Color Palette Reference

```js
// src/utils/helpers.js — avatarColor()
const COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-sky-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];
// Deterministic: sum of char codes % COLORS.length
```

Status colors (used in `StatusBadge` and `ExpiryTable`):

| Status | Background | Text |
|---|---|---|
| `active` | `bg-emerald-100 dark:bg-emerald-900/30` | `text-emerald-700 dark:text-emerald-400` |
| `expiring_soon` | `bg-amber-100 dark:bg-amber-900/30` | `text-amber-700 dark:text-amber-400` |
| `expired` | `bg-red-100 dark:bg-red-900/30` | `text-red-700 dark:text-red-400` |

Days Left color coding (`ExpiryTable.jsx`):
```js
const daysColor = days < 0      ? 'text-red-500'    // expired
               : days <= 30     ? 'text-orange-500'  // critical
               : days <= 90     ? 'text-amber-500'   // warning
               :                  'text-emerald-500'; // safe
```

---

## 🌐 Responsive Grid Summary

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| StatCards | `grid-cols-2` | `grid-cols-2` | `lg:grid-cols-4` |
| CertCard grid | `grid-cols-1` | `sm:grid-cols-2` | `lg:grid-cols-3` |
| Dashboard rows | `grid-cols-1` | `grid-cols-1` | `lg:grid-cols-5` |
| Sidebar | hidden (hamburger) | hidden (hamburger) | `lg:flex` fixed |
