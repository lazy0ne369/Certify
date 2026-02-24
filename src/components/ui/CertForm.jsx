/**
 * CertForm.jsx — FSAD-PS34
 * Shared form for Add/Edit certification. Two-column layout with live preview.
 * < 200 lines.
 */

import { useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Award, Building2, Calendar } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import Button from '../ui/Button';
import { formatDate } from '../../utils/dateUtils';

const CATEGORIES = ['Cloud', 'DevOps', 'Data', 'Frontend'];

const CAT_COLORS = {
    Cloud: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    DevOps: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    Data: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    Frontend: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
};

export const certSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    organization: z.string().min(1, 'Organization is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    category: z.string().min(1, 'Category is required'),
    credentialId: z.string().optional(),
    description: z.string().max(300, 'Max 300 characters').optional(),
}).refine((d) => !d.issueDate || !d.expiryDate || d.expiryDate > d.issueDate, {
    message: 'Expiry date must be after issue date',
    path: ['expiryDate'],
});

const Lbl = ({ children }) => <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{children}</label>;
const Err = ({ msg }) => msg ? <p className="text-xs text-red-500 mt-0.5">{msg}</p> : null;
const cls = 'w-full h-9 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';

export default function CertForm({ defaultValues = {}, onSubmit, onCancel, loading, submitLabel }) {
    const fileRef = useRef(null);
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(certSchema),
        defaultValues,
    });

    const watched = useWatch({ control });
    const fileName = watch('_fileName');
    const previewStatus = watched.expiryDate
        ? new Date(watched.expiryDate) < new Date() ? 'expired'
            : new Date(watched.expiryDate) < new Date(Date.now() + 90 * 864e5) ? 'expiring_soon'
                : 'active'
        : 'active';

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (f) {
            setValue('certificateFile', f);
            setValue('_fileName', f.name);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── LEFT: Form fields ── */}
            <div className="lg:col-span-3 space-y-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <Lbl>Certificate Title *</Lbl>
                        <input {...register('title')} placeholder="AWS Solutions Architect" className={cls} />
                        <Err msg={errors.title?.message} />
                    </div>
                    <div>
                        <Lbl>Organization *</Lbl>
                        <input {...register('organization')} placeholder="Amazon Web Services" className={cls} />
                        <Err msg={errors.organization?.message} />
                    </div>
                    <div>
                        <Lbl>Category *</Lbl>
                        <select {...register('category')} className={cls} defaultValue="">
                            <option value="" disabled>Select category</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Err msg={errors.category?.message} />
                    </div>
                    <div>
                        <Lbl>Issue Date *</Lbl>
                        <input {...register('issueDate')} type="date" className={cls} />
                        <Err msg={errors.issueDate?.message} />
                    </div>
                    <div>
                        <Lbl>Expiry Date *</Lbl>
                        <input {...register('expiryDate')} type="date" className={cls} />
                        <Err msg={errors.expiryDate?.message} />
                    </div>
                    <div>
                        <Lbl>Credential ID</Lbl>
                        <input {...register('credentialId')} placeholder="ABC-123-XYZ" className={cls} />
                    </div>
                    <div>
                        <Lbl>Certificate File (PDF/Image)</Lbl>
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="flex items-center gap-2 h-9 px-3 text-sm rounded-xl border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Upload className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-400 dark:text-gray-500 text-xs truncate">
                                {fileName ?? 'Click to upload'}
                            </span>
                            {fileName && <button type="button" onClick={(e) => { e.stopPropagation(); setValue('_fileName', ''); }} className="ml-auto"><X className="w-3.5 h-3.5 text-gray-400" /></button>}
                        </div>
                        <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleFile} />
                    </div>
                    <div className="sm:col-span-2">
                        <Lbl>Description (max 300 chars)</Lbl>
                        <textarea {...register('description')} rows={3} placeholder="Brief description of this certification…"
                            className={`${cls} h-auto py-2 resize-none`} />
                        <Err msg={errors.description?.message} />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="primary" size="md" loading={loading} fullWidth>{submitLabel}</Button>
                    <Button type="button" variant="outline" size="md" onClick={onCancel}>Cancel</Button>
                </div>
            </div>

            {/* ── RIGHT: Live Preview ── */}
            <div className="lg:col-span-2">
                <div className="sticky top-20 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md overflow-hidden">
                    <div className="h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                        <Award className="w-12 h-12 text-indigo-300 dark:text-indigo-600" />
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                                    {watched.title || <span className="text-gray-400 italic">Certificate Title</span>}
                                </h3>
                                <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    <Building2 className="w-3 h-3" />
                                    {watched.organization || <span className="italic">Organization</span>}
                                </p>
                            </div>
                            {watched.category && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${CAT_COLORS[watched.category] ?? ''}`}>
                                    {watched.category}
                                </span>
                            )}
                        </div>
                        {(watched.issueDate || watched.expiryDate) && (
                            <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                                <Calendar className="w-3 h-3" />
                                {watched.issueDate ? formatDate(watched.issueDate) : '—'} → {watched.expiryDate ? formatDate(watched.expiryDate) : '—'}
                            </p>
                        )}
                        <StatusBadge status={previewStatus} />
                        <p className="text-[10px] font-medium text-indigo-400 dark:text-indigo-500 text-center pt-1">Live Preview</p>
                    </div>
                </div>
            </div>

        </form>
    );
}
