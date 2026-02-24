/**
 * UserCard.jsx — FSAD-PS34
 * Single user row card for UserManagement page.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Briefcase, Award, CheckCircle, Eye, Bell, Building2 } from 'lucide-react';
import { cardVariants } from '../../animations/variants';
import { getCertsByUser } from '../../utils/certHelpers';
import { getInitials, avatarColor } from '../../utils/helpers';

export default function UserCard({ user }) {
    const navigate = useNavigate();
    const [active, setActive] = useState(true);
    const certs = getCertsByUser(user.id);
    const activeCerts = certs.filter((c) => c.status === 'active').length;
    const initials = getInitials(user.name);
    const bgColor = avatarColor(user.name);

    return (
        <motion.div
            variants={cardVariants}
            className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5"
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900" />
                    ) : (
                        <span className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${bgColor}`}>
                            {initials}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {user.designation}
                        </span>
                        <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {user.department}
                        </span>
                    </div>
                </div>

                {/* Cert stats */}
                <div className="flex gap-3 shrink-0">
                    <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                        <Award className="w-3.5 h-3.5 text-indigo-500 mb-0.5" />
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{certs.length}</span>
                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400">Total</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mb-0.5" />
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{activeCerts}</span>
                        <span className="text-[10px] text-emerald-500 dark:text-emerald-400">Active</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                        onClick={() => navigate(`/admin/users/${user.id}/certifications`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl
                       border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400
                       hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" /> View Certs
                    </button>
                    <button
                        onClick={() => toast.success(`Reminder sent to ${user.name}!`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl
                       border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400
                       hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                        <Bell className="w-3.5 h-3.5" /> Remind
                    </button>
                    <button
                        onClick={() => setActive((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors
              ${active
                                ? 'border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            }`}
                    >
                        {active ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
