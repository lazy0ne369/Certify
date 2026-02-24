/**
 * EmptyState.jsx — FSAD-PS34
 * Centered empty state with icon, title, message, optional action button.
 */

import { motion } from 'framer-motion';
import { FileX } from 'lucide-react';
import { fadeInScale } from '../../animations/variants';

export default function EmptyState({
    title = 'Nothing here yet',
    message = 'No items found.',
    actionLabel,
    onAction,
}) {
    return (
        <motion.div
            variants={fadeInScale}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-20 px-6 text-center"
        >
            <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <FileX className="w-8 h-8 text-indigo-400 dark:text-indigo-300" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">{message}</p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
}
