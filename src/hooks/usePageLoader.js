/**
 * usePageLoader.js — FSAD-PS34
 * Hook that simulates an 800ms loading delay then resolves.
 * Returns: { loading } boolean
 */

import { useState, useEffect } from 'react';

export function usePageLoader(ms = 800) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), ms);
        return () => clearTimeout(timer);
    }, [ms]);

    return { loading };
}
