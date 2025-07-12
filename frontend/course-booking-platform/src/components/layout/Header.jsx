import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Image,
    Text,
    Avatar,
    Badge,
    Container
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaBell, FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../shared/Logo';

const NavLink = ({ children, to, ...rest }) => (
    <Link
        as={RouterLink}
        to={to}
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.100', 'gray.700'),
        }}
        {...rest}
    >
        {children}
    </Link>
);

const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'FAQ', to: '/faq' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
        <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="sm">
            <Container maxW="container.xl">
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <FaTimes /> : <FaBars />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />

                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Logo />
                        </Box>
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {navItems.map((navItem) => (
                                <NavLink key={navItem.label} to={navItem.to}>
                                    {navItem.label}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>

                    <Flex alignItems={'center'}>
                        {isAuthenticated ? (
                            <>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        variant={'ghost'}
                                        icon={<FaBell />}
                                        position="relative"
                                        mr={2}
                                    >
                                        <Badge
                                            position="absolute"
                                            top="0"
                                            right="0"
                                            colorScheme="red"
                                            borderRadius="full"
                                            transform="translate(25%, -25%)"
                                            fontSize="xs"
                                            px={1.5}
                                        >
                                            3
                                        </Badge>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem>New Course Available</MenuItem>
                                        <MenuItem>Your Session Starts in 1 Hour</MenuItem>
                                        <MenuItem>New Review on Your Course</MenuItem>
                                        <MenuDivider />
                                        <MenuItem as={RouterLink} to="/dashboard/notifications">
                                            View All Notifications
                                        </MenuItem>
                                    </MenuList>
                                </Menu>

                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        variant={'ghost'}
                                        cursor={'pointer'}
                                        minW={0}
                                    >
                                        <HStack>
                                            <Avatar
                                                size={'sm'}
                                                src={user.profileImage || undefined}
                                                name={user.name}
                                            />
                                            <Text display={{ base: 'none', md: 'block' }}>{user.name}</Text>
                                        </HStack>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem icon={<FaUser />} as={RouterLink} to={`${getDashboardLink()}/profile`}>
                                            Profile
                                        </MenuItem>
                                        <MenuItem icon={<FaCog />} as={RouterLink} to={`${getDashboardLink()}/settings`}>
                                            Settings
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem
                                            icon={<FaSignOutAlt />}
                                            onClick={handleLogout}
                                            color="red.500"
                                        >
                                            Sign Out
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </>
                        ) : (
                            <HStack spacing={4}>
                                <Button as={RouterLink} to="/login" variant={'ghost'} fontSize={'sm'}>
                                    Sign In
                                </Button>
                                <Button
                                    as={RouterLink}
                                    to="/register"
                                    fontSize={'sm'}
                                    fontWeight={600}
                                    colorScheme="blue"
                                >
                                    Sign Up
                                </Button>
                            </HStack>
                        )}
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {navItems.map((navItem) => (
                                <NavLink key={navItem.label} to={navItem.to}>
                                    {navItem.label}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Container>
        </Box>
    );
};

export default Header;