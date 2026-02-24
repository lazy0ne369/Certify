/**
 * SearchBar.jsx — FSAD-PS34
 * Search + status + category filter bar. Stacks vertically on mobile.
 */

import { useRef } from 'react';
import { Search } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expiring_soon', label: 'Expiring Soon' },
    { value: 'expired', label: 'Expired' },
];

const CATEGORY_OPTIONS = [
    { value: '', label: 'All Categories' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Data', label: 'Data' },
    { value: 'Frontend', label: 'Frontend' },
];

const selectClass =
    'h-9 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

export default function SearchBar({ onSearch, onFilterStatus, onFilterCategory }) {
    const searchRef = useRef(null);

    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
            {/* Search input */}
            <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search certifications…"
                    onChange={(e) => onSearch?.(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>

            {/* Status filter */}
            <select
                onChange={(e) => onFilterStatus?.(e.target.value)}
                className={selectClass}
                defaultValue=""
            >
                {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Category filter */}
            <select
                onChange={(e) => onFilterCategory?.(e.target.value)}
                className={selectClass}
                defaultValue=""
            >
                {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}
