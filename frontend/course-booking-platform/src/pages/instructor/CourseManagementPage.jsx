import React, { useState } from 'react';
import {
    Box, Container, Heading, Text, Button, HStack, VStack,
    Tabs, TabList, Tab, TabPanels, TabPanel, useDisclosure,
    Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton,
    Menu, MenuButton, MenuList, MenuItem, Spinner, useToast,
    Alert, AlertIcon, SimpleGrid, Input, Select, FormControl,
    FormLabel
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FaEdit, FaTrash, FaEye, FaEllipsisV, FaPlus, FaSearch,
    FaCalendarAlt, FaUsers, FaFilePdf
} from 'react-icons/fa';
import { getInstructorCourses, updateCourseStatus, deleteCourse } from '../../api/instructor';
import CourseStatusCard from '../../components/instructor/CourseStatusCard.jsx';
import DeleteConfirmationModal from '../../components/shared/DeleteConfirmationModal';

const CourseManagementPage = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ search: '', status: 'all' });
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data, isLoading, error } = useQuery(
        ['instructorCourses', filters],
        () => getInstructorCourses(filters),
        {
            onError: () => {
                toast({
                    title: "Error loading courses",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    const updateStatusMutation = useMutation(updateCourseStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries('instructorCourses');
            toast({
                title: "Status updated",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        },
        onError: () => {
            toast({
                title: "Failed to update status",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    });

    const deleteMutation = useMutation(deleteCourse, {
        onSuccess: () => {
            queryClient.invalidateQueries('instructorCourses');
            toast({
                title: "Course deleted",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
        },
        onError: () => {
            toast({
                title: "Failed to delete course",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    });

    const handleStatusChange = (courseId, isActive) => {
        updateStatusMutation.mutate({ courseId, isActive });
    };

    const handleDelete = () => {
        if (selectedCourse) {
            deleteMutation.mutate(selectedCourse._id);
        }
    };

    const confirmDelete = (course) => {
        setSelectedCourse(course);
        onOpen();
    };

    if (isLoading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                An error occurred while loading your courses.
            </Alert>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>Course Management</Heading>
                <Text color="gray.600">Create, edit, and manage your courses</Text>
            </Box>

            <HStack mb={6} justifyContent="space-between">
                <Button
                    as={RouterLink}
                    to="/instructor/courses/new"
                    colorScheme="blue"
                    leftIcon={<FaPlus />}
                >
                    Create New Course
                </Button>

                <HStack>
                    <FormControl w="auto">
                        <Input
                            placeholder="Search courses..."
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            rightIcon={<FaSearch />}
                        />
                    </FormControl>

                    <Select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        w="auto"
                    >
                        <option value="all">All Courses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                    </Select>
                </HStack>
            </HStack>

            <Tabs colorScheme="blue">
                <TabList>
                    <Tab>Grid View</Tab>
                    <Tab>Table View</Tab>
                </TabList>

                <TabPanels>
                    {/* Grid View */}
                    <TabPanel>
                        {data.courses.length === 0 ? (
                            <Box textAlign="center" p={10} borderWidth="1px" borderRadius="lg">
                                <Heading size="md" mb={4}>No courses found</Heading>
                                <Text mb={6}>Start creating your first course now!</Text>
                                <Button
                                    as={RouterLink}
                                    to="/instructor/courses/new"
                                    colorScheme="blue"
                                    leftIcon={<FaPlus />}
                                >
                                    Create Course
                                </Button>
                            </Box>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                {data.courses.map(course => (
                                    <CourseStatusCard
                                        key={course._id}
                                        course={course}
                                        onEdit={() => navigate(`/instructor/courses/edit/${course._id}`)}
                                        onDelete={() => confirmDelete(course)}
                                        onStatusChange={() => handleStatusChange(course._id, !course.isActive)}
                                        onView={() => navigate(`/courses/${course._id}`)}
                                        onManageSessions={() => navigate(`/instructor/courses/${course._id}/sessions`)}
                                        onManageStudents={() => navigate(`/instructor/courses/${course._id}/students`)}
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    </TabPanel>

                    {/* Table View */}
                    <TabPanel>
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Title</Th>
                                        <Th>Category</Th>
                                        <Th>Price</Th>
                                        <Th>Enrollments</Th>
                                        <Th>Status</Th>
                                        <Th>Rating</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.courses.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={7} textAlign="center">No courses found</Td>
                                        </Tr>
                                    ) : (
                                        data.courses.map(course => (
                                            <Tr key={course._id}>
                                                <Td fontWeight="medium">{course.title}</Td>
                                                <Td>{course.category}</Td>
                                                <Td>${course.price.toFixed(2)}</Td>
                                                <Td>{course.enrolledStudents?.length || 0}/{course.capacity}</Td>
                                                <Td>
                                                    <Badge colorScheme={course.isActive ? 'green' : 'red'}>
                                                        {course.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </Td>
                                                <Td>{course.averageRating?.toFixed(1) || 'N/A'}</Td>
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
                                                                onClick={() => navigate(`/courses/${course._id}`)}
                                                            >
                                                                Preview
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FaEdit />}
                                                                onClick={() => navigate(`/instructor/courses/edit/${course._id}`)}
                                                            >
                                                                Edit Course
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FaCalendarAlt />}
                                                                onClick={() => navigate(`/instructor/courses/${course._id}/sessions`)}
                                                            >
                                                                Manage Sessions
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FaUsers />}
                                                                onClick={() => navigate(`/instructor/courses/${course._id}/students`)}
                                                            >
                                                                Manage Students
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FaFilePdf />}
                                                                onClick={() => navigate(`/instructor/courses/${course._id}/materials`)}
                                                            >
                                                                Course Materials
                                                            </MenuItem>
                                                            <MenuItem
                                                                icon={<FaTrash />}
                                                                onClick={() => confirmDelete(course)}
                                                                color="red.500"
                                                            >
                                                                Delete Course
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                            </Tr>
                                        ))
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleDelete}
                title="Delete Course"
                message={`Are you sure you want to delete "${selectedCourse?.title}"? This action cannot be undone.`}
                isLoading={deleteMutation.isLoading}
            />
        </Container>
    );
};

export default CourseManagementPage;