/**
 * Unauthorized.jsx — FSAD-PS34
 * 403 / Access Denied page with lock icon and back button.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Home } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Unauthorized() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const handleBack = () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center max-w-sm w-full"
            >
                {/* Lock icon */}
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                    <span className="flex items-center justify-center w-20 h-20 rounded-3xl bg-red-100 dark:bg-red-900/30 shadow-lg">
                        <Lock className="w-10 h-10 text-red-500 dark:text-red-400" />
                    </span>
                </motion.div>

                {/* Text */}
                <motion.h1 variants={itemVariants}
                    className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                    Access Denied
                </motion.h1>
                <motion.p variants={itemVariants}
                    className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    You don't have permission to view this page.
                </motion.p>
                <motion.p variants={itemVariants}
                    className="text-xs text-gray-400 dark:text-gray-500 mb-8">
                    Contact your administrator if you believe this is a mistake.
                </motion.p>

                {/* Back button */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={handleBack}
                        aria-label="Go back to dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                       text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95
                       transition-all shadow-lg shadow-indigo-500/25"
                    >
                        <Home className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
