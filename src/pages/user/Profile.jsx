/**
 * Profile.jsx — FSAD-PS34
 * User profile page — left card + right edit form + change password section.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Lock, User } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { staggerContainer, listItemVariants } from '../../animations/variants';
import PageWrapper from '../../components/layout/PageWrapper';
import ProfileCard from './ProfileCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const DEPARTMENTS = ['Engineering', 'Analytics', 'Infrastructure', 'Management'];

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    designation: z.string().min(2, 'Designation is required'),
    department: z.string().min(1, 'Department is required'),
});

const cls = 'w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

export default function Profile() {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name ?? '',
            designation: user?.designation ?? '',
            department: user?.department ?? '',
        },
    });

    const onSave = async (data) => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 600));
        updateUser(data);
        setSaving(false);
        toast.success('Profile updated successfully!');
    };

    const Lbl = ({ children }) => (
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{children}</label>
    );
    const Err = ({ msg }) => msg ? <p className="text-xs text-red-500 mt-0.5">{msg}</p> : null;

    return (
        <PageWrapper>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">

                {/* Header */}
                <motion.div variants={listItemVariants}>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </span>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal information</p>
                        </div>
                    </div>
                </motion.div>

                {/* Two-column layout */}
                <motion.div variants={listItemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* LEFT — Profile Card */}
                    <div className="lg:col-span-2">
                        <ProfileCard user={user} />
                    </div>

                    {/* RIGHT — Edit Form */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Edit profile section */}
                        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Edit Profile</h2>
                            <form onSubmit={handleSubmit(onSave)} className="space-y-4" noValidate>
                                <div>
                                    <Lbl>Full Name *</Lbl>
                                    <input {...register('name')} placeholder="Your full name" className={cls} />
                                    <Err msg={errors.name?.message} />
                                </div>
                                <div>
                                    <Lbl>Designation *</Lbl>
                                    <input {...register('designation')} placeholder="e.g. Software Engineer" className={cls} />
                                    <Err msg={errors.designation?.message} />
                                </div>
                                <div>
                                    <Lbl>Department *</Lbl>
                                    <select {...register('department')} className={cls}>
                                        <option value="" disabled>Select department</option>
                                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <Err msg={errors.department?.message} />
                                </div>
                                <div>
                                    <Lbl>Email (cannot be changed)</Lbl>
                                    <input
                                        value={user?.email ?? ''}
                                        disabled
                                        className={`${cls} opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800`}
                                    />
                                </div>
                                <Button type="submit" variant="primary" size="md" loading={saving}>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </form>
                        </div>

                        {/* Change Password section (UI only) */}
                        <div className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Change Password</h2>
                            </div>
                            <div className="space-y-3">
                                <Input label="Current Password" type="password" placeholder="••••••••" />
                                <Input label="New Password" type="password" placeholder="••••••••" />
                                <Input label="Confirm Password" type="password" placeholder="••••••••" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={() => toast.info('Feature coming soon! 🔒')}
                                >
                                    Update Password
                                </Button>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}
