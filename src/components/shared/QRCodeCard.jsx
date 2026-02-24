/**
 * QRCodeCard.jsx — FSAD-PS34
 * QR code display + PNG download for a certificate.
 * < 200 lines
 */

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { cardVariants } from '../../animations/variants';

export default function QRCodeCard({ certId, certTitle }) {
    const canvasRef = useRef(null);
    const qrValue = `https://certtrack.app/verify/${certId}`;

    const handleDownload = () => {
        // Find the canvas inside the wrapper ref
        const canvas = canvasRef.current?.querySelector('canvas');
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${certId}-qr.png`;
        a.click();
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 flex flex-col items-center gap-4"
        >
            {/* Header */}
            <div className="flex items-center gap-2 self-start">
                <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Verify QR Code</h3>
            </div>

            {/* QR Code canvas */}
            <div
                ref={canvasRef}
                className="p-3 bg-white rounded-xl border border-gray-200 dark:border-gray-700"
            >
                <QRCodeCanvas
                    value={qrValue}
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#3730a3"
                    level="H"
                    includeMargin={false}
                />
            </div>

            {/* Cert title */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 max-w-[180px] line-clamp-2">
                {certTitle}
            </p>

            {/* Download button */}
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
                <Download className="w-3.5 h-3.5" />
                Download QR
            </button>

            {/* Verify URL */}
            <p className="text-[10px] text-gray-400 dark:text-gray-600 break-all text-center">{qrValue}</p>
        </motion.div>
    );
}
