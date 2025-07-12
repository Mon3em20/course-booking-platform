import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    SimpleGrid,
    VStack,
    HStack,
    Badge,
    Flex,
    IconButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    useDisclosure,
    useColorModeValue,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEllipsisV, FaPlus, FaSearch, FaTrash, FaEdit, FaEye, FaCalendarCheck } from 'react-icons/fa';
import { getCourseSessions, createSession, updateSession, deleteSession } from '../../api/instructor';
import SessionForm from '../../components/instructor/SessionForm';
import DeleteConfirmationModal from '../../components/shared/DeleteConfirmationModal';

const SessionManagementPage = () => {
    const { courseId } = useParams();
    const toast = useToast();
    const queryClient = useQueryClient();
    const formModal = useDisclosure();
    const deleteModal = useDisclosure();
    const [selectedSession, setSelectedSession] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [editingSessionIndex, setEditingSessionIndex] = useState(-1);

    // Get course sessions
    const { data, isLoading, error } = useQuery(
        ['courseSessions', courseId],
        () => getCourseSessions(courseId),
        {
            onError: () => {
                toast({
                    title: 'Error loading sessions',
                    description: 'Failed to load course sessions',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Create session mutation
    const createMutation = useMutation(
        (sessionData) => createSession(courseId, sessionData),
        {
            onSuccess: () => {
                toast({
                    title: 'Session created',
                    description: 'The session has been created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries(['courseSessions', courseId]);
            },
            onError: (error) => {
                toast({
                    title: 'Error creating session',
                    description: error.message || 'Failed to create session',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update session mutation
    const updateMutation = useMutation(
        ({ sessionId, sessionData }) => updateSession(courseId, sessionId, sessionData),
        {
            onSuccess: () => {
                toast({
                    title: 'Session updated',
                    description: 'The session has been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries(['courseSessions', courseId]);
            },
            onError: (error) => {
                toast({
                    title: 'Error updating session',
                    description: error.message || 'Failed to update session',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Delete session mutation
    const deleteMutation = useMutation(
        (sessionId) => deleteSession(courseId, sessionId),
        {
            onSuccess: () => {
                toast({
                    title: 'Session deleted',
                    description: 'The session has been deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries(['courseSessions', courseId]);
                deleteModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error deleting session',
                    description: error.message || 'Failed to delete session',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Handle creating a new session
    const handleAddSession = (sessionData) => {
        createMutation.mutate(sessionData);
    };

    // Handle updating a session
    const handleUpdateSession = (index, sessionData) => {
        const session = data?.sessions[index];
        if (!session) return;

        updateMutation.mutate({
            sessionId: session._id,
            sessionData
        });
    };

    // Handle session deletion
    const handleDeleteSession = () => {
        if (!selectedSession) return;
        deleteMutation.mutate(selectedSession._id);
    };

    // Open edit session form
    const openEditSessionForm = (session, index) => {
        setSelectedSession(session);
        setEditingSessionIndex(index);
        formModal.onOpen();
    };

    // Open delete confirmation
    const openDeleteConfirmation = (session) => {
        setSelectedSession(session);
        deleteModal.onOpen();
    };

    // Open add session form
    const openAddSessionForm = () => {
        setSelectedSession(null);
        setEditingSessionIndex(-1);
        formModal.onOpen();
    };

    // Filter sessions based on search query and status
    const getFilteredSessions = () => {
        if (!data?.sessions) return [];

        return data.sessions.filter(session => {
            const matchesQuery = searchQuery === '' ||
                session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (session.description && session.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'upcoming' && new Date(session.date) > new Date()) ||
                (filterStatus === 'past' && new Date(session.date) < new Date());

            return matchesQuery && matchesStatus;
        });
    };

    const filteredSessions = getFilteredSessions();

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Get upcoming and past sessions
    const upcomingSessions = data?.sessions?.filter(
        session => new Date(session.date) > new Date()
    ) || [];

    const pastSessions = data?.sessions?.filter(
        session => new Date(session.date) < new Date()
    ) || [];

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading sessions...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>Manage Sessions</Heading>
                    <Text color="gray.600">
                        {data?.course?.title || 'Course'} - Schedule and organize your course sessions
                    </Text>
                </Box>

                <Button
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    onClick={openAddSessionForm}
                >
                    Add Session
                </Button>
            </Flex>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading sessions. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Search and Filter Bar */}
                    <Flex mb={6} flexDir={{ base: "column", md: "row" }} gap={4}>
                        <InputGroup maxW={{ md: "320px" }}>
                            <InputLeftElement pointerEvents="none">
                                <FaSearch color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>

                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            maxW={{ md: "200px" }}
                        >
                            <option value="all">All Sessions</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </Select>
                    </Flex>

                    {/* Sessions List as Tabs */}
                    <Tabs colorScheme="blue" variant="enclosed" isLazy>
                        <TabList>
                            <Tab>All ({data?.sessions?.length || 0})</Tab>
                            <Tab>Upcoming ({upcomingSessions.length})</Tab>
                            <Tab>Past ({pastSessions.length})</Tab>
                        </TabList>

                        <TabPanels>
                            {/* All Sessions Tab */}
                            <TabPanel px={0}>
                                {filteredSessions.length === 0 ? (
                                    <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                                        <Text mb={4}>No sessions found.</Text>
                                        <Button
                                            leftIcon={<FaPlus />}
                                            colorScheme="blue"
                                            onClick={openAddSessionForm}
                                        >
                                            Add Your First Session
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box overflowX="auto">
                                        <Table variant="simple" borderWidth="1px" borderRadius="lg">
                                            <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                                                <Tr>
                                                    <Th>Title</Th>
                                                    <Th>Date</Th>
                                                    <Th>Time</Th>
                                                    <Th>Type</Th>
                                                    <Th>Status</Th>
                                                    <Th width="100px">Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {filteredSessions.map((session, index) => {
                                                    const isPast = new Date(session.date) < new Date();
                                                    return (
                                                        <Tr key={session._id || index}>
                                                            <Td fontWeight="medium">{session.title}</Td>
                                                            <Td>{formatDate(session.date)}</Td>
                                                            <Td>
                                                                {session.startTime} - {session.endTime}
                                                            </Td>
                                                            <Td>
                                                                <Badge colorScheme={session.type === 'online' ? 'green' : 'purple'}>
                                                                    {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <Badge colorScheme={isPast ? 'red' : 'blue'}>
                                                                    {isPast ? 'Past' : 'Upcoming'}
                                                                </Badge>
                                                            </Td>
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
                                                                            as={RouterLink}
                                                                            to={`/instructor/courses/${courseId}/sessions/${session._id}`}
                                                                        >
                                                                            View Details
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            icon={<FaEdit />}
                                                                            onClick={() => openEditSessionForm(session, index)}
                                                                        >
                                                                            Edit
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            icon={<FaTrash />}
                                                                            color="red.500"
                                                                            onClick={() => openDeleteConfirmation(session)}
                                                                        >
                                                                            Delete
                                                                        </MenuItem>
                                                                    </MenuList>
                                                                </Menu>
                                                            </Td>
                                                        </Tr>
                                                    );
                                                })}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                )}
                            </TabPanel>

                            {/* Upcoming Sessions Tab */}
                            <TabPanel px={0}>
                                {upcomingSessions.length === 0 ? (
                                    <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                                        <Text>No upcoming sessions scheduled.</Text>
                                    </Box>
                                ) : (
                                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                        {upcomingSessions.map((session, index) => (
                                            <Box
                                                key={session._id || index}
                                                p={5}
                                                borderWidth="1px"
                                                borderRadius="lg"
                                                bg="white"
                                                position="relative"
                                                shadow="sm"
                                            >
                                                <Flex justify="space-between" mb={3}>
                                                    <Badge colorScheme="green" px={2} py={1}>
                                                        {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                                                    </Badge>
                                                    <Menu>
                                                        <MenuButton
                                                            as={IconButton}
                                                            icon={<FaEllipsisV />}
                                                            variant="ghost"
                                                            size="sm"
                                                        />
                                                        <MenuList>
                                                            <MenuItem
                                                                icon={<FaEdit />}
                                                                onClick={() => openEditSessionForm(session, index)}
                                                            >
                                                                Edit
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FaTrash />}
                                                                color="red.500"
                                                                onClick={() => openDeleteConfirmation(session)}
                                                            >
                                                                Delete
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Flex>

                                                <Heading size="md" mb={3}>
                                                    {session.title}
                                                </Heading>

                                                <HStack mb={3}>
                                                    <FaCalendarCheck />
                                                    <Text>
                                                        {formatDate(session.date)} • {session.startTime} - {session.endTime}
                                                    </Text>
                                                </HStack>

                                                {session.description && (
                                                    <Text color="gray.600" noOfLines={2} mb={4}>
                                                        {session.description}
                                                    </Text>
                                                )}

                                                <Button
                                                    as={RouterLink}
                                                    to={`/instructor/courses/${courseId}/sessions/${session._id}`}
                                                    size="sm"
                                                    colorScheme="blue"
                                                    mt={2}
                                                >
                                                    View Details
                                                </Button>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                )}
                            </TabPanel>

                            {/* Past Sessions Tab */}
                            <TabPanel px={0}>
                                {pastSessions.length === 0 ? (
                                    <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                                        <Text>No past sessions.</Text>
                                    </Box>
                                ) : (
                                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                        {pastSessions.map((session, index) => (
                                            <Box
                                                key={session._id || index}
                                                p={5}
                                                borderWidth="1px"
                                                borderRadius="lg"
                                                bg="gray.50"
                                                position="relative"
                                                shadow="sm"
                                            >
                                                <Flex justify="space-between" mb={3}>
                                                    <Badge colorScheme="red" px={2} py={1}>
                                                        Past
                                                    </Badge>
                                                    <Menu>
                                                        <MenuButton
                                                            as={IconButton}
                                                            icon={<FaEllipsisV />}
                                                            variant="ghost"
                                                            size="sm"
                                                        />
                                                        <MenuList>
                                                            <MenuItem
                                                                icon={<FaEdit />}
                                                                onClick={() => openEditSessionForm(session, index)}
                                                            >
                                                                Edit
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FaTrash />}
                                                                color="red.500"
                                                                onClick={() => openDeleteConfirmation(session)}
                                                            >
                                                                Delete
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Flex>

                                                <Heading size="md" mb={3}>
                                                    {session.title}
                                                </Heading>

                                                <HStack mb={3}>
                                                    <FaCalendarCheck />
                                                    <Text>
                                                        {formatDate(session.date)} • {session.startTime} - {session.endTime}
                                                    </Text>
                                                </HStack>

                                                {session.description && (
                                                    <Text color="gray.600" noOfLines={2} mb={4}>
                                                        {session.description}
                                                    </Text>
                                                )}

                                                <HStack mt={2}>
                                                    <Button
                                                        as={RouterLink}
                                                        to={`/instructor/courses/${courseId}/sessions/${session._id}`}
                                                        size="sm"
                                                        colorScheme="blue"
                                                        variant="outline"
                                                    >
                                                        View Details
                                                    </Button>

                                                    {session.isRecorded && (
                                                        <Button
                                                            size="sm"
                                                            colorScheme="purple"
                                                            variant="outline"
                                                        >
                                                            View Recording
                                                        </Button>
                                                    )}
                                                </HStack>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </>
            )}

            {/* Session Form Modal */}
            <SessionForm
                isOpen={formModal.isOpen}
                onClose={formModal.onClose}
                onAdd={handleAddSession}
                onUpdate={handleUpdateSession}
                editingSession={selectedSession}
                editingIndex={editingSessionIndex}
                courseId={courseId}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                onConfirm={handleDeleteSession}
                title="Delete Session"
                message="Are you sure you want to delete this session? This action cannot be undone."
                isLoading={deleteMutation.isLoading}
            />
        </Container>
    );
};

export default SessionManagementPage;