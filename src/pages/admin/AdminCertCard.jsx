/**
 * AdminCertCard.jsx — FSAD-PS34
 * CertCard with user identity row + admin edit/delete action buttons.
 */

import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { cardVariants } from '../../animations/variants';
import CertCard from '../../components/shared/CertCard';
import { getInitials, avatarColor } from '../../utils/helpers';

export default function AdminCertCard({ cert, ownerUser, onEdit, onDelete }) {
    const initials = getInitials(ownerUser?.name ?? '?');
    const bgColor = avatarColor(ownerUser?.name ?? '');

    return (
        <motion.div variants={cardVariants} className="flex flex-col">
            {/* Owner identity row */}
            <div className="flex items-center gap-2 mb-1 px-1">
                {ownerUser?.avatar ? (
                    <img src={ownerUser.avatar} alt={ownerUser.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0" />
                ) : (
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${bgColor}`}>
                        {initials}
                    </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{ownerUser?.name ?? 'Unknown'}</span>
            </div>

            {/* CertCard */}
            <CertCard cert={cert} />

            {/* Action row */}
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => onEdit(cert)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium
                     text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800
                     rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                    onClick={() => onDelete(cert)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium
                     text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900
                     rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
            </div>
        </motion.div>
    );
}
