/**
 * MyCertifications.jsx — FSAD-PS34
 * User cert list with search/filter, staggered grid, edit/delete actions.
 * Split: ConfirmModal → src/components/shared/ConfirmModal.jsx
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { getCertsByUser } from '../../utils/certHelpers';
import { staggerContainer, cardVariants } from '../../animations/variants';
import { usePageLoader } from '../../hooks/usePageLoader';

import PageWrapper from '../../components/layout/PageWrapper';
import SearchBar from '../../components/shared/SearchBar';
import CertCard from '../../components/shared/CertCard';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmModal from '../../components/shared/ConfirmModal';
import Button from '../../components/ui/Button';
import { CertGridSkeleton } from '../../components/shared/SkeletonCard';

export default function MyCertifications() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const { loading } = usePageLoader(800);

    // Local copy of certs (allows optimistic delete)
    const [certs, setCerts] = useState(() => getCertsByUser(user?.id));

    // Filter state
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');

    // Delete modal state
    const [toDelete, setToDelete] = useState(null); // cert object

    // ── Filtered list ──────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return certs.filter((c) => {
            const matchText = !q || c.title.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q);
            const matchStatus = !status || c.status === status;
            const matchCat = !category || c.category === category;
            return matchText && matchStatus && matchCat;
        });
    }, [certs, query, status, category]);

    // ── Delete handler ─────────────────────────────────────────────────────────
    const handleDelete = () => {
        setCerts((prev) => prev.filter((c) => c.id !== toDelete.id));
        toast.success(`"${toDelete.title}" removed successfully`);
        setToDelete(null);
    };

    if (loading) {
        return (
            <PageWrapper>
                <div className="mb-5 h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="mb-4 h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <CertGridSkeleton count={6} />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Certifications</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {certs.length}
                    </span>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/user/certifications/add')}
                >
                    <PlusCircle className="w-4 h-4" />
                    Add New
                </Button>
            </div>

            {/* ── Search & Filters ── */}
            <div className="mb-4">
                <SearchBar
                    onSearch={setQuery}
                    onFilterStatus={setStatus}
                    onFilterCategory={setCategory}
                />
            </div>

            {/* ── Results count ── */}
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">{certs.length}</span> certifications
            </p>

            {/* ── Grid / Empty state ── */}
            {filtered.length === 0 ? (
                <EmptyState
                    title="No certifications found"
                    message="Try adjusting your search or filters, or add a new certification."
                    actionLabel="Add Certification"
                    onAction={() => navigate('/user/certifications/add')}
                />
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filtered.map((cert) => (
                        <motion.div key={cert.id} variants={cardVariants} className="flex flex-col">
                            {/* CertCard */}
                            <CertCard cert={cert} />

                            {/* Action row */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => navigate(`/user/certifications/edit/${cert.id}`)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium
                             text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800
                             rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => setToDelete(cert)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium
                             text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900
                             rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ── Delete confirm modal ── */}
            <ConfirmModal
                isOpen={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Certification"
                description={`Are you sure you want to delete "${toDelete?.title}"? This cannot be undone.`}
                confirmLabel="Delete"
            />
        </PageWrapper>
    );
}
