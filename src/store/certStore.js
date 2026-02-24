import { create } from 'zustand';
import { proxyCertificates } from '../data/proxyCertificates';

/**
 * Certificate Store — in-memory certificate state
 */
export const useCertStore = create((set, get) => ({
    certificates: [...proxyCertificates],

    getCertById: (id) => get().certificates.find((c) => c.id === id) || null,

    getCertsByUser: (userId) => get().certificates.filter((c) => c.issuedTo === userId),

    addCertificate: (cert) =>
        set((state) => ({
            certificates: [...state.certificates, { ...cert, id: `c${Date.now()}` }],
        })),

    updateCertificate: (id, updates) =>
        set((state) => ({
            certificates: state.certificates.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

    deleteCertificate: (id) =>
        set((state) => ({
            certificates: state.certificates.filter((c) => c.id !== id),
        })),
}));
