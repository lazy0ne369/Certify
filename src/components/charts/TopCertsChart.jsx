/**
 * TopCertsChart.jsx — FSAD-PS34
 * Bar chart of top 5 most common certification titles.
 */

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell,
} from 'recharts';

function buildData(certificates = []) {
    const freq = {};
    certificates.forEach((c) => {
        freq[c.title] = (freq[c.title] ?? 0) + 1;
    });
    return Object.entries(freq)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([title, count]) => ({
            title: title.length > 22 ? title.slice(0, 22) + '…' : title,
            fullTitle: title,
            count,
        }));
}

const TEAL_SHADES = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { fullTitle, count } = payload[0]?.payload ?? {};
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs max-w-[200px]">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1 leading-snug">{fullTitle}</p>
            <p className="text-teal-600 dark:text-teal-400">{count} user{count !== 1 ? 's' : ''}</p>
        </div>
    );
}

export default function TopCertsChart({ certificates = [] }) {
    const data = buildData(certificates);

    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Top 5 Certifications</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barSize={32} margin={{ top: 4, right: 4, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="title"
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(20,184,166,0.06)' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {data.map((_, i) => <Cell key={i} fill={TEAL_SHADES[i] ?? '#14b8a6'} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
