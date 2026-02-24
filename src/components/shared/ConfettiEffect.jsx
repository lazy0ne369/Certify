/**
 * ConfettiEffect.jsx — FSAD-PS34
 * Simple burst of colored particles using Framer Motion on success.
 */

import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 400 - 200,
    rotate: Math.random() * 720 - 360,
    size: Math.random() * 10 + 6,
}));

export default function ConfettiEffect({ show }) {
    return (
        <AnimatePresence>
            {show && (
                <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
                    {PARTICLES.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                            animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate, scale: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                position: 'absolute',
                                width: p.size,
                                height: p.size,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                backgroundColor: p.color,
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}
