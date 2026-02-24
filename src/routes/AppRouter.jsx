/**
 * AppRouter.jsx — FSAD-PS34
 * Full React Router v6 routing with role-based protection + DashboardLayout.
 */

import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
const Home = lazy(() => import('../pages/Home'));
import { Toaster } from 'sonner';
import { useAuthStore } from '../store/authStore';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// ── Auth Pages ────────────────────────────────────────────────────────────────
const Login = lazy(() => import('../pages/auth/Login'));

// ── User Pages ────────────────────────────────────────────────────────────────
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const MyCertifications = lazy(() => import('../pages/user/MyCertifications'));
const AddCertification = lazy(() => import('../pages/user/AddCertification'));
const EditCertification = lazy(() => import('../pages/user/EditCertification'));
const CertificateDetail = lazy(() => import('../pages/user/CertificateDetail'));
const Profile = lazy(() => import('../pages/user/Profile'));

// ── Admin Pages ───────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AllCertifications = lazy(() => import('../pages/admin/AllCertifications'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const UserCertDetail = lazy(() => import('../pages/admin/UserCertDetail'));
const ExpiryReports = lazy(() => import('../pages/admin/ExpiryReports'));

// ── Special Pages ─────────────────────────────────────────────────────────────
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

// ── Spinner fallback ──────────────────────────────────────────────────────────
function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

// ── Smart root redirect ───────────────────────────────────────────────────────
function RootRedirect() {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
}

// ── Helper: protected page wrapped in DashboardLayout ────────────────────────
function Protected({ role, children }) {
    return (
        <ProtectedRoute allowedRole={role}>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function AppRouter() {
    return (
        <HashRouter>
            <Toaster
                position="top-right"
                richColors
                toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }}
            />
            <Suspense fallback={<PageLoader />}>
                <Routes>

                    {/* Home page */}
                    <Route path="/" element={<Home />} />
                    {/* Smart redirect for legacy or direct links */}
                    <Route path="/redirect" element={<RootRedirect />} />

                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* ── User routes ─────────────────────────────────── */}
                    <Route path="/user/dashboard" element={<Protected role="user"><UserDashboard /></Protected>} />
                    <Route path="/user/certifications" element={<Protected role="user"><MyCertifications /></Protected>} />
                    <Route path="/user/certifications/add" element={<Protected role="user"><AddCertification /></Protected>} />
                    <Route path="/user/certifications/edit/:id" element={<Protected role="user"><EditCertification /></Protected>} />
                    <Route path="/user/certifications/:id" element={<Protected role="user"><CertificateDetail /></Protected>} />
                    <Route path="/user/profile" element={<Protected role="user"><Profile /></Protected>} />

                    {/* ── Admin routes ────────────────────────────────── */}
                    <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard /></Protected>} />
                    <Route path="/admin/certifications" element={<Protected role="admin"><AllCertifications /></Protected>} />
                    <Route path="/admin/users" element={<Protected role="admin"><UserManagement /></Protected>} />
                    <Route path="/admin/users/:userId/certifications" element={<Protected role="admin"><UserCertDetail /></Protected>} />
                    <Route path="/admin/reports" element={<Protected role="admin"><ExpiryReports /></Protected>} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}
