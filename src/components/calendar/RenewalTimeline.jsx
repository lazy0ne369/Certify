/**
 * RenewalTimeline.jsx — FSAD-PS34
 * Horizontal scrollable Framer Motion timeline of upcoming cert renewals.
 * Sorted soonest first, expired certs excluded, EmptyState fallback.
 * < 200 lines
 */

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { parseISO, compareAsc } from 'date-fns';
import { Clock, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { staggerContainer, listItemVariants } from '../../animations/variants';
import EmptyState from '../shared/EmptyState';
import { getDaysRemaining } from '../../utils/certHelpers';
import { formatDate } from '../../utils/dateUtils';

const STATUS_STYLES = {
    active: {
        border: 'border-emerald-400 dark:border-emerald-600',
        chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        dot: 'bg-emerald-500',
    },
    expiring_soon: {
        border: 'border-amber-400 dark:border-amber-600',
        chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        dot: 'bg-amber-500',
    },
};

function DaysChip({ days, styleKey }) {
    const { chip } = STATUS_STYLES[styleKey] ?? STATUS_STYLES.active;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${chip}`}>
            <Clock className="w-3 h-3" />
            {days === 0 ? 'Today!' : `${days}d left`}
        </span>
    );
}

function TimelineCard({ cert }) {
    const days = getDaysRemaining(cert.expiryDate) ?? 0;
    const styleKey = cert.status === 'expiring_soon' ? 'expiring_soon' : 'active';
    const { border, dot } = STATUS_STYLES[styleKey];

    return (
        <motion.div
            variants={listItemVariants}
            className={`shrink-0 w-52 rounded-xl border-2 ${border} bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col gap-2`}
        >
            {/* Status dot + expiry date */}
            <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    Expires {formatDate(cert.expiryDate)}
                </span>
            </div>

            {/* Title */}
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem]">
                {cert.title}
            </p>

            {/* Org */}
            <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                <Building2 className="w-3 h-3 shrink-0" />
                {cert.organization}
            </p>

            {/* Days chip */}
            <DaysChip days={days} styleKey={styleKey} />
        </motion.div>
    );
}

export default function RenewalTimeline({ certificates = [] }) {
    const scrollRef = useRef(null);

    // Filter out expired, sort soonest first
    const upcoming = certificates
        .filter((c) => c.status !== 'expired' && c.expiryDate)
        .sort((a, b) => compareAsc(parseISO(a.expiryDate), parseISO(b.expiryDate)));

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
        }
    };

    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Upcoming Renewals</h3>
                {upcoming.length > 0 && (
                    <div className="flex gap-1">
                        <button
                            onClick={() => scroll(-1)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                            onClick={() => scroll(1)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                )}
            </div>

            {upcoming.length === 0 ? (
                <EmptyState
                    title="No upcoming renewals"
                    message="All your active certifications are valid well into the future."
                />
            ) : (
                <div ref={scrollRef} className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex gap-3"
                        style={{ width: 'max-content' }}
                    >
                        {upcoming.map((cert) => (
                            <TimelineCard key={cert.id} cert={cert} />
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
