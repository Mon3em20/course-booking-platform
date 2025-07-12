import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import DashboardHeader from '../components/layout/DashboardHeader';
import StudentSidebar from '../components/layout/StudentSidebar';
import InstructorSidebar from '../components/layout/InstructorSidebar';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = ({ isInstructor = false }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Check if mobile view
    const isMobile = useBreakpointValue({ base: true, lg: false });

    // Automatically close drawer when navigating on mobile
    React.useEffect(() => {
        if (isMobile && isOpen) {
            onClose();
        }
    }, [location.pathname, isMobile, isOpen, onClose]);

    // Redirect based on role if needed
    React.useEffect(() => {
        if (user && user.role === 'instructor' && !isInstructor && !location.pathname.startsWith('/instructor')) {
            navigate('/instructor/dashboard');
        }
    }, [user, isInstructor, navigate, location]);

    return (
        <Box minH="100vh" bg="gray.50">
            <DashboardHeader onMenuClick={onOpen} />
            <Flex>
                {/* Sidebar for desktop */}
                {!isMobile && (
                    <Box
                        w="250px"
                        bg="white"
                        borderRight="1px"
                        borderColor="gray.200"
                        position="fixed"
                        h="calc(100vh - 60px)"
                        pt={4}
                        overflowY="auto"
                    >
                        {isInstructor || user?.role === 'instructor' ? (
                            <InstructorSidebar />
                        ) : (
                            <StudentSidebar />
                        )}
                    </Box>
                )}

                {/* Drawer for mobile */}
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth="1px">
                            {user?.name || 'Dashboard'}
                        </DrawerHeader>
                        <DrawerBody p={0}>
                            {isInstructor || user?.role === 'instructor' ? (
                                <InstructorSidebar onClose={onClose} />
                            ) : (
                                <StudentSidebar onClose={onClose} />
                            )}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                {/* Main content */}
                <Box
                    ml={{ base: 0, lg: '250px' }}
                    w={{ base: '100%', lg: 'calc(100% - 250px)' }}
                    p={4}
                >
                    <Outlet />
                </Box>
            </Flex>
        </Box>
    );
};

export default DashboardLayout;