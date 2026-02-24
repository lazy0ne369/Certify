/**
 * ProtectedRoute.jsx — FSAD-PS34
 * Role-based route guard using Zustand authStore.
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * @param {React.ReactNode} children   — page to render if access granted
 * @param {'user'|'admin'} allowedRole — optional role restriction
 */
export default function ProtectedRoute({ children, allowedRole }) {
    const { isAuthenticated, user } = useAuthStore();

    // Not logged in → go to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role mismatch → go to /unauthorized
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
