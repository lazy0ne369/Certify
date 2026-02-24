import { format, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';

/**
 * Format ISO date string to readable format
 * @param {string} dateStr - ISO date string
 * @param {string} fmt - date-fns format string
 */
export const formatDate = (dateStr, fmt = 'dd MMM yyyy') => {
    if (!dateStr) return '—';
    try {
        return format(parseISO(dateStr), fmt);
    } catch {
        return dateStr;
    }
};

/**
 * Get days until expiry (negative = already expired)
 */
export const daysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    return differenceInDays(parseISO(expiryDate), new Date());
};

/**
 * Check if a certificate is expiring soon (within 30 days)
 */
export const isExpiringSoon = (expiryDate, thresholdDays = 30) => {
    if (!expiryDate) return false;
    const days = daysUntilExpiry(expiryDate);
    return days !== null && days >= 0 && days <= thresholdDays;
};

/**
 * Check if a date is in the past
 */
export const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return isBefore(parseISO(dateStr), new Date());
};

/**
 * Compute status badge color classes
 */
export const statusColorMap = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};
