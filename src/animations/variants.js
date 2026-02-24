/**
 * variants.js — FSAD-PS34
 * Framer Motion animation variants. Import and spread into motion components.
 *
 * Usage:
 *   <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" />
 */

// ── Page Transition ────────────────────────────────────────────────────────────
/** Fade + slide up on enter; fade out on exit */
export const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } },
};

// ── Fade + Scale ───────────────────────────────────────────────────────────────
/** Fade + scale up — used by EmptyState, modals */
export const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};


// ── Card ──────────────────────────────────────────────────────────────────────
/** Fade + scale up from slightly smaller */
export const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// ── Stagger Container ──────────────────────────────────────────────────────────
/** Parent wrapper that staggers its children by 0.1s */
export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
/** Slide in from the left */
export const sidebarVariants = {
    hidden: { opacity: 0, x: -240 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -240, transition: { duration: 0.25, ease: 'easeIn' } },
};

// ── Modal ─────────────────────────────────────────────────────────────────────
/** Scale from 0.95 + fade — use with AnimatePresence */
export const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.2, ease: 'easeIn' } },
};

/** Backdrop for modals */
export const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ── List Item ─────────────────────────────────────────────────────────────────
/** Slide in from the left, used inside staggerContainer */
export const listItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
    },
};

// ── Convenience: card hover / tap ──────────────────────────────────────────────
export const cardHover = {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { scale: 0.97 },
};
