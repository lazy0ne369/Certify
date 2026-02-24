/**
 * EditCertification.jsx — FSAD-PS34
 * Pre-fills CertForm from certStore by :id URL param, then saves update.
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

import { useCertStore } from '../../store/certStore';
import PageWrapper from '../../components/layout/PageWrapper';
import CertForm from '../../components/ui/CertForm';
import { listItemVariants } from '../../animations/variants';

export default function EditCertification() {
    const { id } = useParams();
    const navigate = useNavigate();
    const getCertById = useCertStore((s) => s.getCertById);
    const updateCertificate = useCertStore((s) => s.updateCertificate);
    const [loading, setLoading] = useState(false);

    const cert = getCertById(id);

    // Cert not found
    if (!cert) {
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Certification not found.</p>
                    <button onClick={() => navigate('/user/certifications')}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        ← Back to My Certifications
                    </button>
                </div>
            </PageWrapper>
        );
    }

    // Pre-fill defaults from existing cert
    const defaultValues = {
        title: cert.title ?? '',
        organization: cert.organization ?? '',
        issueDate: cert.issueDate ?? '',
        expiryDate: cert.expiryDate ?? '',
        category: cert.category ?? '',
        credentialId: cert.credentialId ?? '',
        description: cert.description ?? '',
    };

    const handleSubmit = async (data) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        updateCertificate(id, data);
        setLoading(false);
        toast.success('Certification updated successfully!');
        navigate('/user/certifications');
    };

    return (
        <PageWrapper>
            <motion.div variants={listItemVariants} initial="hidden" animate="visible" className="mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                        <Pencil className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Certification</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{cert.title}</p>
                    </div>
                </div>
            </motion.div>

            <CertForm
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/user/certifications')}
                loading={loading}
                submitLabel="Save Changes"
            />
        </PageWrapper>
    );
}
