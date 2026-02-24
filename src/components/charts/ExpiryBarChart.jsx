/**
 * ExpiryBarChart.jsx — FSAD-PS34
 * Bar chart grouping certs by expiry month for next 6 months.
 * Bar color changes by proximity: red <30d, yellow <90d, green otherwise.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { addMonths, format, startOfMonth, parseISO, isSameMonth } from 'date-fns';
import { getDaysRemaining } from '../../utils/certHelpers';

function buildMonthData(certs) {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
        const monthStart = startOfMonth(addMonths(now, i));
        const matching = certs.filter(
            (c) => c.expiryDate && isSameMonth(parseISO(c.expiryDate), monthStart)
        );
        const days = getDaysRemaining(format(monthStart, 'yyyy-MM-dd'));
        const color =
            days !== null && days < 30 ? '#ef4444' :
                days !== null && days < 90 ? '#f59e0b' : '#10b981';
        return {
            month: format(monthStart, 'MMM yy'),
            count: matching.length,
            color,
            certs: matching.map((c) => c.title),
        };
    });
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const { certs } = payload[0]?.payload ?? {};
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs max-w-[200px]">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
            {certs?.length ? (
                <ul className="space-y-0.5">
                    {certs.map((t, i) => <li key={i} className="text-gray-500 dark:text-gray-400 truncate">• {t}</li>)}
                </ul>
            ) : (
                <p className="text-gray-400">No certs expiring</p>
            )}
        </div>
    );
}

export default function ExpiryBarChart({ certificates = [] }) {
    const data = buildMonthData(certificates);

    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Expiry Timeline (Next 6 Months)</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
