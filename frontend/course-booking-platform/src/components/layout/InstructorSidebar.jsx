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
    FaBookOpen,
    FaCalendarAlt,
    FaUsers,
    FaUserCircle,
    FaCog,
    FaBell,
    FaQuestionCircle,
    FaChartLine,
    FaStar,
    FaPlus,
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

const InstructorSidebar = ({ onClose }) => {
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
                    to="/instructor/dashboard"
                    isActive={isActive('/instructor/dashboard') || pathname === '/instructor'}
                >
                    Dashboard
                </NavItem>
                <NavItem
                    icon={FaBookOpen}
                    to="/instructor/courses"
                    isActive={isActive('/instructor/courses')}
                >
                    My Courses
                </NavItem>
                <NavItem
                    icon={FaUsers}
                    to="/instructor/students"
                    isActive={isActive('/instructor/students')}
                >
                    Students
                </NavItem>
                <NavItem
                    icon={FaCalendarAlt}
                    to="/instructor/sessions"
                    isActive={isActive('/instructor/sessions')}
                >
                    Sessions
                </NavItem>
                <NavItem
                    icon={FaStar}
                    to="/instructor/reviews"
                    isActive={isActive('/instructor/reviews')}
                >
                    Reviews
                </NavItem>
                <NavItem
                    icon={FaChartLine}
                    to="/instructor/analytics"
                    isActive={isActive('/instructor/analytics')}
                >
                    Analytics
                </NavItem>
                <NavItem
                    icon={FaBell}
                    to="/instructor/notifications"
                    isActive={isActive('/instructor/notifications')}
                >
                    Notifications
                </NavItem>

                <Divider my={4} />

                <NavItem
                    icon={FaUserCircle}
                    to="/instructor/profile"
                    isActive={isActive('/instructor/profile')}
                >
                    My Profile
                </NavItem>
                <NavItem
                    icon={FaCog}
                    to="/instructor/settings"
                    isActive={isActive('/instructor/settings')}
                >
                    Settings
                </NavItem>
            </VStack>

            <Divider my={4} />

            <Box px={6}>
                <Button
                    as={RouterLink}
                    to="/instructor/courses/new"
                    colorScheme="blue"
                    leftIcon={<Icon as={FaPlus} />}
                    size="sm"
                    width="full"
                    mb={3}
                >
                    Create New Course
                </Button>
                <Button
                    as={RouterLink}
                    to="/instructor/help"
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

export default InstructorSidebar;