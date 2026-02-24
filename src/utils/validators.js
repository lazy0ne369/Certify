/**
 * Certificate validation schema (Zod)
 */
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const certificateSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    issuedBy: z.string().min(2, 'Issuer is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    category: z.string().min(1, 'Category is required'),
    credentialId: z.string().min(1, 'Credential ID is required'),
    description: z.string().optional(),
});
