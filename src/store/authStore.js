/**
 * authStore.js — FSAD-PS34
 * Zustand store for authentication state.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            // ── State ──────────────────────────────────────────────────────────────
            user: null,
            isAuthenticated: false,

            // ── Actions ────────────────────────────────────────────────────────────

            /** Called after authService validates credentials */
            login: (userData) =>
                set({ user: userData, isAuthenticated: true }),

            logout: () =>
                set({ user: null, isAuthenticated: false }),

            /** Merge partial fields into current user (for Profile edits) */
            updateUser: (updates) =>
                set((state) => ({ user: { ...state.user, ...updates } })),
        }),
        {
            name: 'fsad-auth',
            // Only persist what's needed; password never lands in store
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
