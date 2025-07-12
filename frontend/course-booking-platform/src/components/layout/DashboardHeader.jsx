import React from 'react';
import {
    Box,
    Flex,
    IconButton,
    Avatar,
    Text,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Badge,
    InputGroup,
    Input,
    InputLeftElement,
    useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
    FaBars,
    FaBell,
    FaSearch,
    FaSignOutAlt,
    FaUser,
    FaCog
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../shared/Logo';

const DashboardHeader = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    const getDashboardLink = () => {
        if (!user) return '/dashboard';

        switch (user.role) {
            case 'admin':
                return '/admin';
            case 'instructor':
                return '/instructor';
            default:
                return '/dashboard';
        }
    };

    return (
        <Box
            px={4}
            height="60px"
            borderBottom="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            bg={useColorModeValue('white', 'gray.800')}
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Flex h="100%" alignItems="center" justifyContent="space-between">
                <HStack spacing={4}>
                    <IconButton
                        aria-label="Open menu"
                        fontSize="20px"
                        variant="ghost"
                        icon={<FaBars />}
                        onClick={onMenuClick}
                    />
                    <Box display={{ base: 'none', md: 'block' }}>
                        <Logo />
                    </Box>
                </HStack>

                <Box flex="1" px={{ base: 2, md: 8 }} maxW={{ md: '400px' }}>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <FaSearch color="gray.300" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Search..."
                            variant="filled"
                            bg={useColorModeValue('gray.100', 'gray.700')}
                            _focus={{ bg: useColorModeValue('white', 'gray.800') }}
                            borderRadius="full"
                        />
                    </InputGroup>
                </Box>

                <HStack spacing={3}>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            variant="ghost"
                            icon={<FaBell />}
                            position="relative"
                        >
                            <Badge
                                position="absolute"
                                top="0"
                                right="0"
                                colorScheme="red"
                                borderRadius="full"
                                transform="translate(40%, -40%)"
                                fontSize="xs"
                                px={1.5}
                            >
                                3
                            </Badge>
                        </MenuButton>
                        <MenuList zIndex={100}>
                            <MenuItem as={RouterLink} to={`${getDashboardLink()}/notifications`}>
                                <Text fontWeight="bold">New Course Available</Text>
                                <Text fontSize="sm" color="gray.500">1 hour ago</Text>
                            </MenuItem>
                            <MenuItem as={RouterLink} to={`${getDashboardLink()}/notifications`}>
                                <Text fontWeight="bold">Your Session Starts in 1 Hour</Text>
                                <Text fontSize="sm" color="gray.500">3 hours ago</Text>
                            </MenuItem>
                            <MenuItem as={RouterLink} to={`${getDashboardLink()}/notifications`}>
                                <Text fontWeight="bold">New Review on Your Course</Text>
                                <Text fontSize="sm" color="gray.500">1 day ago</Text>
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem as={RouterLink} to={`${getDashboardLink()}/notifications`}>
                                View All Notifications
                            </MenuItem>
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton>
                            <HStack>
                                <Avatar
                                    size="sm"
                                    src={user?.profileImage}
                                    name={user?.name || 'User'}
                                />
                                <Box display={{ base: 'none', md: 'block' }}>
                                    <Text fontWeight="medium">{user?.name || 'User'}</Text>
                                    <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                                        {user?.role || 'User'}
                                    </Text>
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList zIndex={100}>
                            <MenuItem icon={<FaUser />} as={RouterLink} to={`${getDashboardLink()}/profile`}>
                                Profile
                            </MenuItem>
                            <MenuItem icon={<FaCog />} as={RouterLink} to={`${getDashboardLink()}/settings`}>
                                Settings
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem icon={<FaSignOutAlt />} onClick={logout} color="red.500">
                                Sign Out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Box>
    );
};

export default DashboardHeader;