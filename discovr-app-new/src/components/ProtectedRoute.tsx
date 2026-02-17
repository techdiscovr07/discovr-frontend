import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    fallbackPath?: string;
}

/**
 * ProtectedRoute component that handles authentication and RBAC.
 * It checks if the user is authenticated and if they have one of the allowed roles.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    fallbackPath
}) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication state
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        );
    }

    // If no user is logged in, redirect to the appropriate login page
    if (!user) {
        // Default fallbacks based on the current path
        let targetLogin = '/creator/login';
        if (location.pathname.startsWith('/admin')) targetLogin = '/admin/login';
        if (location.pathname.startsWith('/brand')) targetLogin = '/brand/login';

        return <Navigate to={fallbackPath || targetLogin} state={{ from: location }} replace />;
    }

    // If roles are specified, check if user's role matches
    // Only check if profile is loaded (not null and not undefined)
    if (allowedRoles && allowedRoles.length > 0) {
        // If profile is still loading or not available, wait
        if (profile === null && user) {
            // User is logged in but profile not loaded yet - show loading
            return (
                <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingSpinner />
                </div>
            );
        }
        
        // If profile exists and role doesn't match
        if (profile && !allowedRoles.includes(profile.role)) {
            console.warn(`Access denied. User role "${profile.role}" is not in allowed roles:`, allowedRoles);

            // Redirect to user's appropriate dashboard based on their role
            let redirectPath = '/unauthorized';
            if (profile.role === 'admin') {
                redirectPath = '/admin/dashboard';
            } else if (profile.role === 'brand_owner' || profile.role === 'brand_emp') {
                redirectPath = '/brand/dashboard';
            } else if (profile.role === 'creator') {
                redirectPath = '/creator/dashboard';
            }

            // If redirecting to dashboard, do it silently. Otherwise show unauthorized page.
            if (redirectPath !== '/unauthorized') {
                return <Navigate to={redirectPath} replace />;
            }

            return <Navigate to="/unauthorized" state={{ from: location, attemptedRole: profile.role, requiredRoles: allowedRoles }} replace />;
        }
    }

    return <>{children}</>;
};
