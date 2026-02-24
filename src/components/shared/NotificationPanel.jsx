/**
 * NotificationPanel.jsx — FSAD-PS34
 * Slide-in notification drawer from the right side.
 * < 200 lines
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, XCircle, Bell } from 'lucide-react';

const SLIDE_IN = {
    hidden: { opacity: 0, x: 320 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: 320, transition: { duration: 0.25, ease: 'easeIn' } },
};

const NOTIFS_INIT = [
    {
        id: 1, type: 'warning',
        message: 'AWS Certificate expiring in 45 days',
        time: 'Just now',
        read: false,
    },
    {
        id: 2, type: 'danger',
        message: 'React Dev Certificate expiring in 20 days',
        time: '10 min ago',
        read: false,
    },
    {
        id: 3, type: 'success',
        message: 'New certificate added successfully',
        time: '1 hour ago',
        read: false,
    },
    {
        id: 4, type: 'danger',
        message: 'Terraform certificate has expired',
        time: 'Yesterday',
        read: false,
    },
];

const TYPE_CONFIG = {
    warning: { icon: AlertTriangle, iconClass: 'text-amber-500', bg: 'bg-amber-50  dark:bg-amber-900/20' },
    danger: { icon: XCircle, iconClass: 'text-red-500', bg: 'bg-red-50    dark:bg-red-900/20' },
    success: { icon: CheckCircle, iconClass: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
};

export default function NotificationPanel({ isOpen, onClose }) {
    const [notifs, setNotifs] = useState(NOTIFS_INIT);

    const markRead = (id) =>
        setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

    const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.aside
                        variants={SLIDE_IN}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 right-0 z-50 h-full w-80 sm:w-96 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h2>
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                    {notifs.filter((n) => !n.read).length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Mark all read
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <ul className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                            {notifs.map((n) => {
                                const { icon: Icon, iconClass, bg } = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.warning;
                                return (
                                    <li
                                        key={n.id}
                                        className={`flex gap-3 px-5 py-4 transition-colors ${n.read ? 'opacity-60' : ''} ${bg}`}
                                    >
                                        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{n.message}</p>
                                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{n.time}</p>
                                            {!n.read && (
                                                <button
                                                    onClick={() => markRead(n.id)}
                                                    className="mt-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                        {!n.read && (
                                            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
