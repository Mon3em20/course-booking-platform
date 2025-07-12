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
    Avatar,
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
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Progress,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEllipsisV, FaEnvelope, FaSearch, FaUserPlus, FaUserMinus, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import { getCourseStudents, removeStudentFromCourse, addStudentToCourse } from '../../api/instructor';

const StudentManagementPage = () => {
    const { courseId } = useParams();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const removeConfirmation = useDisclosure();
    const studentDetails = useDisclosure();

    // Get course students
    const { data, isLoading, error } = useQuery(
        ['courseStudents', courseId],
        () => getCourseStudents(courseId),
        {
            onError: () => {
                toast({
                    title: 'Error loading students',
                    description: 'Failed to load course students',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Remove student mutation
    const removeMutation = useMutation(
        (studentId) => removeStudentFromCourse(courseId, studentId),
        {
            onSuccess: () => {
                toast({
                    title: 'Student removed',
                    description: 'The student has been removed from this course',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries(['courseStudents', courseId]);
                removeConfirmation.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error removing student',
                    description: error.message || 'Failed to remove student',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Filter students based on search and status
    const getFilteredStudents = () => {
        if (!data?.students) return [];

        return data.students.filter(student => {
            const matchesQuery = searchQuery === '' ||
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && student.status === 'active') ||
                (filterStatus === 'inactive' && student.status === 'inactive') ||
                (filterStatus === 'completed' && student.status === 'completed');

            return matchesQuery && matchesStatus;
        });
    };

    const filteredStudents = getFilteredStudents();

    // Handle student removal confirmation
    const openRemoveConfirmation = (student) => {
        setSelectedStudent(student);
        removeConfirmation.onOpen();
    };

    // Handle student removal
    const handleRemoveStudent = () => {
        if (!selectedStudent) return;
        removeMutation.mutate(selectedStudent._id);
    };

    // Open student details drawer
    const openStudentDetails = (student) => {
        setSelectedStudent(student);
        studentDetails.onOpen();
    };

    // Get students by status
    const activeStudents = data?.students?.filter(student => student.status === 'active') || [];
    const completedStudents = data?.students?.filter(student => student.status === 'completed') || [];
    const inactiveStudents = data?.students?.filter(student => student.status === 'inactive') || [];

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading students...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>Student Management</Heading>
                    <Text color="gray.600">
                        {data?.course?.title || 'Course'} - Manage enrolled students
                    </Text>
                </Box>

                <Button
                    leftIcon={<FaUserPlus />}
                    colorScheme="blue"
                >
                    Add Student
                </Button>
            </Flex>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading students. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Statistics Cards */}
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                        <Stat
                            bg="white"
                            p={5}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderLeft="4px solid"
                            borderColor="blue.500"
                        >
                            <StatLabel>Total Students</StatLabel>
                            <StatNumber>{data?.students?.length || 0}</StatNumber>
                            <StatHelpText>Enrolled in this course</StatHelpText>
                        </Stat>

                        <Stat
                            bg="white"
                            p={5}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderLeft="4px solid"
                            borderColor="green.500"
                        >
                            <StatLabel>Active Students</StatLabel>
                            <StatNumber>{activeStudents.length}</StatNumber>
                            <StatHelpText>Currently learning</StatHelpText>
                        </Stat>

                        <Stat
                            bg="white"
                            p={5}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderLeft="4px solid"
                            borderColor="purple.500"
                        >
                            <StatLabel>Completed</StatLabel>
                            <StatNumber>{completedStudents.length}</StatNumber>
                            <StatHelpText>Course finished</StatHelpText>
                        </Stat>

                        <Stat
                            bg="white"
                            p={5}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderLeft="4px solid"
                            borderColor="orange.500"
                        >
                            <StatLabel>Inactive Students</StatLabel>
                            <StatNumber>{inactiveStudents.length}</StatNumber>
                            <StatHelpText>Not engaged recently</StatHelpText>
                        </Stat>
                    </SimpleGrid>

                    {/* Search and Filter Bar */}
                    <Flex mb={6} flexDir={{ base: "column", md: "row" }} gap={4}>
                        <InputGroup maxW={{ md: "320px" }}>
                            <InputLeftElement pointerEvents="none">
                                <FaSearch color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>

                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            maxW={{ md: "200px" }}
                        >
                            <option value="all">All Students</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </Flex>

                    {/* Students Tabs */}
                    <Tabs colorScheme="blue" variant="enclosed" isLazy>
                        <TabList>
                            <Tab>All Students ({data?.students?.length || 0})</Tab>
                            <Tab>Active ({activeStudents.length})</Tab>
                            <Tab>Completed ({completedStudents.length})</Tab>
                            <Tab>Inactive ({inactiveStudents.length})</Tab>
                        </TabList>

                        <TabPanels>
                            {/* All Students Tab */}
                            <TabPanel px={0}>
                                {filteredStudents.length === 0 ? (
                                    <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                                        <Text mb={4}>No students found.</Text>
                                    </Box>
                                ) : (
                                    <Box overflowX="auto">
                                        <Table variant="simple" borderWidth="1px" borderRadius="lg">
                                            <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                                                <Tr>
                                                    <Th>Student</Th>
                                                    <Th>Email</Th>
                                                    <Th>Enrollment Date</Th>
                                                    <Th>Progress</Th>
                                                    <Th>Status</Th>
                                                    <Th width="100px">Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {filteredStudents.map((student) => (
                                                    <Tr key={student._id}>
                                                        <Td>
                                                            <HStack>
                                                                <Avatar size="sm" name={student.name} src={student.profileImage} />
                                                                <Text fontWeight="medium">{student.name}</Text>
                                                            </HStack>
                                                        </Td>
                                                        <Td>{student.email}</Td>
                                                        <Td>
                                                            {new Date(student.enrollmentDate).toLocaleDateString()}
                                                        </Td>
                                                        <Td width="200px">
                                                            <Box>
                                                                <Flex justify="space-between" mb={1}>
                                                                    <Text fontSize="xs">{student.progress}%</Text>
                                                                </Flex>
                                                                <Progress
                                                                    value={student.progress}
                                                                    size="xs"
                                                                    colorScheme={
                                                                        student.progress === 100 ? "green" :
                                                                            student.progress > 50 ? "blue" : "orange"
                                                                    }
                                                                    borderRadius="full"
                                                                />
                                                            </Box>
                                                        </Td>
                                                        <Td>
                                                            <Badge
                                                                colorScheme={
                                                                    student.status === 'active' ? 'green' :
                                                                        student.status === 'completed' ? 'purple' : 'orange'
                                                                }
                                                            >
                                                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
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
                                                                        icon={<FaUser />}
                                                                        onClick={() => openStudentDetails(student)}
                                                                    >
                                                                        View Details
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        icon={<FaEnvelope />}
                                                                    >
                                                                        Send Message
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        icon={<FaUserMinus />}
                                                                        color="red.500"
                                                                        onClick={() => openRemoveConfirmation(student)}
                                                                    >
                                                                        Remove from Course
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                )}
                            </TabPanel>

                            {/* Other tabs with filtered lists */}
                            {[
                                { status: 'active', data: activeStudents },
                                { status: 'completed', data: completedStudents },
                                { status: 'inactive', data: inactiveStudents },
                            ].map((tabData, idx) => (
                                <TabPanel key={idx} px={0}>
                                    {tabData.data.length === 0 ? (
                                        <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                                            <Text>No {tabData.status} students found.</Text>
                                        </Box>
                                    ) : (
                                        <Box overflowX="auto">
                                            <Table variant="simple" borderWidth="1px" borderRadius="lg">
                                                <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                                                    <Tr>
                                                        <Th>Student</Th>
                                                        <Th>Email</Th>
                                                        <Th>Enrollment Date</Th>
                                                        <Th>Progress</Th>
                                                        <Th width="100px">Actions</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {tabData.data.map((student) => (
                                                        <Tr key={student._id}>
                                                            <Td>
                                                                <HStack>
                                                                    <Avatar size="sm" name={student.name} src={student.profileImage} />
                                                                    <Text fontWeight="medium">{student.name}</Text>
                                                                </HStack>
                                                            </Td>
                                                            <Td>{student.email}</Td>
                                                            <Td>
                                                                {new Date(student.enrollmentDate).toLocaleDateString()}
                                                            </Td>
                                                            <Td width="200px">
                                                                <Box>
                                                                    <Flex justify="space-between" mb={1}>
                                                                        <Text fontSize="xs">{student.progress}%</Text>
                                                                    </Flex>
                                                                    <Progress
                                                                        value={student.progress}
                                                                        size="xs"
                                                                        colorScheme={
                                                                            student.progress === 100 ? "green" :
                                                                                student.progress > 50 ? "blue" : "orange"
                                                                        }
                                                                        borderRadius="full"
                                                                    />
                                                                </Box>
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
                                                                            icon={<FaUser />}
                                                                            onClick={() => openStudentDetails(student)}
                                                                        >
                                                                            View Details
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            icon={<FaEnvelope />}
                                                                        >
                                                                            Send Message
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            icon={<FaUserMinus />}
                                                                            color="red.500"
                                                                            onClick={() => openRemoveConfirmation(student)}
                                                                        >
                                                                            Remove from Course
                                                                        </MenuItem>
                                                                    </MenuList>
                                                                </Menu>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    )}
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </Tabs>
                </>
            )}

            {/* Remove Student Confirmation */}
            <AlertDialog
                isOpen={removeConfirmation.isOpen}
                leastDestructiveRef={React.useRef()}
                onClose={removeConfirmation.onClose}
            >
                <AlertDialog.Overlay>
                    <AlertDialog.Content>
                        <AlertDialog.Header fontSize="lg" fontWeight="bold">
                            Remove Student
                        </AlertDialog.Header>

                        <AlertDialog.Body>
                            <VStack align="start" spacing={4}>
                                <HStack>
                                    <Icon as={FaExclamationTriangle} color="red.500" />
                                    <Text>
                                        Are you sure you want to remove <b>{selectedStudent?.name}</b> from this course?
                                    </Text>
                                </HStack>
                                <Text fontSize="sm">
                                    This will revoke their access to course materials, and they will no longer appear in your student list.
                                    This action cannot be undone.
                                </Text>
                            </VStack>
                        </AlertDialog.Body>

                        <AlertDialog.Footer>
                            <Button onClick={removeConfirmation.onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleRemoveStudent}
                                ml={3}
                                isLoading={removeMutation.isLoading}
                            >
                                Remove
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog.Overlay>
            </AlertDialog>

            {/* Student Details Drawer */}
            <Drawer
                isOpen={studentDetails.isOpen}
                placement="right"
                onClose={studentDetails.onClose}
                size="md"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Student Details</DrawerHeader>

                    <DrawerBody>
                        {selectedStudent && (
                            <VStack spacing={6} align="stretch">
                                <Flex align="center" mb={4}>
                                    <Avatar
                                        size="xl"
                                        name={selectedStudent.name}
                                        src={selectedStudent.profileImage}
                                        mr={4}
                                    />
                                    <Box>
                                        <Heading size="md">{selectedStudent.name}</Heading>
                                        <Text color="gray.600">{selectedStudent.email}</Text>
                                    </Box>
                                </Flex>

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Course Progress</Text>
                                    <Box mb={4}>
                                        <Flex justify="space-between" mb={1}>
                                            <Text fontSize="sm">{selectedStudent.progress}% completed</Text>
                                        </Flex>
                                        <Progress
                                            value={selectedStudent.progress}
                                            size="sm"
                                            colorScheme={
                                                selectedStudent.progress === 100 ? "green" :
                                                    selectedStudent.progress > 50 ? "blue" : "orange"
                                            }
                                            borderRadius="md"
                                        />
                                    </Box>
                                </Box>

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Enrollment Details</Text>
                                    <VStack align="stretch" spacing={3} pl={4}>
                                        <Flex justify="space-between">
                                            <Text color="gray.600">Enrollment Date:</Text>
                                            <Text fontWeight="medium">
                                                {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                                            </Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text color="gray.600">Status:</Text>
                                            <Badge
                                                colorScheme={
                                                    selectedStudent.status === 'active' ? 'green' :
                                                        selectedStudent.status === 'completed' ? 'purple' : 'orange'
                                                }
                                            >
                                                {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                                            </Badge>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text color="gray.600">Last Activity:</Text>
                                            <Text>{selectedStudent.lastActive ?
                                                new Date(selectedStudent.lastActive).toLocaleDateString() :
                                                'Not available'}
                                            </Text>
                                        </Flex>
                                    </VStack>
                                </Box>

                                {selectedStudent.completedSessions && (
                                    <Box>
                                        <Text fontWeight="bold" mb={2}>Completed Sessions</Text>
                                        <VStack align="stretch" spacing={3}>
                                            {selectedStudent.completedSessions.map((session, idx) => (
                                                <Flex
                                                    key={idx}
                                                    justify="space-between"
                                                    p={3}
                                                    borderWidth="1px"
                                                    borderRadius="md"
                                                >
                                                    <Text>{session.title}</Text>
                                                    <Text fontSize="sm" color="gray.500">
                                                        {new Date(session.completedAt).toLocaleDateString()}
                                                    </Text>
                                                </Flex>
                                            ))}
                                        </VStack>
                                    </Box>
                                )}

                                {/* Actions */}
                                <Box mt={4}>
                                    <Text fontWeight="bold" mb={3}>Actions</Text>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Button
                                            colorScheme="blue"
                                            leftIcon={<FaEnvelope />}
                                            size="sm"
                                        >
                                            Message Student
                                        </Button>
                                        <Button
                                            colorScheme="red"
                                            variant="outline"
                                            leftIcon={<FaUserMinus />}
                                            size="sm"
                                            onClick={() => {
                                                studentDetails.onClose();
                                                openRemoveConfirmation(selectedStudent);
                                            }}
                                        >
                                            Remove from Course
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
};

export default StudentManagementPage;