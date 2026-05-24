import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireSuperAdmin, requireTenant }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If user is not yet loaded, show a loader or just let it pass until the state hydrates
    if (!user) {
        return <div className="flex h-screen items-center justify-center text-indigo-500">Loading your secure environment...</div>;
    }

    if (requireSuperAdmin && user.school_id !== null) {
        // A tenant user trying to access platform routes -> redirect to their school panel
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (requireTenant && user.school_id === null) {
        // Super Admin trying to access a school panel -> redirect to platform panel
        return <Navigate to="/platform/dashboard" replace />;
    }

    return children || <Outlet />;
};

export default ProtectedRoute;
