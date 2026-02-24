/**
 * Sidebar.jsx — FSAD-PS34
 * Role-based navigation sidebar with mobile collapse, sidebarVariants animation.
 * < 200 lines
 */

import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Award, PlusCircle, User,
    Users, FileBarChart, X, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { sidebarVariants } from '../../animations/variants';

// ── Link definitions ──────────────────────────────────────────────────────────
const USER_LINKS = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/certifications', label: 'My Certifications', icon: Award },
    { to: '/user/certifications/add', label: 'Add Certification', icon: PlusCircle },
    { to: '/user/profile', label: 'Profile', icon: User },
];

const ADMIN_LINKS = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/certifications', label: 'All Certifications', icon: Award },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/reports', label: 'Expiry Reports', icon: FileBarChart },
];

// ── NavLink style helper ──────────────────────────────────────────────────────
const linkClass = ({ isActive }) =>
    [
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
    ].join(' ');

// ── Sidebar content (shared between desktop + mobile drawer) ──────────────────
function SidebarContent({ onClose }) {
    const { user } = useAuthStore();
    const links = user?.role === 'admin' ? ADMIN_LINKS : USER_LINKS;

    return (
        <div className="flex flex-col h-full">
            {/* Mobile close btn */}
            {onClose && (
                <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Menu</span>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            )}

            {/* Role badge */}
            <div className="px-4 pt-4 pb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                    <ChevronRight className="w-3 h-3" />
                    {user?.role === 'admin' ? 'Admin Panel' : 'My Account'}
                </span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-2 space-y-1">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to.endsWith('dashboard')}
                        onClick={onClose ?? undefined}
                        className={({ isActive }) =>
                            [
                                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 overflow-hidden',
                                isActive
                                    ? 'text-indigo-700 dark:text-indigo-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                            ].join(' ')
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl"
                                        transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                                    />
                                )}
                                <Icon className="relative w-4 h-4 shrink-0" />
                                <span className="relative">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User info at bottom */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.designation}</p>
            </div>
        </div>
    );
}

// ── Exported Sidebar ──────────────────────────────────────────────────────────
export default function Sidebar() {
    const { sidebarOpen, setSidebarOpen } = useUIStore();

    return (
        <>
            {/* ── Desktop sidebar (always visible on lg+) ── */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <SidebarContent />
            </aside>

            {/* ── Mobile drawer ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.aside
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 left-0 z-40 w-72 h-full bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-700 lg:hidden"
                        >
                            <SidebarContent onClose={() => setSidebarOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
