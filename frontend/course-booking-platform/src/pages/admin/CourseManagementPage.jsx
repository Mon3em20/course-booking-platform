import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    HStack,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Image,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Flex,
    FormControl,
    FormLabel,
    Textarea,
    Divider,
    Tag,
    Card,
    CardBody,
} from '@chakra-ui/react';
import {
    FaSearch,
    FaEllipsisV,
    FaEdit,
    FaTrash,
    FaEye,
    FaCheck,
    FaTimes,
    FaStar,
    FaUsers,
    FaDollarSign,
    FaChartLine,
} from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCourses, approveCourse, rejectCourse, deleteCourse } from '../../api/admin';
import { Link as RouterLink } from 'react-router-dom';

const CourseManagementPage = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const courseDetailsModal = useDisclosure();
    const rejectModal = useDisclosure();
    const deleteModal = useDisclosure();
    const [rejectionReason, setRejectionReason] = useState('');

    // Get all courses
    const { data, isLoading, error } = useQuery(
        'adminCourses',
        getAllCourses,
        {
            onError: () => {
                toast({
                    title: 'Error loading courses',
                    description: 'Failed to load courses data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Approve course mutation
    const approveMutation = useMutation(
        (courseId) => approveCourse(courseId),
        {
            onSuccess: () => {
                toast({
                    title: 'Course approved',
                    description: 'The course has been approved and is now live',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('adminCourses');
            },
            onError: (error) => {
                toast({
                    title: 'Error approving course',
                    description: error.message || 'Failed to approve course',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Reject course mutation
    const rejectMutation = useMutation(
        ({ courseId, reason }) => rejectCourse(courseId, reason),
        {
            onSuccess: () => {
                toast({
                    title: 'Course rejected',
                    description: 'The course has been rejected',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('adminCourses');
                rejectModal.onClose();
                setRejectionReason('');
            },
            onError: (error) => {
                toast({
                    title: 'Error rejecting course',
                    description: error.message || 'Failed to reject course',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Delete course mutation
    const deleteMutation = useMutation(
        (courseId) => deleteCourse(courseId),
        {
            onSuccess: () => {
                toast({
                    title: 'Course deleted',
                    description: 'The course has been deleted permanently',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('adminCourses');
                deleteModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error deleting course',
                    description: error.message || 'Failed to delete course',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Filter courses
    const getFilteredCourses = () => {
        if (!data?.courses) return [];

        return data.courses.filter(course => {
            const matchesSearch = searchQuery === '' ||
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (course.instructor?.name && course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = filterStatus === 'all' || course.status === filterStatus;

            const matchesCategory = filterCategory === 'all' || course.category === filterCategory;

            return matchesSearch && matchesStatus && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'price_high') {
                return b.price - a.price;
            } else if (sortBy === 'price_low') {
                return a.price - b.price;
            } else if (sortBy === 'popular') {
                return b.enrolledCount - a.enrolledCount;
            } else if (sortBy === 'rating') {
                return b.rating - a.rating;
            }
            return 0;
        });
    };

    const filteredCourses = getFilteredCourses();

    // Open course details modal
    const openCourseDetails = (course) => {
        setSelectedCourse(course);
        courseDetailsModal.onOpen();
    };

    // Open reject course modal
    const openRejectModal = (course) => {
        setSelectedCourse(course);
        setRejectionReason('');
        rejectModal.onOpen();
    };

    // Open delete course modal
    const openDeleteModal = (course) => {
        setSelectedCourse(course);
        deleteModal.onOpen();
    };

    // Handle course approval
    const handleApproveCourse = (courseId) => {
        approveMutation.mutate(courseId);
    };

    // Handle course rejection
    const handleRejectCourse = () => {
        if (!selectedCourse || !rejectionReason.trim()) return;

        rejectMutation.mutate({
            courseId: selectedCourse._id,
            reason: rejectionReason
        });
    };

    // Handle course deletion
    const handleDeleteCourse = () => {
        if (!selectedCourse) return;
        deleteMutation.mutate(selectedCourse._id);
    };

    // Get badge color based on status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'published':
                return 'green';
            case 'pending':
                return 'orange';
            case 'rejected':
                return 'red';
            case 'draft':
                return 'gray';
            default:
                return 'blue';
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

    // Get course counts by status
    const pendingCount = data?.courses?.filter(course => course.status === 'pending').length || 0;
    const publishedCount = data?.courses?.filter(course => course.status === 'published').length || 0;
    const rejectedCount = data?.courses?.filter(course => course.status === 'rejected').length || 0;
    const draftCount = data?.courses?.filter(course => course.status === 'draft').length || 0;

    // Get categories from courses
    const getCategories = () => {
        if (!data?.courses) return [];

        const categoriesSet = new Set();
        data.courses.forEach(course => {
            if (course.category) categoriesSet.add(course.category);
        });

        return Array.from(categoriesSet);
    };

    const categories = getCategories();

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading courses...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>Course Management</Heading>
                <Text color="gray.600">View, approve, and manage all courses in the system</Text>
            </Box>

            {/* Course Statistics */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Total Courses</StatLabel>
                    <StatNumber>{data?.courses?.length || 0}</StatNumber>
                    <HStack justify="center" mt={2}>
                        <FaChartLine />
                        <StatHelpText mb={0}>All courses</StatHelpText>
                    </HStack>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Published</StatLabel>
                    <StatNumber>{publishedCount}</StatNumber>
                    <Badge colorScheme="green">Live</Badge>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Pending Approval</StatLabel>
                    <StatNumber>{pendingCount}</StatNumber>
                    <Badge colorScheme="orange">Needs Review</Badge>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Total Revenue</StatLabel>
                    <StatNumber>${data?.totalRevenue?.toLocaleString() || '0'}</StatNumber>
                    <HStack justify="center" mt={2}>
                        <FaDollarSign />
                        <StatHelpText mb={0}>All time</StatHelpText>
                    </HStack>
                </Stat>
            </SimpleGrid>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading courses. Please try again later.</Text>
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
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>

                        <HStack spacing={3}>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                                <option value="draft">Draft</option>
                            </Select>

                            <Select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </Select>

                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                            </Select>
                        </HStack>
                    </Flex>

                    {/* Courses Tabs */}
                    <Tabs colorScheme="blue" isLazy>
                        <TabList overflowX="auto" whiteSpace="nowrap">
                            <Tab>All Courses ({data?.courses?.length || 0})</Tab>
                            <Tab>Pending ({pendingCount})</Tab>
                            <Tab>Published ({publishedCount})</Tab>
                            <Tab>Rejected ({rejectedCount})</Tab>
                            <Tab>Draft ({draftCount})</Tab>
                        </TabList>

                        <TabPanels>
                            {/* All Courses Tab */}
                            <TabPanel px={0}>
                                {renderCourseTable(filteredCourses)}
                            </TabPanel>

                            {/* Pending Courses Tab */}
                            <TabPanel px={0}>
                                {renderCourseTable(data?.courses?.filter(course => course.status === 'pending') || [])}
                            </TabPanel>

                            {/* Published Courses Tab */}
                            <TabPanel px={0}>
                                {renderCourseTable(data?.courses?.filter(course => course.status === 'published') || [])}
                            </TabPanel>

                            {/* Rejected Courses Tab */}
                            <TabPanel px={0}>
                                {renderCourseTable(data?.courses?.filter(course => course.status === 'rejected') || [])}
                            </TabPanel>

                            {/* Draft Courses Tab */}
                            <TabPanel px={0}>
                                {renderCourseTable(data?.courses?.filter(course => course.status === 'draft') || [])}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </>
            )}

            {/* Course Details Modal */}
            <Modal isOpen={courseDetailsModal.isOpen} onClose={courseDetailsModal.onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Course Details</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        {selectedCourse && (
                            <VStack spacing={6} align="stretch">
                                <Box position="relative">
                                    <Image
                                        src={selectedCourse.imageUrl || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b'}
                                        alt={selectedCourse.title}
                                        borderRadius="md"
                                        height="200px"
                                        width="100%"
                                        objectFit="cover"
                                    />
                                    <Badge
                                        position="absolute"
                                        top={3}
                                        right={3}
                                        px={2}
                                        py={1}
                                        colorScheme={getStatusBadgeColor(selectedCourse.status)}
                                    >
                                        {selectedCourse.status.charAt(0).toUpperCase() + selectedCourse.status.slice(1)}
                                    </Badge>
                                </Box>

                                <Heading size="lg">{selectedCourse.title}</Heading>

                                <HStack>
                                    <Avatar size="sm" name={selectedCourse.instructor?.name} src={selectedCourse.instructor?.profileImage} />
                                    <Text>{selectedCourse.instructor?.name}</Text>
                                </HStack>

                                <Text>{selectedCourse.description}</Text>

                                <HStack wrap="wrap" spacing={4}>
                                    <Badge colorScheme="purple">{selectedCourse.category}</Badge>
                                    <Badge colorScheme="blue">{selectedCourse.level}</Badge>
                                    <Badge colorScheme="green">${selectedCourse.price.toFixed(2)}</Badge>
                                </HStack>

                                <SimpleGrid columns={3} spacing={4}>
                                    <Card>
                                        <CardBody textAlign="center">
                                            <Heading size="md">{selectedCourse.enrolledCount || 0}</Heading>
                                            <Text fontSize="sm" color="gray.500">Students</Text>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody textAlign="center">
                                            <Heading size="md">{selectedCourse.rating?.toFixed(1) || 'N/A'}</Heading>
                                            <Text fontSize="sm" color="gray.500">Rating</Text>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody textAlign="center">
                                            <Heading size="md">{selectedCourse.reviewCount || 0}</Heading>
                                            <Text fontSize="sm" color="gray.500">Reviews</Text>
                                        </CardBody>
                                    </Card>
                                </SimpleGrid>

                                {selectedCourse.status === 'rejected' && selectedCourse.rejectionReason && (
                                    <Alert status="error" borderRadius="md">
                                        <AlertIcon />
                                        <Box>
                                            <Text fontWeight="bold">Rejection Reason:</Text>
                                            <Text>{selectedCourse.rejectionReason}</Text>
                                        </Box>
                                    </Alert>
                                )}

                                <Divider />

                                <Box>
                                    <Text fontWeight="bold" mb={2}>Course Details</Text>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Box>
                                            <Text color="gray.600">Created Date:</Text>
                                            <Text>{formatDate(selectedCourse.createdAt)}</Text>
                                        </Box>
                                        <Box>
                                            <Text color="gray.600">Last Updated:</Text>
                                            <Text>{formatDate(selectedCourse.updatedAt)}</Text>
                                        </Box>
                                        <Box>
                                            <Text color="gray.600">Duration:</Text>
                                            <Text>{selectedCourse.duration} hours</Text>
                                        </Box>
                                        <Box>
                                            <Text color="gray.600">Lectures:</Text>
                                            <Text>{selectedCourse.lectures || 0}</Text>
                                        </Box>
                                    </SimpleGrid>
                                </Box>

                                {selectedCourse.status === 'pending' && (
                                    <HStack spacing={4}>
                                        <Button
                                            colorScheme="green"
                                            leftIcon={<FaCheck />}
                                            onClick={() => {
                                                courseDetailsModal.onClose();
                                                handleApproveCourse(selectedCourse._id);
                                            }}
                                            flex="1"
                                        >
                                            Approve Course
                                        </Button>

                                        <Button
                                            colorScheme="red"
                                            leftIcon={<FaTimes />}
                                            onClick={() => {
                                                courseDetailsModal.onClose();
                                                openRejectModal(selectedCourse);
                                            }}
                                            flex="1"
                                        >
                                            Reject Course
                                        </Button>
                                    </HStack>
                                )}
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            as={RouterLink}
                            to={`/courses/${selectedCourse?._id}`}
                            colorScheme="blue"
                            mr={3}
                        >
                            View Public Page
                        </Button>
                        <Button onClick={courseDetailsModal.onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Reject Course Modal */}
            <Modal isOpen={rejectModal.isOpen} onClose={rejectModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reject Course</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text mb={4}>
                            You are about to reject the course <strong>{selectedCourse?.title}</strong>. Please provide a reason for the rejection:
                        </Text>

                        <FormControl isRequired>
                            <FormLabel>Rejection Reason</FormLabel>
                            <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why the course is being rejected"
                                rows={5}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={rejectModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleRejectCourse}
                            isDisabled={!rejectionReason.trim()}
                            isLoading={rejectMutation.isLoading}
                            loadingText="Rejecting"
                        >
                            Reject Course
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Course Modal */}
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Course</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text>
                            Are you sure you want to delete the course <strong>{selectedCourse?.title}</strong>? This action cannot be undone.
                        </Text>
                        <Alert status="warning" mt={4}>
                            <AlertIcon />
                            <Text fontSize="sm">
                                Deleting this course will remove all associated data, including student enrollments, reviews, and course materials. Students who have enrolled may lose access to course content.
                            </Text>
                        </Alert>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={deleteModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleDeleteCourse}
                            isLoading={deleteMutation.isLoading}
                            loadingText="Deleting"
                        >
                            Delete Course
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );

    // Helper function to render course table
    function renderCourseTable(courses) {
        if (!courses.length) {
            return (
                <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                    <Text>No courses found.</Text>
                </Box>
            );
        }

        return (
            <Box overflowX="auto">
                <Table variant="simple" borderWidth="1px" borderRadius="lg">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Course</Th>
                            <Th>Instructor</Th>
                            <Th>Price</Th>
                            <Th>Category</Th>
                            <Th>Status</Th>
                            <Th>Created Date</Th>
                            <Th width="100px">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {courses.map((course) => (
                            <Tr key={course._id}>
                                <Td>
                                    <HStack>
                                        <Image
                                            src={course.imageUrl || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b'}
                                            alt={course.title}
                                            boxSize="40px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <Text fontWeight="medium">{course.title}</Text>
                                    </HStack>
                                </Td>
                                <Td>
                                    <HStack>
                                        <Avatar size="xs" name={course.instructor?.name} src={course.instructor?.profileImage} />
                                        <Text>{course.instructor?.name}</Text>
                                    </HStack>
                                </Td>
                                <Td>${course.price.toFixed(2)}</Td>
                                <Td>
                                    <Badge colorScheme="purple">{course.category}</Badge>
                                </Td>
                                <Td>
                                    <Badge colorScheme={getStatusBadgeColor(course.status)}>
                                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                    </Badge>
                                </Td>
                                <Td>{formatDate(course.createdAt)}</Td>
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
                                                onClick={() => openCourseDetails(course)}
                                            >
                                                View Details
                                            </MenuItem>
                                            {course.status === 'pending' && (
                                                <>
                                                    <MenuItem
                                                        icon={<FaCheck />}
                                                        onClick={() => handleApproveCourse(course._id)}
                                                        color="green.500"
                                                    >
                                                        Approve
                                                    </MenuItem>
                                                    <MenuItem
                                                        icon={<FaTimes />}
                                                        onClick={() => openRejectModal(course)}
                                                        color="red.500"
                                                    >
                                                        Reject
                                                    </MenuItem>
                                                </>
                                            )}
                                            <MenuItem
                                                icon={<FaTrash />}
                                                color="red.500"
                                                onClick={() => openDeleteModal(course)}
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

export default CourseManagementPage;