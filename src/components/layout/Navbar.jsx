/**
 * Navbar.jsx — FSAD-PS34
 * Glassmorphism top bar with dark mode, notifications, user avatar dropdown.
 * < 200 lines
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Bell, ChevronDown, LogOut, User, ShieldCheck, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useUIStore } from '../../store/uiStore';
import { cardVariants } from '../../animations/variants';
import { getInitials, avatarColor } from '../../utils/helpers';

const NOTIF_COUNT = 3;

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { toggleSidebar } = useUIStore();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const profilePath = user?.role === 'admin' ? '/admin/dashboard' : '/user/profile';
    const initials = getInitials(user?.name ?? 'U');
    const bgColor = avatarColor(user?.name ?? '');

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

                {/* Left — Hamburger (mobile) + Logo */}
                <div className="flex items-center gap-2">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation menu"
                        className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Go to home">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <ShieldCheck className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                            Certify
                        </span>
                    </Link>
                </div>

                {/* Right — Controls */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Dark mode toggle — animated icon swap */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        className="relative p-2 w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isDark ? (
                                <motion.span
                                    key="sun"
                                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Sun className="w-5 h-5 text-amber-400" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="moon"
                                    initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Moon className="w-5 h-5" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Notification bell */}
                    <button
                        aria-label="Notifications"
                        className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        {NOTIF_COUNT > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                                {NOTIF_COUNT}
                            </span>
                        )}
                    </button>

                    {/* Avatar + dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            aria-expanded={dropdownOpen}
                            aria-haspopup="true"
                            aria-label="Open user menu"
                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {/* Avatar */}
                            {user?.avatar
                                ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                : (
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${bgColor}`}>
                                        {initials}
                                    </span>
                                )
                            }
                            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                                {user?.name}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute right-0 mt-2 w-52 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden z-50"
                                >
                                    {/* User info row */}
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    {/* Profile link */}
                                    <Link
                                        to={profilePath}
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <User className="w-4 h-4 text-indigo-500" />
                                        Profile
                                    </Link>
                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </header>
    );
}
