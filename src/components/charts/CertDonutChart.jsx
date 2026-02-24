/**
 * CertDonutChart.jsx — FSAD-PS34
 * Donut pie chart for certificate status breakdown. Recharts + dark mode.
 */

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SLICES = [
    { key: 'active', label: 'Active', color: '#10b981' },
    { key: 'expiringSoon', label: 'Expiring Soon', color: '#f59e0b' },
    { key: 'expired', label: 'Expired', color: '#ef4444' },
];

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs">
            <p className="font-semibold text-gray-700 dark:text-gray-200">{name}</p>
            <p className="text-gray-500 dark:text-gray-400">{value} cert{value !== 1 ? 's' : ''}</p>
        </div>
    );
}

function CenterLabel({ cx, cy, total }) {
    return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
            <tspan x={cx} dy="-6" fontSize="22" fontWeight="700" fill="#4f46e5" fontFamily="Inter, sans-serif">
                {total}
            </tspan>
            <tspan x={cx} dy="20" fontSize="11" fill="#9ca3af" fontFamily="Inter, sans-serif">
                Total
            </tspan>
        </text>
    );
}

export default function CertDonutChart({ stats = {} }) {
    const { total = 0, active = 0, expiringSoon = 0, expired = 0 } = stats;

    const data = [
        { name: 'Active', value: active },
        { name: 'Expiring Soon', value: expiringSoon },
        { name: 'Expired', value: expired },
    ];

    const cx = '50%';
    const cy = '50%';

    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx={cx} cy={cy}
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                    >
                        {SLICES.map((s, i) => (
                            <Cell key={s.key} fill={s.color} />
                        ))}
                        <CenterLabel cx="50%" cy="50%" total={total} />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                            <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
