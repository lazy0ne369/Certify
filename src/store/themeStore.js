/**
 * themeStore.js — FSAD-PS34
 * Dedicated theme store for dark/light mode. Mirrors uiStore.isDarkMode
 * but keeps theme concerns isolated. Persists to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export const useThemeStore = create(
    persist(
        (set) => ({
            isDark: false,

            toggleTheme: () =>
                set((state) => {
                    const next = !state.isDark;
                    applyTheme(next);
                    return { isDark: next };
                }),

            setTheme: (isDark) => {
                applyTheme(isDark);
                set({ isDark });
            },
        }),
        {
            name: 'fsad-theme',
            onRehydrateStorage: () => (state) => {
                if (state) applyTheme(state.isDark);
            },
        }
    )
);
