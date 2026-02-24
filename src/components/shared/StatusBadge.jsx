/**
 * StatusBadge.jsx — FSAD-PS34
 * Pill badge for certificate status with pulse animation on expiring_soon.
 */

import { motion } from 'framer-motion';

const CONFIG = {
    active: {
        label: 'Active',
        classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    expiring_soon: {
        label: 'Expiring Soon',
        classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    expired: {
        label: 'Expired',
        classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    },
};

export default function StatusBadge({ status }) {
    const cfg = CONFIG[status] ?? CONFIG.expired;
    const isExpiring = status === 'expiring_soon';

    return (
        <motion.span
            animate={isExpiring ? { opacity: [1, 0.55, 1] } : {}}
            transition={isExpiring ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.classes}`}
        >
            {/* Status dot */}
            <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'active' ? 'bg-emerald-500' :
                        status === 'expiring_soon' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
            />
            {cfg.label}
        </motion.span>
    );
}
