/**
 * AdminEditModal.jsx — FSAD-PS34
 * Modal wrapper for editing a cert in the admin AllCertifications page.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CertForm from '../../components/ui/CertForm';
import { backdropVariants, modalVariants } from '../../animations/variants';

export default function AdminEditModal({ cert, onClose, onSave }) {
    if (!cert) return null;

    const defaultValues = {
        title: cert.title ?? '',
        organization: cert.organization ?? '',
        issueDate: cert.issueDate ?? '',
        expiryDate: cert.expiryDate ?? '',
        category: cert.category ?? '',
        credentialId: cert.credentialId ?? '',
        description: cert.description ?? '',
    };

    return (
        <AnimatePresence>
            <motion.div
                variants={backdropVariants}
                initial="hidden" animate="visible" exit="exit"
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    variants={modalVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="relative z-50 mx-auto my-10 w-[95vw] max-w-4xl bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Edit Certification</h2>
                        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <CertForm
                        defaultValues={defaultValues}
                        onSubmit={onSave}
                        onCancel={onClose}
                        submitLabel="Save Changes"
                        loading={false}
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
