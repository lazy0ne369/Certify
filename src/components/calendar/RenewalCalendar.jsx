/**
 * RenewalCalendar.jsx — FSAD-PS34
 * FullCalendar daygrid showing cert expiry events, color-coded by status.
 * < 200 lines
 */

import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { getDaysRemaining } from '../../utils/certHelpers';
import { cardVariants } from '../../animations/variants';

const STATUS_COLORS = {
    active: { bg: '#10b981', border: '#059669' },
    expiring_soon: { bg: '#f59e0b', border: '#d97706' },
    expired: { bg: '#ef4444', border: '#dc2626' },
};

function buildEvents(certificates = []) {
    return certificates
        .filter((c) => c.expiryDate)
        .map((c) => ({
            id: c.id,
            title: c.title,
            date: c.expiryDate,
            backgroundColor: STATUS_COLORS[c.status]?.bg ?? '#6366f1',
            borderColor: STATUS_COLORS[c.status]?.border ?? '#4f46e5',
            textColor: '#ffffff',
            extendedProps: { cert: c },
        }));
}

function EventPopover({ info, onClose }) {
    const cert = info?.event?.extendedProps?.cert;
    if (!cert) return null;
    const days = getDaysRemaining(cert.expiryDate);
    const rect = info?.el?.getBoundingClientRect?.() ?? {};

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ top: (rect.bottom ?? 0) + window.scrollY + 6, left: Math.min(rect.left ?? 0, window.innerWidth - 240) }}
            className="fixed z-50 w-56 rounded-xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-3 text-xs"
        >
            <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="font-semibold text-gray-800 dark:text-white leading-snug">{cert.title}</p>
                <button onClick={onClose} className="shrink-0 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-1">{cert.organization}</p>
            <p className={`font-medium ${days === null ? 'text-gray-400' :
                    days < 0 ? 'text-red-500' :
                        days <= 90 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                {days === null ? '—' :
                    days < 0 ? `Expired ${Math.abs(days)}d ago` :
                        `${days} day${days !== 1 ? 's' : ''} remaining`}
            </p>
        </motion.div>
    );
}

export default function RenewalCalendar({ certificates = [] }) {
    const [popover, setPopover] = useState(null);
    const wrapRef = useRef(null);

    const events = buildEvents(certificates);

    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setPopover(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={wrapRef} className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 renewal-calendar">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Renewal Calendar</h3>
            </div>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
                height="auto"
                eventClick={(info) => {
                    info.jsEvent.preventDefault();
                    setPopover((prev) => prev?.event?.id === info.event.id ? null : info);
                }}
                eventClassNames="cursor-pointer text-[10px] px-1 truncate"
            />

            <AnimatePresence>
                {popover && <EventPopover info={popover} onClose={() => setPopover(null)} />}
            </AnimatePresence>
        </div>
    );
}
