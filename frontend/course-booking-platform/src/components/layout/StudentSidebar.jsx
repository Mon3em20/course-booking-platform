import React from 'react';
import {
    Box,
    Flex,
    Text,
    VStack,
    Icon,
    Divider,
    Button,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaBook,
    FaCalendarAlt,
    FaCertificate,
    FaUserCircle,
    FaCog,
    FaBell,
    FaQuestionCircle,
    FaGraduationCap
} from 'react-icons/fa';

const NavItem = ({ icon, children, to, isActive }) => {
    return (
        <Box
            as={RouterLink}
            to={to}
            display="flex"
            alignItems="center"
            py={3}
            px={6}
            borderRadius="md"
            transition="all 0.3s"
            bg={isActive ? 'blue.50' : 'transparent'}
            color={isActive ? 'blue.500' : 'inherit'}
            fontWeight={isActive ? 'medium' : 'normal'}
            _hover={{
                bg: 'blue.50',
                color: 'blue.500',
            }}
        >
            <Icon as={icon} boxSize={5} mr={4} />
            <Text>{children}</Text>
            {isActive && (
                <Box
                    position="absolute"
                    right={0}
                    top="50%"
                    transform="translateY(-50%)"
                    w="4px"
                    h="60%"
                    bg="blue.500"
                    borderLeftRadius="md"
                />
            )}
        </Box>
    );
};

const StudentSidebar = ({ onClose }) => {
    const location = useLocation();
    const pathname = location.pathname;

    const isActive = (path) => {
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    return (
        <Box>
            <VStack align="stretch" spacing={1}>
                <NavItem
                    icon={FaHome}
                    to="/dashboard/overview"
                    isActive={isActive('/dashboard/overview') || pathname === '/dashboard'}
                >
                    Dashboard
                </NavItem>
                <NavItem
                    icon={FaBook}
                    to="/dashboard/my-courses"
                    isActive={isActive('/dashboard/my-courses')}
                >
                    My Courses
                </NavItem>
                <NavItem
                    icon={FaCalendarAlt}
                    to="/dashboard/my-bookings"
                    isActive={isActive('/dashboard/my-bookings')}
                >
                    My Bookings
                </NavItem>
                <NavItem
                    icon={FaCertificate}
                    to="/dashboard/certificates"
                    isActive={isActive('/dashboard/certificates')}
                >
                    Certificates
                </NavItem>
                <NavItem
                    icon={FaBell}
                    to="/dashboard/notifications"
                    isActive={isActive('/dashboard/notifications')}
                >
                    Notifications
                </NavItem>

                <Divider my={4} />

                <NavItem
                    icon={FaUserCircle}
                    to="/dashboard/profile"
                    isActive={isActive('/dashboard/profile')}
                >
                    My Profile
                </NavItem>
                <NavItem
                    icon={FaCog}
                    to="/dashboard/settings"
                    isActive={isActive('/dashboard/settings')}
                >
                    Settings
                </NavItem>
            </VStack>

            <Divider my={4} />

            <Box px={6}>
                <Button
                    as={RouterLink}
                    to="/courses"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<Icon as={FaGraduationCap} />}
                    size="sm"
                    width="full"
                    mb={3}
                >
                    Browse Courses
                </Button>
                <Button
                    as={RouterLink}
                    to="/help"
                    variant="ghost"
                    leftIcon={<Icon as={FaQuestionCircle} />}
                    size="sm"
                    width="full"
                >
                    Help Center
                </Button>
            </Box>
        </Box>
    );
};

export default StudentSidebar;