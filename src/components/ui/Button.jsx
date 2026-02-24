/**
 * Button.jsx — FSAD-PS34
 * Reusable button with variants, loading state, dark mode.
 */

import { Loader2 } from 'lucide-react';

const VARIANTS = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300',
    outline: 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200',
};

const SIZES = {
    sm: 'h-8  px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-sm',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            disabled={isDisabled}
            className={[
                'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                VARIANTS[variant] ?? VARIANTS.primary,
                SIZES[size] ?? SIZES.md,
                fullWidth ? 'w-full' : '',
                className,
            ].join(' ')}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}
