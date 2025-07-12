import React from 'react';
import {
    Box, Container, Heading, Text, SimpleGrid,
    Stat, StatLabel, StatNumber, StatHelpText,
    Flex, Icon, Grid, GridItem, Button, Badge,
    Table, Thead, Tbody, Tr, Th, Td, Spinner, useToast,
    Tabs, TabList, Tab, TabPanels, TabPanel
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    FaUsers, FaMoneyBillWave, FaBookOpen,
    FaStar, FaChalkboardTeacher
} from 'react-icons/fa';
import { getInstructorDashboard } from '../../api/instructor';
import CourseStatusCard from '../../components/instructor/CourseStatusCard.jsx';
import UpcomingSessionsTable from '../../components/instructor/UpcomingSessionsTable';
import RevenueChart from '../../components/instructor/RevenueChart';
import StudentEnrollmentTable from '../../components/instructor/StudentEnrollmentTable';

const InstructorDashboardPage = () => {
    const toast = useToast();

    const { data, isLoading, error } = useQuery(
        'instructorDashboard',
        getInstructorDashboard,
        {
            onError: (err) => {
                toast({
                    title: 'Error loading dashboard',
                    description: err.message || 'Failed to load your dashboard data.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" thickness="4px" color="blue.500" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Container maxW="container.xl" py={8}>
                <Text color="red.500" textAlign="center">
                    There was an error loading your dashboard. Please try again later.
                </Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" mb={8}>
                <Box>
                    <Heading size="lg">Instructor Dashboard</Heading>
                    <Text color="gray.600">Welcome back, {data?.instructor?.name}</Text>
                </Box>
                <Button
                    as={RouterLink}
                    to="/instructor/courses/new"
                    colorScheme="blue"
                    leftIcon={<Icon as={FaBookOpen} />}
                >
                    Create New Course
                </Button>
            </Flex>

            {/* Stats Overview */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="blue.50" borderRadius="md" mr={4}>
                            <Icon as={FaUsers} boxSize={6} color="blue.500" />
                        </Box>
                        <Box>
                            <StatLabel>Total Students</StatLabel>
                            <StatNumber>{data?.stats?.totalStudents || 0}</StatNumber>
                            <StatHelpText>
                                {data?.stats?.newStudentsThisMonth > 0 && `+${data?.stats?.newStudentsThisMonth} this month`}
                            </StatHelpText>
                        </Box>
                    </Flex>
                </Stat>

                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="green.50" borderRadius="md" mr={4}>
                            <Icon as={FaMoneyBillWave} boxSize={6} color="green.500" />
                        </Box>
                        <Box>
                            <StatLabel>Total Revenue</StatLabel>
                            <StatNumber>${data?.stats?.totalRevenue?.toFixed(2) || '0.00'}</StatNumber>
                            <StatHelpText>
                                {data?.stats?.revenueThisMonth > 0 && `$${data?.stats?.revenueThisMonth.toFixed(2)} this month`}
                            </StatHelpText>
                        </Box>
                    </Flex>
                </Stat>

                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="purple.50" borderRadius="md" mr={4}>
                            <Icon as={FaBookOpen} boxSize={6} color="purple.500" />
                        </Box>
                        <Box>
                            <StatLabel>Active Courses</StatLabel>
                            <StatNumber>{data?.stats?.activeCourses || 0}</StatNumber>
                            <StatHelpText>of {data?.stats?.totalCourses || 0} total</StatHelpText>
                        </Box>
                    </Flex>
                </Stat>

                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="orange.50" borderRadius="md" mr={4}>
                            <Icon as={FaStar} boxSize={6} color="orange.500" />
                        </Box>
                        <Box>
                            <StatLabel>Average Rating</StatLabel>
                            <StatNumber>{data?.stats?.averageRating?.toFixed(1) || '0.0'}</StatNumber>
                            <StatHelpText>{data?.stats?.totalReviews || 0} reviews</StatHelpText>
                        </Box>
                    </Flex>
                </Stat>
            </SimpleGrid>

            {/* Main Dashboard Content */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                <GridItem>
                    {/* Course Status Cards */}
                    <Box mb={8}>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md">My Courses</Heading>
                            <Button as={RouterLink} to="/instructor/courses" size="sm" variant="outline">
                                Manage All Courses
                            </Button>
                        </Flex>

                        {data?.courses?.length === 0 ? (
                            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
                                <Text mb={4}>You haven't created any courses yet.</Text>
                                <Button
                                    as={RouterLink}
                                    to="/instructor/courses/new"
                                    colorScheme="blue"
                                >
                                    Create Your First Course
                                </Button>
                            </Box>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                {data?.courses?.slice(0, 4).map(course => (
                                    <CourseStatusCard key={course._id} course={course} />
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>

                    {/* Revenue Chart */}
                    <Box mb={8} p={6} borderWidth="1px" borderRadius="lg">
                        <Heading size="md" mb={6}>Revenue Overview</Heading>
                        <RevenueChart data={data?.revenueData} />
                    </Box>

                    {/* Recent Enrollments */}
                    <Box mb={8}>
                        <Heading size="md" mb={4}>Recent Enrollments</Heading>
                        {data?.recentEnrollments?.length === 0 ? (
                            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
                                <Text>No recent enrollments.</Text>
                            </Box>
                        ) : (
                            <StudentEnrollmentTable enrollments={data?.recentEnrollments} />
                        )}
                    </Box>
                </GridItem>

                <GridItem>
                    {/* Upcoming Sessions */}
                    <Box p={6} borderWidth="1px" borderRadius="lg" mb={8}>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md">Upcoming Sessions</Heading>
                            <Button
                                as={RouterLink}
                                to="/instructor/sessions"
                                size="sm"
                                variant="outline"
                            >
                                View All
                            </Button>
                        </Flex>

                        {data?.upcomingSessions?.length === 0 ? (
                            <Text textAlign="center">No upcoming sessions scheduled.</Text>
                        ) : (
                            <UpcomingSessionsTable sessions={data?.upcomingSessions} />
                        )}
                    </Box>

                    {/* Recent Reviews */}
                    <Box p={6} borderWidth="1px" borderRadius="lg">
                        <Heading size="md" mb={4}>Recent Reviews</Heading>

                        {data?.recentReviews?.length === 0 ? (
                            <Text textAlign="center">No reviews yet.</Text>
                        ) : (
                            <Box>
                                {data?.recentReviews?.map((review) => (
                                    <Box
                                        key={review._id}
                                        p={3}
                                        mb={3}
                                        borderWidth="1px"
                                        borderRadius="md"
                                    >
                                        <Flex justify="space-between" mb={2}>
                                            <Text fontWeight="bold">{review.student.name}</Text>
                                            <Flex>
                                                {[...Array(5)].map((_, i) => (
                                                    <Icon
                                                        key={i}
                                                        as={FaStar}
                                                        color={i < review.rating ? "yellow.400" : "gray.300"}
                                                    />
                                                ))}
                                            </Flex>
                                        </Flex>
                                        <Text fontSize="sm" mb={2}>{review.comment}</Text>
                                        <Flex justify="space-between" fontSize="xs" color="gray.500">
                                            <Text>{new Date(review.createdAt).toLocaleDateString()}</Text>
                                            <Text>Course: {review.course.title}</Text>
                                        </Flex>
                                    </Box>
                                ))}

                                <Button
                                    as={RouterLink}
                                    to="/instructor/reviews"
                                    size="sm"
                                    width="full"
                                    mt={3}
                                    variant="outline"
                                >
                                    View All Reviews
                                </Button>
                            </Box>
                        )}
                    </Box>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default InstructorDashboardPage;