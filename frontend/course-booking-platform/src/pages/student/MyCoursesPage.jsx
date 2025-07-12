import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    HStack,
    VStack,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    Flex,
    useToast,
} from '@chakra-ui/react';
import { FaSearch, FaSort } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getEnrolledCourses } from '../../api/student';
import EnrolledCourseCard from '../../components/student/EnrolledCourseCard';
import { Link as RouterLink } from 'react-router-dom';

const MyCoursesPage = () => {
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [filterStatus, setFilterStatus] = useState('all');

    const { data, isLoading, error } = useQuery(
        'enrolledCourses',
        getEnrolledCourses,
        {
            onError: (error) => {
                toast({
                    title: 'Error loading courses',
                    description: error.message || 'Failed to load your enrolled courses',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Filter and sort courses
    const getFilteredCourses = () => {
        if (!data?.courses) return [];

        let filtered = [...data.courses];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.instructor?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (filterStatus !== 'all') {
            if (filterStatus === 'completed') {
                filtered = filtered.filter(course =>
                    course.completedSessions === course.totalSessions && course.totalSessions > 0
                );
            } else if (filterStatus === 'in-progress') {
                filtered = filtered.filter(course =>
                    course.completedSessions < course.totalSessions
                );
            } else if (filterStatus === 'not-started') {
                filtered = filtered.filter(course =>
                    course.completedSessions === 0
                );
            }
        }

        // Apply sorting
        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate));
        } else if (sortBy === 'title-asc') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'title-desc') {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortBy === 'progress') {
            filtered.sort((a, b) => {
                const progressA = a.totalSessions ? a.completedSessions / a.totalSessions : 0;
                const progressB = b.totalSessions ? b.completedSessions / b.totalSessions : 0;
                return progressB - progressA;
            });
        }

        return filtered;
    };

    const filteredCourses = getFilteredCourses();

    // Separate courses based on completion status for the tabs
    const completedCourses = data?.courses?.filter(course =>
        course.completedSessions === course.totalSessions && course.totalSessions > 0
    ) || [];

    const inProgressCourses = data?.courses?.filter(course =>
        course.completedSessions < course.totalSessions && course.completedSessions > 0
    ) || [];

    const notStartedCourses = data?.courses?.filter(course =>
        course.completedSessions === 0
    ) || [];

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading your courses...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>My Courses</Heading>
                <Text color="gray.600">Manage and continue your learning journey</Text>
            </Box>

            {error ? (
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Text>Error loading your courses. Please try again later.</Text>
                </Alert>
            ) : data?.courses?.length === 0 ? (
                <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
                    <Text fontSize="lg" mb={6}>You're not enrolled in any courses yet.</Text>
                    <Button
                        as={RouterLink}
                        to="/courses"
                        colorScheme="blue"
                        size="lg"
                    >
                        Browse Available Courses
                    </Button>
                </Box>
            ) : (
                <>
                    {/* Filters and Search */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        mb={6}
                        gap={4}
                        align={{ md: "center" }}
                        justify="space-between"
                    >
                        <InputGroup maxW={{ md: "320px" }}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FaSearch} color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search your courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>

                        <HStack spacing={4}>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                icon={<FaSort />}
                                w="auto"
                            >
                                <option value="recent">Recently Enrolled</option>
                                <option value="title-asc">Title: A-Z</option>
                                <option value="title-desc">Title: Z-A</option>
                                <option value="progress">Progress</option>
                            </Select>

                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                w="auto"
                            >
                                <option value="all">All Courses</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="not-started">Not Started</option>
                            </Select>
                        </HStack>
                    </Flex>

                    {/* Filtered Courses Display */}
                    {searchQuery || filterStatus !== 'all' || sortBy !== 'recent' ? (
                        <>
                            <Heading size="md" mb={4}>
                                Search Results
                                <Text as="span" fontWeight="normal" ml={2} color="gray.500">
                                    ({filteredCourses.length} courses)
                                </Text>
                            </Heading>

                            {filteredCourses.length === 0 ? (
                                <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                                    <Text>No courses match your search criteria.</Text>
                                </Box>
                            ) : (
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={10}>
                                    {filteredCourses.map(course => (
                                        <EnrolledCourseCard key={course._id} course={course} />
                                    ))}
                                </SimpleGrid>
                            )}
                        </>
                    ) : (
                        /* Tabbed view for normal browsing */
                        <Tabs colorScheme="blue" isLazy>
                            <TabList overflowX="auto" py={2}>
                                <Tab>All Courses ({data?.courses?.length || 0})</Tab>
                                <Tab>In Progress ({inProgressCourses.length})</Tab>
                                <Tab>Completed ({completedCourses.length})</Tab>
                                <Tab>Not Started ({notStartedCourses.length})</Tab>
                            </TabList>

                            <TabPanels>
                                {/* All Courses */}
                                <TabPanel px={0}>
                                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                        {data?.courses?.map(course => (
                                            <EnrolledCourseCard key={course._id} course={course} />
                                        ))}
                                    </SimpleGrid>
                                </TabPanel>

                                {/* In Progress */}
                                <TabPanel px={0}>
                                    {inProgressCourses.length === 0 ? (
                                        <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                                            <Text>You don't have any courses in progress.</Text>
                                        </Box>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                            {inProgressCourses.map(course => (
                                                <EnrolledCourseCard key={course._id} course={course} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </TabPanel>

                                {/* Completed */}
                                <TabPanel px={0}>
                                    {completedCourses.length === 0 ? (
                                        <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                                            <Text>You haven't completed any courses yet. Keep learning!</Text>
                                        </Box>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                            {completedCourses.map(course => (
                                                <EnrolledCourseCard key={course._id} course={course} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </TabPanel>

                                {/* Not Started */}
                                <TabPanel px={0}>
                                    {notStartedCourses.length === 0 ? (
                                        <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                                            <Text>You've started all your enrolled courses!</Text>
                                        </Box>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                            {notStartedCourses.map(course => (
                                                <EnrolledCourseCard key={course._id} course={course} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    )}
                </>
            )}
        </Container>
    );
};

export default MyCoursesPage;