/**
 * Login.jsx — FSAD-PS34
 * Authentication page with RHF + Zod, Sonner toasts, role-based redirect.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Lock, ShieldCheck, Info } from 'lucide-react';

import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// ── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ── Animation ─────────────────────────────────────────────────────────────────
const cardAnim = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
};

// ── Test Credential Chip ──────────────────────────────────────────────────────
function CredChip({ label, email, password, onFill }) {
    return (
        <button
            type="button"
            onClick={() => onFill(email, password)}
            className="flex flex-col items-start px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors text-left w-full"
        >
            <span className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">{label}</span>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-mono">{email}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">pw: {password}</span>
        </button>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const fillCredentials = (email, password) => {
        setValue('email', email, { shouldValidate: true });
        setValue('password', password, { shouldValidate: true });
    };

    const onSubmit = async ({ email, password }) => {
        setLoading(true);
        try {
            const result = loginUser(email, password);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            login(result.user);
            toast.success(`Welcome back, ${result.user.name}!`);
            navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10
                    bg-gradient-to-br from-indigo-50 via-white to-indigo-100
                    dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">

            <motion.div
                variants={cardAnim}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800
                        bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-8 py-10">

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                            <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Cert<span className="text-indigo-600">Track</span>
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage your professional certifications
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            className="mt-2"
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Test credentials */}
                    <div className="mt-6">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Info className="w-3.5 h-3.5 text-indigo-400" />
                            <p className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
                                Test Credentials — click to fill
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <CredChip
                                label="User"
                                email="ashish@gmail.com"
                                password="user123"
                                onFill={fillCredentials}
                            />
                            <CredChip
                                label="Admin"
                                email="admin@gmail.com"
                                password="admin123"
                                onFill={fillCredentials}
                            />
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
