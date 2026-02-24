/**
 * ActivityFeed.jsx — FSAD-PS34
 * Staggered list of recent user activities (hardcoded proxy data).
 * < 200 lines
 */

import { motion } from 'framer-motion';
import { PlusCircle, AlertCircle, Pencil, Download, Share2 } from 'lucide-react';
import { staggerContainer, listItemVariants } from '../../animations/variants';

const DOT_COLORS = {
    add: 'bg-emerald-500',
    expired: 'bg-red-500',
    updated: 'bg-indigo-500',
    download: 'bg-sky-500',
    share: 'bg-violet-500',
};

const ICONS = {
    add: PlusCircle,
    expired: AlertCircle,
    updated: Pencil,
    download: Download,
    share: Share2,
};

// Proxy activities — keyed by userId (all users share the same feed for now)
const ACTIVITIES = [
    { id: 1, type: 'add', text: 'Added AWS Certification', time: '2 days ago' },
    { id: 2, type: 'expired', text: 'Certificate Expired: Google Cloud', time: '5 days ago' },
    { id: 3, type: 'updated', text: 'Updated React Developer Cert', time: '1 week ago' },
    { id: 4, type: 'download', text: 'Downloaded IBM Data Science Certificate', time: '2 weeks ago' },
    { id: 5, type: 'share', text: 'Shared Kubernetes Certificate', time: '3 weeks ago' },
];

export default function ActivityFeed({ userId: _userId }) {
    return (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            </div>

            <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-gray-50 dark:divide-gray-800"
            >
                {ACTIVITIES.map((item) => {
                    const Icon = ICONS[item.type];
                    const dot = DOT_COLORS[item.type];
                    return (
                        <motion.li
                            key={item.id}
                            variants={listItemVariants}
                            className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            {/* Colored dot */}
                            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dot}`} />

                            {/* Icon + text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.text}</p>
                                </div>
                                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{item.time}</p>
                            </div>
                        </motion.li>
                    );
                })}
            </motion.ul>
        </div>
    );
}
