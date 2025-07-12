import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const RequireAuth = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Center h="100vh">
                <VStack spacing={4}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                    <Text>Authenticating...</Text>
                </VStack>
            </Center>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default RequireAuth;