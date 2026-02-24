/**
 * CertDetailLeft.jsx — FSAD-PS34
 * Left column for CertificateDetail: badge, info, details grid, action buttons.
 * < 200 lines
 */

import { useState } from 'react';
import { toast } from 'sonner';
import {
    Building2, Calendar, Hash, Briefcase,
    FileText, Download, Share2, Award,
} from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge';
import CountdownTimer from '../../components/shared/CountdownTimer';
import PDFViewer from '../../components/shared/PDFViewer';
import { formatDate } from '../../utils/dateUtils';

const CAT_COLORS = {
    Cloud: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    DevOps: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    Data: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    Frontend: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
};

const BORDER_COLOR = {
    active: 'border-t-emerald-500',
    expiring_soon: 'border-t-amber-500',
    expired: 'border-t-red-500',
};

function DetailRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {value}
            </p>
        </div>
    );
}

export default function CertDetailLeft({ cert }) {
    const [pdfOpen, setPdfOpen] = useState(false);
    const borderTop = BORDER_COLOR[cert.status] ?? 'border-t-gray-300';
    const catColor = CAT_COLORS[cert.category] ?? 'bg-gray-100 text-gray-600';
    const verifyUrl = `https://certtrack.app/verify/${cert.id}`;

    const handleShare = () => {
        navigator.clipboard.writeText(verifyUrl).then(() => {
            toast.success('Link copied to clipboard!');
        });
    };

    const handleDownload = () => {
        if (cert.certificateUrl) {
            const a = document.createElement('a');
            a.href = cert.certificateUrl;
            a.download = `${cert.title.replace(/\s+/g, '_')}_certificate`;
            a.target = '_blank';
            a.click();
        } else {
            toast.error('No certificate file available to download.');
        }
    };

    return (
        <div className={`rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 border-t-4 ${borderTop} overflow-hidden`}>
            {/* Badge hero */}
            <div className="h-44 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                {cert.badgeUrl ? (
                    <img src={cert.badgeUrl} alt={cert.title}
                        className="h-32 w-32 object-contain drop-shadow-lg rounded-xl"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                    <Award className="w-24 h-24 text-indigo-300 dark:text-indigo-600" />
                )}
            </div>

            <div className="p-6 space-y-5">
                {/* Title + org */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{cert.title}</h1>
                    <p className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Building2 className="w-4 h-4 shrink-0" />
                        {cert.organization}
                    </p>
                </div>

                {/* Status + countdown + category */}
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={cert.status} />
                    <CountdownTimer expiryDate={cert.expiryDate} />
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${catColor}`}>
                        {cert.category}
                    </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 dark:border-gray-800">
                    <DetailRow icon={Hash} label="Credential ID" value={cert.credentialId} />
                    <DetailRow icon={Briefcase} label="Department" value={cert.department} />
                    <DetailRow icon={Calendar} label="Issue Date" value={formatDate(cert.issueDate)} />
                    <DetailRow icon={Calendar} label="Expiry Date" value={formatDate(cert.expiryDate)} />
                </div>

                {/* Description */}
                {cert.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cert.description}</p>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setPdfOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
                        <FileText className="w-4 h-4" /> View Certificate
                    </button>
                    <button onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                        <Download className="w-4 h-4" /> Download
                    </button>
                    <button onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </div>
            </div>

            {/* PDF Viewer modal */}
            <PDFViewer
                isOpen={pdfOpen}
                onClose={() => setPdfOpen(false)}
                fileUrl={cert.certificateUrl}
                fileName={`${cert.title} — Certificate`}
            />
        </div>
    );
}
