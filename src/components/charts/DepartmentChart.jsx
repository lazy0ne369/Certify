/**
 * DepartmentChart.jsx — FSAD-PS34
 * Horizontal bar chart: cert count per department.
 */

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LabelList,
} from 'recharts';
import { getCertsByUser } from '../../utils/certHelpers';

const DEPARTMENTS = ['Engineering', 'Analytics', 'Infrastructure', 'Management'];

function buildData(users = []) {
    return DEPARTMENTS.map((dept) => {
        const deptUsers = users.filter((u) => u.department === dept);
        const count = deptUsers.reduce((sum, u) => sum + getCertsByUser(u.id).length, 0);
        return { department: dept, count };
    });
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs">
            <p className="font-semibold text-gray-700 dark:text-gray-200">{label}</p>
            <p className="text-indigo-600 dark:text-indigo-400">{payload[0].value} certificates</p>
        </div>
    );
}

export default function DepartmentChart({ users = [] }) {
    const data = buildData(users);

    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Certs by Department</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    data={data}
                    layout="vertical"
                    barSize={18}
                    margin={{ top: 4, right: 32, left: 4, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="department"
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]}>
                        <LabelList dataKey="count" position="right" style={{ fontSize: 11, fill: '#9ca3af' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
