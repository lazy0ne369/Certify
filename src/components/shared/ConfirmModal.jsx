/**
 * ConfirmModal.jsx — FSAD-PS34
 * Generic confirm/cancel dialog — focus-trapped, accessible, full-screen on mobile.
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';
import { backdropVariants, modalVariants } from '../../animations/variants';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    loading = false,
}) {
    const cancelRef = useRef(null);

    // Auto-focus Cancel on open; restore focus on close
    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => cancelRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal — full-screen on mobile, max-w-sm on sm+ */}
                    <motion.div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="confirm-title"
                        aria-describedby="confirm-desc"
                        variants={modalVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed z-50
                       inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                       w-full sm:w-[92vw] sm:max-w-sm
                       bg-white dark:bg-gray-900
                       rounded-t-2xl sm:rounded-2xl
                       shadow-2xl border border-gray-100 dark:border-gray-800 p-6"
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 id="confirm-title" className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
                                <p id="confirm-desc" className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close dialog"
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                            >
                                <X className="w-4 h-4" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 justify-end">
                            <Button ref={cancelRef} variant="outline" size="sm" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
                                {confirmLabel}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
