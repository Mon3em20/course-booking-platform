import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Flex,
    HStack,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    Avatar,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Switch,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    SimpleGrid,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FaSearch,
    FaEllipsisV,
    FaUserPlus,
    FaUserEdit,
    FaTrash,
    FaEye,
    FaUserShield,
    FaLock,
    FaUnlock,
    FaUserClock,
    FaEnvelope,
} from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../../api/admin';

const UserManagementPage = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const addUserModal = useDisclosure();
    const editUserModal = useDisclosure();
    const deleteUserModal = useDisclosure();
    const userDetailsDrawer = useDisclosure();

    // Get users
    const { data, isLoading, error } = useQuery(
        'users',
        getUsers,
        {
            onError: () => {
                toast({
                    title: 'Error loading users',
                    description: 'Failed to load users data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Create user mutation
    const createUserMutation = useMutation(
        (userData) => createUser(userData),
        {
            onSuccess: () => {
                toast({
                    title: 'User created',
                    description: 'User has been created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('users');
                addUserModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error creating user',
                    description: error.message || 'Failed to create user',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update user mutation
    const updateUserMutation = useMutation(
        (userData) => updateUser(userData.id, userData.data),
        {
            onSuccess: () => {
                toast({
                    title: 'User updated',
                    description: 'User has been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('users');
                editUserModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error updating user',
                    description: error.message || 'Failed to update user',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Delete user mutation
    const deleteUserMutation = useMutation(
        (userId) => deleteUser(userId),
        {
            onSuccess: () => {
                toast({
                    title: 'User deleted',
                    description: 'User has been deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('users');
                deleteUserModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error deleting user',
                    description: error.message || 'Failed to delete user',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Toggle user status mutation
    const toggleStatusMutation = useMutation(
        (userId) => toggleUserStatus(userId),
        {
            onSuccess: (data) => {
                const actionText = data.isActive ? 'activated' : 'deactivated';
                toast({
                    title: `User ${actionText}`,
                    description: `User has been ${actionText} successfully`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('users');
            },
            onError: (error) => {
                toast({
                    title: 'Error updating user status',
                    description: error.message || 'Failed to update user status',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Add user form validation
    const addUserFormik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: 'student',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
            role: Yup.string().required('Role is required'),
        }),
        onSubmit: (values) => {
            createUserMutation.mutate(values);
        },
    });

    // Edit user form validation
    const editUserFormik = useFormik({
        initialValues: {
            name: '',
            email: '',
            role: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            role: Yup.string().required('Role is required'),
        }),
        onSubmit: (values) => {
            if (!selectedUser) return;
            updateUserMutation.mutate({
                id: selectedUser._id,
                data: values
            });
        },
    });

    // Filter users based on search, role, and status
    const getFilteredUsers = () => {
        if (!data?.users) return [];

        return data.users.filter(user => {
            const matchesSearch = searchQuery === '' ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = filterRole === 'all' || user.role === filterRole;

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && user.isActive) ||
                (filterStatus === 'inactive' && !user.isActive);

            return matchesSearch && matchesRole && matchesStatus;
        });
    };

    const filteredUsers = getFilteredUsers();

    // Open user details drawer
    const openUserDetails = (user) => {
        setSelectedUser(user);
        userDetailsDrawer.onOpen();
    };

    // Open edit user modal
    const openEditUserModal = (user) => {
        setSelectedUser(user);
        editUserFormik.setValues({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        editUserModal.onOpen();
    };

    // Open delete user confirmation modal
    const openDeleteUserModal = (user) => {
        setSelectedUser(user);
        deleteUserModal.onOpen();
    };

    // Handle user status toggle
    const handleToggleUserStatus = (userId) => {
        toggleStatusMutation.mutate(userId);
    };

    // Get badge color based on role
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'red';
            case 'instructor':
                return 'purple';
            case 'student':
                return 'green';
            default:
                return 'gray';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get user counts by role
    const adminCount = data?.users?.filter(user => user.role === 'admin').length || 0;
    const instructorCount = data?.users?.filter(user => user.role === 'instructor').length || 0;
    const studentCount = data?.users?.filter(user => user.role === 'student').length || 0;
    const activeCount = data?.users?.filter(user => user.isActive).length || 0;

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading users...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>User Management</Heading>
                <Text color="gray.600">View and manage all users in the system</Text>
            </Box>

            {/* User Statistics */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Total Users</StatLabel>
                    <StatNumber>{data?.users?.length || 0}</StatNumber>
                    <StatHelpText>All registered users</StatHelpText>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Students</StatLabel>
                    <StatNumber>{studentCount}</StatNumber>
                    <Badge colorScheme="green">Student</Badge>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Instructors</StatLabel>
                    <StatNumber>{instructorCount}</StatNumber>
                    <Badge colorScheme="purple">Instructor</Badge>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Admins</StatLabel>
                    <StatNumber>{adminCount}</StatNumber>
                    <Badge colorScheme="red">Admin</Badge>
                </Stat>
            </SimpleGrid>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading users. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Search and Filter Bar */}
                    <Flex
                        mb={6}
                        flexDir={{ base: "column", md: "row" }}
                        gap={4}
                        justify="space-between"
                    >
                        <InputGroup maxW={{ md: "320px" }}>
                            <InputLeftElement pointerEvents="none">
                                <FaSearch color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>

                        <HStack>
                            <Select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="student">Students</option>
                                <option value="instructor">Instructors</option>
                                <option value="admin">Admins</option>
                            </Select>

                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Select>

                            <Button
                                leftIcon={<FaUserPlus />}
                                colorScheme="blue"
                                onClick={addUserModal.onOpen}
                            >
                                Add User
                            </Button>
                        </HStack>
                    </Flex>

                    {/* Users Tabs */}
                    <Tabs colorScheme="blue" isLazy>
                        <TabList overflowX="auto" whiteSpace="nowrap">
                            <Tab>All Users ({data?.users?.length || 0})</Tab>
                            <Tab>Active ({activeCount})</Tab>
                            <Tab>Students ({studentCount})</Tab>
                            <Tab>Instructors ({instructorCount})</Tab>
                            <Tab>Admins ({adminCount})</Tab>
                        </TabList>

                        <TabPanels>
                            {/* All Users Tab */}
                            <TabPanel px={0}>
                                {renderUserTable(filteredUsers)}
                            </TabPanel>

                            {/* Active Users Tab */}
                            <TabPanel px={0}>
                                {renderUserTable(data?.users?.filter(user => user.isActive) || [])}
                            </TabPanel>

                            {/* Students Tab */}
                            <TabPanel px={0}>
                                {renderUserTable(data?.users?.filter(user => user.role === 'student') || [])}
                            </TabPanel>

                            {/* Instructors Tab */}
                            <TabPanel px={0}>
                                {renderUserTable(data?.users?.filter(user => user.role === 'instructor') || [])}
                            </TabPanel>

                            {/* Admins Tab */}
                            <TabPanel px={0}>
                                {renderUserTable(data?.users?.filter(user => user.role === 'admin') || [])}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </>
            )}

            {/* Add User Modal */}
            <Modal isOpen={addUserModal.isOpen} onClose={addUserModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New User</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form id="add-user-form" onSubmit={addUserFormik.handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl
                                    isInvalid={addUserFormik.touched.name && addUserFormik.errors.name}
                                >
                                    <FormLabel>Full Name</FormLabel>
                                    <Input
                                        {...addUserFormik.getFieldProps('name')}
                                        placeholder="John Doe"
                                    />
                                    <FormErrorMessage>{addUserFormik.errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isInvalid={addUserFormik.touched.email && addUserFormik.errors.email}
                                >
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...addUserFormik.getFieldProps('email')}
                                        placeholder="john@example.com"
                                        type="email"
                                    />
                                    <FormErrorMessage>{addUserFormik.errors.email}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isInvalid={addUserFormik.touched.password && addUserFormik.errors.password}
                                >
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        {...addUserFormik.getFieldProps('password')}
                                        placeholder="Enter password"
                                        type="password"
                                    />
                                    <FormErrorMessage>{addUserFormik.errors.password}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isInvalid={addUserFormik.touched.role && addUserFormik.errors.role}
                                >
                                    <FormLabel>Role</FormLabel>
                                    <Select {...addUserFormik.getFieldProps('role')}>
                                        <option value="student">Student</option>
                                        <option value="instructor">Instructor</option>
                                        <option value="admin">Admin</option>
                                    </Select>
                                    <FormErrorMessage>{addUserFormik.errors.role}</FormErrorMessage>
                                </FormControl>
                            </VStack>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={addUserModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            form="add-user-form"
                            isLoading={createUserMutation.isLoading}
                            loadingText="Creating"
                        >
                            Create User
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Edit User Modal */}
            <Modal isOpen={editUserModal.isOpen} onClose={editUserModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form id="edit-user-form" onSubmit={editUserFormik.handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl
                                    isInvalid={editUserFormik.touched.name && editUserFormik.errors.name}
                                >
                                    <FormLabel>Full Name</FormLabel>
                                    <Input
                                        {...editUserFormik.getFieldProps('name')}
                                        placeholder="John Doe"
                                    />
                                    <FormErrorMessage>{editUserFormik.errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isInvalid={editUserFormik.touched.email && editUserFormik.errors.email}
                                >
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...editUserFormik.getFieldProps('email')}
                                        placeholder="john@example.com"
                                        type="email"
                                    />
                                    <FormErrorMessage>{editUserFormik.errors.email}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isInvalid={editUserFormik.touched.role && editUserFormik.errors.role}
                                >
                                    <FormLabel>Role</FormLabel>
                                    <Select {...editUserFormik.getFieldProps('role')}>
                                        <option value="student">Student</option>
                                        <option value="instructor">Instructor</option>
                                        <option value="admin">Admin</option>
                                    </Select>
                                    <FormErrorMessage>{editUserFormik.errors.role}</FormErrorMessage>
                                </FormControl>
                            </VStack>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={editUserModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            form="edit-user-form"
                            isLoading={updateUserMutation.isLoading}
                            loadingText="Updating"
                        >
                            Update User
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete User Modal */}
            <Modal isOpen={deleteUserModal.isOpen} onClose={deleteUserModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete User</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text>
                            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                        </Text>
                        <Alert status="warning" mt={4}>
                            <AlertIcon />
                            <Text fontSize="sm">
                                Deleting this user will remove all their data, including course enrollments, course creations (if instructor), and payment history.
                            </Text>
                        </Alert>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={deleteUserModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => deleteUserMutation.mutate(selectedUser?._id)}
                            isLoading={deleteUserMutation.isLoading}
                            loadingText="Deleting"
                        >
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* User Details Drawer */}
            <Drawer
                isOpen={userDetailsDrawer.isOpen}
                placement="right"
                onClose={userDetailsDrawer.onClose}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">User Details</DrawerHeader>

                    <DrawerBody>
                        {selectedUser && (
                            <VStack spacing={6} align="stretch">
                                <Flex align="center" mb={4}>
                                    <Avatar
                                        size="xl"
                                        name={selectedUser.name}
                                        src={selectedUser.profileImage}
                                        mr={4}
                                    />
                                    <Box>
                                        <HStack mb={1}>
                                            <Heading size="md">{selectedUser.name}</Heading>
                                            <Badge colorScheme={getRoleBadgeColor(selectedUser.role)}>
                                                {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                                            </Badge>
                                        </HStack>
                                        <Text color="gray.600">{selectedUser.email}</Text>
                                        <Badge colorScheme={selectedUser.isActive ? "green" : "red"} mt={2}>
                                            {selectedUser.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </Box>
                                </Flex>

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Account Information</Text>
                                    <VStack align="stretch" spacing={3} pl={4}>
                                        <Flex justify="space-between">
                                            <Text color="gray.600">Created:</Text>
                                            <Text>{formatDate(selectedUser.createdAt)}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text color="gray.600">Last Login:</Text>
                                            <Text>{formatDate(selectedUser.lastLogin)}</Text>
                                        </Flex>
                                        {selectedUser.role === 'instructor' && (
                                            <>
                                                <Flex justify="space-between">
                                                    <Text color="gray.600">Courses Created:</Text>
                                                    <Text>{selectedUser.coursesCreated || 0}</Text>
                                                </Flex>
                                                <Flex justify="space-between">
                                                    <Text color="gray.600">Total Students:</Text>
                                                    <Text>{selectedUser.totalStudents || 0}</Text>
                                                </Flex>
                                            </>
                                        )}
                                        {selectedUser.role === 'student' && (
                                            <>
                                                <Flex justify="space-between">
                                                    <Text color="gray.600">Courses Enrolled:</Text>
                                                    <Text>{selectedUser.coursesEnrolled || 0}</Text>
                                                </Flex>
                                                <Flex justify="space-between">
                                                    <Text color="gray.600">Courses Completed:</Text>
                                                    <Text>{selectedUser.coursesCompleted || 0}</Text>
                                                </Flex>
                                            </>
                                        )}
                                    </VStack>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Actions</Text>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Button
                                            leftIcon={<FaUserEdit />}
                                            onClick={() => {
                                                userDetailsDrawer.onClose();
                                                openEditUserModal(selectedUser);
                                            }}
                                            colorScheme="blue"
                                        >
                                            Edit User
                                        </Button>

                                        <Button
                                            leftIcon={selectedUser.isActive ? <FaLock /> : <FaUnlock />}
                                            onClick={() => handleToggleUserStatus(selectedUser._id)}
                                            colorScheme={selectedUser.isActive ? "red" : "green"}
                                            variant="outline"
                                        >
                                            {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>

                                        <Button
                                            leftIcon={<FaTrash />}
                                            onClick={() => {
                                                userDetailsDrawer.onClose();
                                                openDeleteUserModal(selectedUser);
                                            }}
                                            colorScheme="red"
                                        >
                                            Delete
                                        </Button>

                                        <Button
                                            leftIcon={<FaEnvelope />}
                                            variant="outline"
                                        >
                                            Send Email
                                        </Button>
                                    </SimpleGrid>
                                </Box>
                            </VStack>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );

    // Helper function to render user table
    function renderUserTable(users) {
        if (!users.length) {
            return (
                <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                    <Text>No users found.</Text>
                </Box>
            );
        }

        return (
            <Box overflowX="auto">
                <Table variant="simple" borderWidth="1px" borderRadius="lg">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Role</Th>
                            <Th>Status</Th>
                            <Th>Joined Date</Th>
                            <Th width="100px">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                            <Tr key={user._id}>
                                <Td>
                                    <HStack>
                                        <Avatar size="sm" name={user.name} src={user.profileImage} />
                                        <Text fontWeight="medium">{user.name}</Text>
                                    </HStack>
                                </Td>
                                <Td>{user.email}</Td>
                                <Td>
                                    <Badge colorScheme={getRoleBadgeColor(user.role)}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge colorScheme={user.isActive ? "green" : "red"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </Td>
                                <Td>{formatDate(user.createdAt)}</Td>
                                <Td>
                                    <Menu>
                                        <MenuButton
                                            as={IconButton}
                                            icon={<FaEllipsisV />}
                                            variant="ghost"
                                            size="sm"
                                        />
                                        <MenuList>
                                            <MenuItem
                                                icon={<FaEye />}
                                                onClick={() => openUserDetails(user)}
                                            >
                                                View Details
                                            </MenuItem>
                                            <MenuItem
                                                icon={<FaUserEdit />}
                                                onClick={() => openEditUserModal(user)}
                                            >
                                                Edit
                                            </MenuItem>
                                            <MenuItem
                                                icon={user.isActive ? <FaLock /> : <FaUnlock />}
                                                onClick={() => handleToggleUserStatus(user._id)}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </MenuItem>
                                            <MenuItem
                                                icon={<FaTrash />}
                                                color="red.500"
                                                onClick={() => openDeleteUserModal(user)}
                                            >
                                                Delete
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        );
    }
};

export default UserManagementPage;