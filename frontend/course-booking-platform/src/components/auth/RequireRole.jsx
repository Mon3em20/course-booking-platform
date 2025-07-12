import React from 'react';
import { Navigate } from 'react-router-dom';
import { Center, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const RequireRole = ({ roles, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // Already handled in RequireAuth
    }

    // Check if the user has one of the required roles
    if (!user || !roles.includes(user.role)) {
        // Redirect based on user role
        if (user?.role === 'student') {
            return <Navigate to="/dashboard" replace />;
        } else if (user?.role === 'instructor') {
            return <Navigate to="/instructor" replace />;
        } else if (user?.role === 'admin') {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default RequireRole;