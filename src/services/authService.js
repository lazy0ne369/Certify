/**
 * authService.js — FSAD-PS34
 * Authentication logic against proxyUsers. No backend.
 */

import { proxyUsers } from '../data/proxyUsers';

/**
 * Validate credentials against proxy user list.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ success: true, user: object } | { success: false, message: string }}
 */
export const loginUser = (email, password) => {
    if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
    }

    const found = proxyUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!found) {
        return { success: false, message: 'No account found with that email.' };
    }

    if (found.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Strip the password before returning
    const { password: _pw, ...safeUser } = found;

    return { success: true, user: safeUser };
};
