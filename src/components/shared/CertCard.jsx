/**
 * CertCard.jsx — FSAD-PS34
 * Certificate card with status border, badge image, dates, StatusBadge,
 * CountdownTimer, category chip, and "View Details" button.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Calendar, ArrowRight, Building2 } from 'lucide-react';
import { cardVariants, cardHover } from '../../animations/variants';
import StatusBadge from './StatusBadge';
import CountdownTimer from './CountdownTimer';
import { formatDate } from '../../utils/dateUtils';

const BORDER_COLOR = {
    active: 'border-l-emerald-500',
    expiring_soon: 'border-l-amber-500',
    expired: 'border-l-red-500',
};

const CATEGORY_COLORS = {
    Cloud: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    DevOps: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    Data: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    Frontend: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
};

export default function CertCard({ cert }) {
    const navigate = useNavigate();
    const borderColor = BORDER_COLOR[cert.status] ?? 'border-l-gray-300';
    const catColor = CATEGORY_COLORS[cert.category] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            {...cardHover}
            className={`rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 border-l-4 ${borderColor} overflow-hidden flex flex-col`}
        >
            {/* Badge image / placeholder */}
            <div className="relative h-28 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                {cert.badgeUrl ? (
                    <img
                        src={cert.badgeUrl}
                        alt={cert.title}
                        className="h-20 w-20 object-contain drop-shadow"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <Award className="w-14 h-14 text-indigo-300 dark:text-indigo-600" />
                )}
                {/* Category chip — top-right */}
                <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                    {cert.category}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Title + org */}
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                        {cert.title}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                        <Building2 className="w-3 h-3 shrink-0" />
                        {cert.organization}
                    </p>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{formatDate(cert.issueDate)}</span>
                    <span>→</span>
                    <span>{formatDate(cert.expiryDate)}</span>
                </div>

                {/* Status + countdown */}
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={cert.status} />
                    <CountdownTimer expiryDate={cert.expiryDate} />
                </div>

                {/* View Details button */}
                <button
                    onClick={() => navigate(`/user/certifications/${cert.id}`)}
                    className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
}
