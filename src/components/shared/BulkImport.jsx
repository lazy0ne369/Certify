/**
 * BulkImport.jsx — FSAD-PS34
 * CSV upload → papaparse → preview table → confirm import.
 * Expected CSV columns: title, organization, issueDate, expiryDate, category, credentialId
 * < 200 lines
 */

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { fadeInScale } from '../../animations/variants';

const REQUIRED_COLS = ['title', 'organization', 'issueDate', 'expiryDate', 'category', 'credentialId'];

export default function BulkImport({ onImport }) {
    const inputRef = useRef(null);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const reset = () => {
        setRows([]);
        setError('');
        setSuccess(false);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleFile = (file) => {
        if (!file) return;
        setError('');
        setRows([]);
        setSuccess(false);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: ({ data, meta }) => {
                // Validate columns
                const missing = REQUIRED_COLS.filter((c) => !meta.fields?.includes(c));
                if (missing.length) {
                    setError(`Missing columns: ${missing.join(', ')}`);
                    return;
                }
                if (data.length === 0) {
                    setError('CSV file is empty.');
                    return;
                }
                setRows(data);
            },
            error: (err) => setError(`Parse error: ${err.message}`),
        });
    };

    const handleConfirm = () => {
        onImport?.(rows);
        setSuccess(true);
        setTimeout(reset, 2000);
    };

    return (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Bulk Import Certifications</h3>
            </div>

            <div className="p-5 space-y-4">
                {/* Drop zone / file input */}
                <div
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl py-8 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                    <Upload className="w-8 h-8 text-indigo-400" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload CSV</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">title, organization, issueDate, expiryDate, category, credentialId</p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div variants={fadeInScale} initial="hidden" animate="visible" exit="hidden"
                            className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                            <button onClick={reset} className="ml-auto"><X className="w-4 h-4" /></button>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div variants={fadeInScale} initial="hidden" animate="visible" exit="hidden"
                            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {rows.length} certificates imported successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Preview table */}
                {rows.length > 0 && !success && (
                    <motion.div variants={fadeInScale} initial="hidden" animate="visible" className="space-y-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{rows.length} records found — preview:</p>
                        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        {REQUIRED_COLS.map((col) => (
                                            <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {rows.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            {REQUIRED_COLS.map((col) => (
                                                <td key={col} className="px-3 py-2 text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                                                    {row[col] || '—'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {rows.length > 5 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">…and {rows.length - 5} more rows</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                            >
                                Confirm Import ({rows.length})
                            </button>
                            <button
                                onClick={reset}
                                className="px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
