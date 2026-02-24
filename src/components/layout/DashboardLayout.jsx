/**
 * DashboardLayout.jsx — FSAD-PS34
 * Wraps authenticated pages: Navbar + Sidebar + animated main content.
 * Apply to all protected routes via AppRouter.
 */

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            {/* Top Navbar */}
            <Navbar />

            {/* Body: Sidebar + Page */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto min-w-0">
                    <AnimatePresence mode="wait" initial={false}>
                        {/* Key on pathname so AnimatePresence triggers on route change */}
                        <div key={location.pathname}>
                            {children}
                        </div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
