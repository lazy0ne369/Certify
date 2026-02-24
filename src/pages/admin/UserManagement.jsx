/**
 * UserManagement.jsx — FSAD-PS34
 * Admin user management: searchable user list with status toggle, remind, view certs.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

import { proxyUsers } from '../../data/proxyUsers';
import { staggerContainer, listItemVariants } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/shared/EmptyState';
import UserCard from './UserCard';

export default function UserManagement() {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        if (!q) return proxyUsers;
        return proxyUsers.filter(
            (u) => u.name.toLowerCase().includes(q) || u.department?.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <PageWrapper>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">

                {/* Header */}
                <motion.div variants={listItemVariants}>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </span>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {proxyUsers.length} registered users
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Search */}
                <motion.div variants={listItemVariants}>
                    <input
                        type="text"
                        placeholder="Search by name or department…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full h-10 pl-4 pr-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                </motion.div>

                {/* Count */}
                <motion.p variants={listItemVariants} className="text-xs text-gray-400 dark:text-gray-500">
                    Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of{' '}
                    <span className="font-semibold text-gray-600 dark:text-gray-300">{proxyUsers.length}</span> users
                </motion.p>

                {/* User list */}
                {filtered.length === 0 ? (
                    <EmptyState title="No users found" message="Try adjusting your search." />
                ) : (
                    <motion.div variants={staggerContainer} className="space-y-3">
                        {filtered.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </motion.div>
                )}

            </motion.div>
        </PageWrapper>
    );
}
