/**
 * AdminDashboard.jsx — FSAD-PS34
 * Org-wide certification analytics dashboard for admins.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, AlertTriangle, XCircle } from 'lucide-react';

import { proxyUsers } from '../../data/proxyUsers';
import { proxyCertificates } from '../../data/proxyCertificates';
import { staggerContainer, listItemVariants } from '../../animations/variants';

import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/shared/StatCard';
import CertDonutChart from '../../components/charts/CertDonutChart';
import ExpiryBarChart from '../../components/charts/ExpiryBarChart';
import DepartmentChart from '../../components/charts/DepartmentChart';
import TopCertsChart from '../../components/charts/TopCertsChart';
import ActivityChart from '../../components/charts/ActivityChart';
import { StatRowSkeleton } from '../../components/shared/SkeletonCard';
import { usePageLoader } from '../../hooks/usePageLoader';

// ── Org-wide stat derivation ──────────────────────────────────────────────────
function useOrgStats() {
    return useMemo(() => {
        const certs = proxyCertificates;
        return {
            totalUsers: proxyUsers.length,
            totalCerts: certs.length,
            active: certs.filter((c) => c.status === 'active').length,
            expiringSoon: certs.filter((c) => c.status === 'expiring_soon').length,
            expired: certs.filter((c) => c.status === 'expired').length,
        };
    }, []);
}

const STAT_DEFS = [
    { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'sky', trend: 'registered' },
    { key: 'totalCerts', label: 'Total Certifications', icon: Award, color: 'indigo', trend: 'org-wide' },
    { key: 'expiringSoon', label: 'Expiring Soon', icon: AlertTriangle, color: 'amber', trend: 'need action' },
    { key: 'expired', label: 'Expired', icon: XCircle, color: 'red', trend: 'overdue' },
];

export default function AdminDashboard() {
    const stats = useOrgStats();
    const { loading } = usePageLoader(800);

    if (loading) {
        return (
            <PageWrapper>
                <div className="space-y-6">
                    <div className="h-8 w-56 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <StatRowSkeleton count={4} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* ── Header ── */}
                <motion.div variants={listItemVariants}>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Organization-wide certification overview
                    </p>
                </motion.div>

                {/* ── Row 1: Stat Cards ── */}
                <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {STAT_DEFS.map(({ key, label, icon, color, trend }) => (
                        <motion.div key={key} variants={listItemVariants}>
                            <StatCard
                                title={label}
                                value={stats[key] ?? 0}
                                icon={icon}
                                color={color}
                                trend={trend}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── Row 2: Donut + Expiry Bar ── */}
                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CertDonutChart stats={{
                        total: stats.totalCerts,
                        active: stats.active,
                        expiringSoon: stats.expiringSoon,
                        expired: stats.expired,
                    }} />
                    <ExpiryBarChart certificates={proxyCertificates} />
                </motion.div>

                {/* ── Row 3: Department + Top Certs ── */}
                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <DepartmentChart users={proxyUsers} />
                    <TopCertsChart certificates={proxyCertificates} />
                </motion.div>

                {/* ── Row 4: Activity Chart (full width) ── */}
                <motion.div variants={listItemVariants}>
                    <ActivityChart />
                </motion.div>

            </motion.div>
        </PageWrapper>
    );
}
