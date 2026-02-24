import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI Store — manages theme (dark/light) and global UI state
 */
export const useUIStore = create(
    persist(
        (set) => ({
            isDarkMode: false,
            sidebarOpen: true,

            toggleDarkMode: () =>
                set((state) => {
                    const next = !state.isDarkMode;
                    if (next) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { isDarkMode: next };
                }),

            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        }),
        {
            name: 'fsad-ui',
            partialize: (state) => ({ isDarkMode: state.isDarkMode }),
            onRehydrateStorage: () => (state) => {
                if (state?.isDarkMode) {
                    document.documentElement.classList.add('dark');
                }
            },
        }
    )
);
