/**
 * PDFViewer.jsx — FSAD-PS34
 * PDF viewer modal using react-pdf with page navigation.
 * < 200 lines — split into PDFViewerModal for the overlay logic.
 */

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, FileWarning, Loader2 } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../animations/variants';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

function PDFControls({ page, numPages, onPrev, onNext }) {
    return (
        <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <button
                onClick={onPrev}
                disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[80px] text-center">
                Page {page} of {numPages ?? '…'}
            </span>
            <button
                onClick={onNext}
                disabled={!numPages || page >= numPages}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
        </div>
    );
}

export default function PDFViewer({ fileUrl, fileName, isOpen, onClose }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const onDocLoad = useCallback(({ numPages: n }) => {
        setNumPages(n);
        setLoading(false);
        setError(false);
    }, []);

    const onDocError = useCallback(() => {
        setLoading(false);
        setError(true);
    }, []);

    const reset = () => {
        setNumPages(null);
        setPageNum(1);
        setLoading(true);
        setError(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={reset}
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed z-50 inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[640px] sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate max-w-[80%]">
                                {fileName ?? 'Certificate PDF'}
                            </p>
                            <button onClick={reset} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto flex items-center justify-center bg-gray-100 dark:bg-gray-950 min-h-[300px]">
                            {error ? (
                                <div className="flex flex-col items-center gap-3 text-center px-6 py-12">
                                    <FileWarning className="w-12 h-12 text-red-400" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load PDF.<br />Check the file URL and try again.</p>
                                </div>
                            ) : (
                                <>
                                    {loading && (
                                        <div className="absolute flex items-center gap-2 text-sm text-gray-400">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading PDF…
                                        </div>
                                    )}
                                    <Document
                                        file={fileUrl}
                                        onLoadSuccess={onDocLoad}
                                        onLoadError={onDocError}
                                        loading={null}
                                    >
                                        <Page
                                            pageNumber={pageNum}
                                            width={560}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                        />
                                    </Document>
                                </>
                            )}
                        </div>

                        {/* Controls */}
                        {!error && (
                            <PDFControls
                                page={pageNum}
                                numPages={numPages}
                                onPrev={() => setPageNum((p) => Math.max(1, p - 1))}
                                onNext={() => setPageNum((p) => Math.min(numPages, p + 1))}
                            />
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
