/**
 * PageWrapper.jsx — FSAD-PS34
 * Wraps all page content with Framer Motion page transition + consistent padding.
 */

import { motion } from 'framer-motion';
import { pageVariants } from '../../animations/variants';

export default function PageWrapper({ children, className = '' }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-full p-4 sm:p-6 max-w-screen-xl mx-auto ${className}`}
        >
            {children}
        </motion.div>
    );
}
