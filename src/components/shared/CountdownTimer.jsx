/**
 * CountdownTimer.jsx — FSAD-PS34
 * Shows days remaining or days since expiry, color-coded.
 */

import { getDaysRemaining } from '../../utils/certHelpers';

export default function CountdownTimer({ expiryDate }) {
    const days = getDaysRemaining(expiryDate);

    if (days === null) return null;

    if (days < 0) {
        return (
            <span className="text-xs font-medium text-red-400 dark:text-red-500">
                Expired {Math.abs(days)} day{Math.abs(days) !== 1 ? 's' : ''} ago
            </span>
        );
    }

    const colorClass =
        days > 90
            ? 'text-emerald-600 dark:text-emerald-400'
            : days >= 30
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400';

    return (
        <span className={`text-xs font-medium ${colorClass}`}>
            {days} day{days !== 1 ? 's' : ''} remaining
        </span>
    );
}
