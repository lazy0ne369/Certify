/**
 * AllCertifications.jsx — FSAD-PS34
 * Admin view: all org certs with search/filter, edit modal, delete, bulk import, xlsx export.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

import { proxyCertificates } from '../../data/proxyCertificates';
import { proxyUsers } from '../../data/proxyUsers';
import { staggerContainer } from '../../animations/variants';

import PageWrapper from '../../components/layout/PageWrapper';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import BulkImport from '../../components/shared/BulkImport';
import ConfirmModal from '../../components/shared/ConfirmModal';
import Button from '../../components/ui/Button';
import AdminCertCard from './AdminCertCard';
import AdminEditModal from './AdminEditModal';

function findOwner(cert) {
    return proxyUsers.find((u) => u.id === cert.userId || u.id === cert.issuedTo) ?? null;
}

export default function AllCertifications() {
    const [certs, setCerts] = useState([...proxyCertificates]);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);

    // ── Filtered list ──────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return certs.filter((c) => {
            const owner = findOwner(c);
            const matchText = !q || [c.title, c.organization, owner?.name ?? '']
                .some((s) => s.toLowerCase().includes(q));
            const matchStatus = !status || c.status === status;
            const matchCat = !category || c.category === category;
            return matchText && matchStatus && matchCat;
        });
    }, [certs, query, status, category]);

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleSaveEdit = (data) => {
        setCerts((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...data } : c));
        toast.success('Certificate updated!');
        setEditing(null);
    };

    const handleDelete = () => {
        setCerts((prev) => prev.filter((c) => c.id !== toDelete.id));
        toast.success(`"${toDelete.title}" deleted.`);
        setToDelete(null);
    };

    const handleExport = () => {
        const rows = certs.map((c) => ({
            Title: c.title,
            Organization: c.organization,
            Category: c.category,
            Status: c.status,
            'Issue Date': c.issueDate,
            'Expiry Date': c.expiryDate,
            'Credential ID': c.credentialId ?? '',
            Owner: findOwner(c)?.name ?? '',
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Certifications');
        XLSX.writeFile(wb, 'certtrack_certifications.xlsx');
        toast.success('Excel file downloaded!');
    };

    return (
        <PageWrapper>
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">All Certifications</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {certs.length}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <BulkImport />
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4" /> Export Excel
                    </Button>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="mb-3">
                <SearchBar onSearch={setQuery} onFilterStatus={setStatus} onFilterCategory={setCategory} />
            </div>

            {/* ── Count ── */}
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span> of{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">{certs.length}</span> certifications
            </p>

            {/* ── Grid ── */}
            {filtered.length === 0 ? (
                <EmptyState title="No certifications found" message="Try adjusting your search or filters." />
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filtered.map((cert) => (
                        <AdminCertCard
                            key={cert.id}
                            cert={cert}
                            ownerUser={findOwner(cert)}
                            onEdit={setEditing}
                            onDelete={setToDelete}
                        />
                    ))}
                </motion.div>
            )}

            {/* Edit modal */}
            {editing && (
                <AdminEditModal cert={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} />
            )}

            {/* Delete confirm modal */}
            <ConfirmModal
                isOpen={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Certification"
                description={`Are you sure you want to delete "${toDelete?.title}"? This cannot be undone.`}
            />
        </PageWrapper>
    );
}
