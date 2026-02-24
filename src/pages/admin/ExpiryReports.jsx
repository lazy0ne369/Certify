/**
 * ExpiryReports.jsx — FSAD-PS34
 * Expiry reports page with filter tabs, table, export (PDF/Excel), RenewalCalendar.
 * < 200 lines
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { FileBarChart, Download, FileDown } from 'lucide-react';

import { proxyCertificates } from '../../data/proxyCertificates';
import { proxyUsers } from '../../data/proxyUsers';
import { getDaysRemaining } from '../../utils/certHelpers';
import { formatDate } from '../../utils/dateUtils';
import { staggerContainer, listItemVariants } from '../../animations/variants';

import PageWrapper from '../../components/layout/PageWrapper';
import ExpiryTable from './ExpiryTable';
import RenewalCalendar from '../../components/calendar/RenewalCalendar';

const TABS = [
    { label: 'All', days: null },
    { label: 'Next 30 Days', days: 30 },
    { label: 'Next 60 Days', days: 60 },
    { label: 'Next 90 Days', days: 90 },
];

function findOwner(cert) {
    return proxyUsers.find((u) => u.id === cert.issuedTo || u.id === cert.userId);
}

export default function ExpiryReports() {
    const [activeTab, setActiveTab] = useState(0);

    const filtered = useMemo(() => {
        const window = TABS[activeTab].days;
        if (!window) return [...proxyCertificates].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        return proxyCertificates
            .filter((c) => {
                const d = getDaysRemaining(c.expiryDate);
                return d >= 0 && d <= window;
            })
            .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }, [activeTab]);

    /* ── Export Excel ────────────────────────────────────────────────────────── */
    const handleExcelExport = () => {
        const rows = filtered.map((c) => ({
            User: findOwner(c)?.name ?? '—',
            Certificate: c.title,
            Organization: c.organization,
            'Expiry Date': formatDate(c.expiryDate),
            'Days Left': getDaysRemaining(c.expiryDate),
            Status: c.status,
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Expiry Report');
        XLSX.writeFile(wb, 'certtrack_expiry_report.xlsx');
        toast.success('Excel report downloaded!');
    };

    /* ── Export PDF (print window) ───────────────────────────────────────────── */
    const handlePDFExport = () => {
        const rows = filtered.map((c) => {
            const owner = findOwner(c);
            return `<tr>
        <td>${owner?.name ?? '—'}</td>
        <td>${c.title}</td>
        <td>${c.organization}</td>
        <td>${formatDate(c.expiryDate)}</td>
        <td>${getDaysRemaining(c.expiryDate)} days</td>
        <td>${c.status}</td>
      </tr>`;
        }).join('');

        const html = `<!DOCTYPE html><html><head><title>Expiry Report</title>
      <style>
        body { font-family: sans-serif; padding: 24px; font-size: 12px; }
        h2 { color: #4338ca; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        @media print { body { -webkit-print-color-adjust: exact; } }
      </style></head><body>
      <h2>CertTrack — Expiry Report</h2>
      <p>Filter: ${TABS[activeTab].label} | Generated: ${new Date().toLocaleDateString()}</p>
      <table>
        <thead><tr><th>User</th><th>Certificate</th><th>Organization</th><th>Expiry</th><th>Days Left</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></body></html>`;

        const w = window.open('', '_blank');
        w.document.write(html);
        w.document.close();
        w.print();
        toast.success('PDF export opened!');
    };

    return (
        <PageWrapper>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">

                {/* Header */}
                <motion.div variants={listItemVariants}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                                <FileBarChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </span>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expiry Reports</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {filtered.length} cert{filtered.length !== 1 ? 's' : ''} in view
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleExcelExport}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                <Download className="w-3.5 h-3.5" /> Excel
                            </button>
                            <button onClick={handlePDFExport}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                                <FileDown className="w-3.5 h-3.5" /> PDF
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Filter tabs */}
                <motion.div variants={listItemVariants}
                    className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
                    {TABS.map((tab, idx) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(idx)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${idx === activeTab
                                    ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Table */}
                <motion.div variants={listItemVariants}>
                    <ExpiryTable certs={filtered} />
                </motion.div>

                {/* Renewal Calendar */}
                <motion.div variants={listItemVariants}>
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Expiry Calendar</h2>
                    <RenewalCalendar certificates={proxyCertificates} />
                </motion.div>

            </motion.div>
        </PageWrapper>
    );
}
