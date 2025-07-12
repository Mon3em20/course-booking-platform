import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
    Text,
    HStack,
    VStack,
    Avatar,
    Heading,
    Divider,
    Icon,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { FaBars, FaTachometerAlt, FaUsers, FaBookOpen, FaMoneyBill, FaChartPie, FaCog, FaBell, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/shared/Logo';

const AdminSidebarItem = ({ icon, children, to, active }) => {
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
            bg={active ? 'blue.700' : 'transparent'}
            color={active ? 'white' : 'gray.200'}
            _hover={{
                bg: 'blue.700',
                color: 'white',
            }}
        >
            <Icon as={icon} boxSize={5} mr={4} />
            <Text>{children}</Text>
            {active && (
                <Box
                    position="absolute"
                    right={0}
                    top="50%"
                    transform="translateY(-50%)"
                    w="4px"
                    h="60%"
                    bg="blue.300"
                    borderLeftRadius="md"
                />
            )}
        </Box>
    );
};

const AdminLayout = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, logout } = useAuth();
    const location = useLocation();

    // Check if mobile view
    const isMobile = useBreakpointValue({ base: true, lg: false });

    // Automatically close drawer when navigating on mobile
    React.useEffect(() => {
        if (isMobile && isOpen) {
            onClose();
        }
    }, [location.pathname, isMobile, isOpen, onClose]);

    // Check active route
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <Box minH="100vh">
            {/* Top Navigation */}
            <Box
                as="header"
                bg="white"
                px={4}
                height="60px"
                borderBottom="1px"
                borderColor="gray.200"
                position="fixed"
                w="full"
                zIndex="999"
                boxShadow="sm"
            >
                <Flex h="100%" alignItems="center" justifyContent="space-between">
                    <HStack spacing={4}>
                        <IconButton
                            display={{ base: 'flex', lg: 'none' }}
                            onClick={onOpen}
                            variant="ghost"
                            aria-label="open menu"
                            icon={<FaBars />}
                        />
                        <Box display={{ base: 'none', lg: 'block' }}>
                            <Logo />
                        </Box>
                    </HStack>

                    <HStack spacing={4}>
                        <Menu>
                            <MenuButton position="relative">
                                <Icon as={FaBell} boxSize={5} />
                                <Badge
                                    position="absolute"
                                    top="-5px"
                                    right="-5px"
                                    colorScheme="red"
                                    borderRadius="full"
                                    boxSize="5"
                                    fontSize="xs"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    5
                                </Badge>
                            </MenuButton>
                            <MenuList zIndex={1001}>
                                <MenuItem>New user registration</MenuItem>
                                <MenuItem>Course approval request</MenuItem>
                                <MenuItem>System update available</MenuItem>
                                <MenuItem>New support ticket</MenuItem>
                                <MenuItem>Payment reconciliation needed</MenuItem>
                            </MenuList>
                        </Menu>

                        <Menu>
                            <MenuButton>
                                <HStack>
                                    <Avatar
                                        size="sm"
                                        name={user?.name || 'Admin User'}
                                        src={user?.profileImage}
                                    />
                                    <Box display={{ base: 'none', md: 'block' }}>
                                        <Text fontWeight="medium">{user?.name || 'Admin User'}</Text>
                                        <Text fontSize="xs" color="gray.500">Administrator</Text>
                                    </Box>
                                </HStack>
                            </MenuButton>
                            <MenuList zIndex={1001}>
                                <MenuItem icon={<FaUser />} as={RouterLink} to="/admin/profile">Profile</MenuItem>
                                <MenuItem icon={<FaCog />} as={RouterLink} to="/admin/settings">Settings</MenuItem>
                                <Divider />
                                <MenuItem icon={<FaSignOutAlt />} onClick={logout} color="red.500">
                                    Sign Out
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>
            </Box>

            {/* Sidebar for desktop */}
            <Box
                display={{ base: 'none', lg: 'block' }}
                position="fixed"
                left={0}
                w="250px"
                h="full"
                bg="blue.800"
                color="white"
                pt="60px"
                zIndex="1"
            >
                <VStack align="stretch" spacing={1} py={6}>
                    <Box px={6} mb={4}>
                        <Heading size="sm" color="gray.300" letterSpacing="wide" textTransform="uppercase">
                            Admin Panel
                        </Heading>
                    </Box>

                    <AdminSidebarItem
                        icon={FaTachometerAlt}
                        to="/admin/dashboard"
                        active={isActive('/admin/dashboard') || location.pathname === '/admin'}
                    >
                        Dashboard
                    </AdminSidebarItem>

                    <AdminSidebarItem
                        icon={FaUsers}
                        to="/admin/users"
                        active={isActive('/admin/users')}
                    >
                        User Management
                    </AdminSidebarItem>

                    <AdminSidebarItem
                        icon={FaBookOpen}
                        to="/admin/courses"
                        active={isActive('/admin/courses')}
                    >
                        Course Management
                    </AdminSidebarItem>

                    <AdminSidebarItem
                        icon={FaMoneyBill}
                        to="/admin/bookings"
                        active={isActive('/admin/bookings')}
                    >
                        Bookings & Payments
                    </AdminSidebarItem>

                    <AdminSidebarItem
                        icon={FaChartPie}
                        to="/admin/reports"
                        active={isActive('/admin/reports')}
                    >
                        Reports & Analytics
                    </AdminSidebarItem>

                    <Divider my={4} borderColor="blue.700" />

                    <AdminSidebarItem
                        icon={FaCog}
                        to="/admin/settings"
                        active={isActive('/admin/settings')}
                    >
                        System Settings
                    </AdminSidebarItem>
                </VStack>

                {/* Admin info */}
                <Box position="absolute" bottom={0} w="full" p={4} bg="blue.900">
                    <HStack>
                        <Avatar size="sm" name={user?.name} src={user?.profileImage} />
                        <Box>
                            <Text fontWeight="medium" fontSize="sm">
                                {user?.name || 'Admin User'}
                            </Text>
                            <Text fontSize="xs" color="blue.300">
                                Last login: {new Date().toLocaleDateString()}
                            </Text>
                        </Box>
                    </HStack>
                </Box>
            </Box>

            {/* Drawer for mobile */}
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent bg="blue.800" color="white">
                    <DrawerCloseButton color="white" />
                    <DrawerHeader borderBottomWidth="1px" borderColor="blue.700">
                        <HStack>
                            <Logo color="white" />
                            <Text>Admin Panel</Text>
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody p={0}>
                        <VStack align="stretch" spacing={1} py={6}>
                            <AdminSidebarItem
                                icon={FaTachometerAlt}
                                to="/admin/dashboard"
                                active={isActive('/admin/dashboard') || location.pathname === '/admin'}
                            >
                                Dashboard
                            </AdminSidebarItem>

                            <AdminSidebarItem
                                icon={FaUsers}
                                to="/admin/users"
                                active={isActive('/admin/users')}
                            >
                                User Management
                            </AdminSidebarItem>

                            <AdminSidebarItem
                                icon={FaBookOpen}
                                to="/admin/courses"
                                active={isActive('/admin/courses')}
                            >
                                Course Management
                            </AdminSidebarItem>

                            <AdminSidebarItem
                                icon={FaMoneyBill}
                                to="/admin/bookings"
                                active={isActive('/admin/bookings')}
                            >
                                Bookings & Payments
                            </AdminSidebarItem>

                            <AdminSidebarItem
                                icon={FaChartPie}
                                to="/admin/reports"
                                active={isActive('/admin/reports')}
                            >
                                Reports & Analytics
                            </AdminSidebarItem>

                            <Divider my={4} borderColor="blue.700" />

                            <AdminSidebarItem
                                icon={FaCog}
                                to="/admin/settings"
                                active={isActive('/admin/settings')}
                            >
                                System Settings
                            </AdminSidebarItem>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main content */}
            <Box
                ml={{ base: 0, lg: '250px' }}
                pt="60px"
                px={4}
                bg="gray.50"
                minH="100vh"
            >
                <Box py={6}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;