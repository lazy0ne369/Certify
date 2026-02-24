/**
 * SkeletonCard.jsx — FSAD-PS34
 * Shimmer skeleton placeholder for cert cards and stat cards during loading.
 */

import { motion } from 'framer-motion';

const shimmer = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
    },
};

const shimmerStyle = {
    background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)',
    backgroundSize: '200% 100%',
};

function ShimmerBlock({ className = '' }) {
    return (
        <motion.div
            {...shimmer}
            style={shimmerStyle}
            className={`rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`}
        />
    );
}

/** Skeleton for a CertCard */
export function CertCardSkeleton() {
    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <ShimmerBlock className="h-36 w-full rounded-none" />
            <div className="p-4 space-y-2.5">
                <ShimmerBlock className="h-4 w-3/4" />
                <ShimmerBlock className="h-3 w-1/2" />
                <ShimmerBlock className="h-3 w-2/3" />
                <div className="flex gap-2 mt-3">
                    <ShimmerBlock className="h-5 w-16 rounded-full" />
                    <ShimmerBlock className="h-5 w-20 rounded-full" />
                </div>
                <ShimmerBlock className="h-9 w-full mt-2" />
            </div>
        </div>
    );
}

/** Skeleton for a StatCard */
export function StatCardSkeleton() {
    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 flex items-start gap-4">
            <ShimmerBlock className="w-12 h-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <ShimmerBlock className="h-3 w-24" />
                <ShimmerBlock className="h-7 w-12" />
                <ShimmerBlock className="h-3 w-20" />
            </div>
        </div>
    );
}

/** Skeleton for a table row */
export function TableRowSkeleton({ cols = 6 }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <ShimmerBlock className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

/** Grid of cert card skeletons */
export function CertGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <CertCardSkeleton key={i} />
            ))}
        </div>
    );
}

/** Row of stat card skeletons */
export function StatRowSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    );
}
