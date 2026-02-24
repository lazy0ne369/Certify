/**
 * certHelpers.js — FSAD-PS34
 * All certificate utilities using date-fns.
 */

import { differenceInDays, parseISO } from 'date-fns';
import { proxyCertificates } from '../data/proxyCertificates';

// ─── Core Filters ─────────────────────────────────────────────────────────────

/** Filter certificates for a given userId */
export const getCertsByUser = (userId) =>
    proxyCertificates.filter((c) => c.userId === userId);

/** Find a single certificate by id */
export const getCertById = (id) =>
    proxyCertificates.find((c) => c.id === id) ?? null;

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/**
 * Days remaining until expiry.
 * Returns a negative number if already expired.
 */
export const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    return differenceInDays(parseISO(expiryDate), new Date());
};

/**
 * Derive status from expiry date.
 *  expired       → days < 0
 *  expiring_soon → 0 ≤ days ≤ 90
 *  active        → days > 90
 */
export const getStatus = (expiryDate) => {
    const days = getDaysRemaining(expiryDate);
    if (days === null) return 'active';
    if (days < 0) return 'expired';
    if (days <= 90) return 'expiring_soon';
    return 'active';
};

// ─── UI Helpers ───────────────────────────────────────────────────────────────

/**
 * Tailwind badge color classes for each status.
 * Returns a string of bg + text classes.
 */
export const getStatusColor = (status) => {
    switch (status) {
        case 'active':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
        case 'expiring_soon':
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
        case 'expired':
            return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
};

// ─── Stats ────────────────────────────────────────────────────────────────────

/**
 * Summary counts for a single user's certificates.
 * @returns {{ total, active, expiringSoon, expired }}
 */
export const getCertStats = (userId) => {
    const certs = getCertsByUser(userId);
    return certs.reduce(
        (acc, cert) => {
            acc.total += 1;
            const s = cert.status;
            if (s === 'active') acc.active += 1;
            if (s === 'expiring_soon') acc.expiringSoon += 1;
            if (s === 'expired') acc.expired += 1;
            return acc;
        },
        { total: 0, active: 0, expiringSoon: 0, expired: 0 }
    );
};

/**
 * Group all certificates by user.
 * @param {Array} users — array from proxyUsers
 * @returns {Array<{ user, certs, stats }>}
 */
export const getAllCertsGroupedByUser = (users) =>
    users.map((user) => ({
        user,
        certs: getCertsByUser(user.id),
        stats: getCertStats(user.id),
    }));
