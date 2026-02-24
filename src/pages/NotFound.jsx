/**
 * NotFound.jsx — FSAD-PS34
 * 404 page with bounce animation and back-to-dashboard button.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const bounceVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 12,
            delay: 0.1,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.2 + i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
};

export default function NotFound() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const handleBack = () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md w-full">
                {/* 404 number */}
                <motion.div
                    variants={bounceVariants}
                    initial="hidden"
                    animate="visible"
                    className="select-none"
                >
                    <span className="text-[9rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                        404
                    </span>
                </motion.div>

                {/* Icon */}
                <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex justify-center mb-4">
                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40">
                        <AlertCircle className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </span>
                </motion.div>

                {/* Text */}
                <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Page not found
                </motion.h1>
                <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
                    className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </motion.p>

                {/* Back button */}
                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
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
            </div>
        </div>
    );
}
