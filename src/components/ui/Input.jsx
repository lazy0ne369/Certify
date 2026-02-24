/**
 * Input.jsx — FSAD-PS34
 * Reusable form input with label, error message, dark mode.
 */

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
    { label, error, type = 'text', icon: Icon, className = '', ...props },
    ref
) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                )}
                <input
                    ref={ref}
                    type={inputType}
                    className={[
                        'w-full h-10 rounded-xl border text-sm transition-colors bg-white dark:bg-gray-900',
                        'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                        Icon ? 'pl-9' : 'pl-3',
                        isPassword ? 'pr-10' : 'pr-3',
                        error
                            ? 'border-red-400 dark:border-red-600'
                            : 'border-gray-200 dark:border-gray-700',
                        className,
                    ].join(' ')}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
        </div>
    );
});

export default Input;
