/**
 * StatCard.jsx — FSAD-PS34
 * Animated stat card with counter, icon, trend text, hover lift.
 */

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cardVariants, cardHover } from '../../animations/variants';

function AnimatedNumber({ value }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v));
    const ref = useRef(null);

    useEffect(() => {
        const controls = animate(count, value, { duration: 1, ease: 'easeOut' });
        return controls.stop;
    }, [value, count]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatCard({ title, value, icon: Icon, color = 'indigo', trend }) {
    const colorMap = {
        indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', icon: 'text-indigo-600 dark:text-indigo-400' },
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', icon: 'text-emerald-600 dark:text-emerald-400' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', icon: 'text-amber-600 dark:text-amber-400' },
        red: { bg: 'bg-red-100 dark:bg-red-900/40', icon: 'text-red-600 dark:text-red-400' },
    };

    const c = colorMap[color] ?? colorMap.indigo;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            {...cardHover}
            className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 flex items-start gap-4 cursor-default"
        >
            {/* Icon circle */}
            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${c.bg}`}>
                {Icon && <Icon className={`w-5 h-5 ${c.icon}`} />}
            </div>

            {/* Text */}
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mt-0.5">
                    <AnimatedNumber value={Number(value) || 0} />
                </p>
                {trend && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{trend}</p>
                )}
            </div>
        </motion.div>
    );
}
