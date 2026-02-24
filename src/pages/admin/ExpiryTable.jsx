/**
 * ExpiryTable.jsx — FSAD-PS34
 * Table displaying expiring certs with user info, days remaining, status, and reminder.
 * < 200 lines sub-component of ExpiryReports.jsx
 */

import { toast } from 'sonner';
import { Bell } from 'lucide-react';
import { proxyUsers } from '../../data/proxyUsers';
import { formatDate } from '../../utils/dateUtils';
import { getDaysRemaining } from '../../utils/certHelpers';
import { getInitials, avatarColor } from '../../utils/helpers';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';

function findOwner(cert) {
    return proxyUsers.find((u) => u.id === cert.issuedTo || u.id === cert.userId) ?? null;
}

function DaysCell({ days }) {
    const color = days < 0 ? 'text-red-500 dark:text-red-400'
        : days <= 30 ? 'text-red-500 dark:text-red-400'
            : days <= 60 ? 'text-amber-500 dark:text-amber-400'
                : 'text-emerald-500 dark:text-emerald-400';
    return (
        <span className={`text-xs font-semibold ${color}`}>
            {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
        </span>
    );
}

function OwnerCell({ cert }) {
    const owner = findOwner(cert);
    const initials = getInitials(owner?.name ?? '?');
    const bgColor = avatarColor(owner?.name ?? '');
    return (
        <div className="flex items-center gap-2 min-w-[120px]">
            {owner?.avatar
                ? <img src={owner.avatar} alt={owner.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                : <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${bgColor}`}>{initials}</span>
            }
            <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                {owner?.name ?? '—'}
            </span>
        </div>
    );
}

const TH = ({ children }) => (
    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
        {children}
    </th>
);
const TD = ({ children, className = '' }) => (
    <td className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${className}`}>
        {children}
    </td>
);

export default function ExpiryTable({ certs }) {
    if (certs.length === 0) {
        return <EmptyState title="No certifications match" message="Try a different filter tab." />;
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 shadow-md">
            <table className="w-full bg-white dark:bg-gray-900 text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                        <TH>User</TH>
                        <TH>Certificate</TH>
                        <TH>Organization</TH>
                        <TH>Expiry Date</TH>
                        <TH>Days Left</TH>
                        <TH>Status</TH>
                        <TH>Action</TH>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {certs.map((cert) => {
                        const owner = findOwner(cert);
                        return (
                            <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                                <TD><OwnerCell cert={cert} /></TD>
                                <TD>
                                    <span className="font-medium text-gray-900 dark:text-white text-xs leading-snug max-w-[160px] block">
                                        {cert.title}
                                    </span>
                                </TD>
                                <TD className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{cert.organization}</TD>
                                <TD className="whitespace-nowrap text-xs">{formatDate(cert.expiryDate)}</TD>
                                <TD><DaysCell days={getDaysRemaining(cert.expiryDate)} /></TD>
                                <TD><StatusBadge status={cert.status} /></TD>
                                <TD>
                                    <button
                                        onClick={() => toast.success(`Reminder sent to ${owner?.name ?? 'user'}!`)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg
                               border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400
                               hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors whitespace-nowrap"
                                    >
                                        <Bell className="w-3 h-3" /> Remind
                                    </button>
                                </TD>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
