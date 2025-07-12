import React from 'react';
import {
    Box, Container, Heading, Text, SimpleGrid,
    Stat, StatLabel, StatNumber, StatHelpText,
    Flex, Icon, Grid, GridItem, Badge, Button,
    Spinner, useToast
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { FaBook, FaCalendarCheck, FaCertificate, FaClock } from 'react-icons/fa';
import { getStudentDashboard } from '../../api/student';
import EnrolledCourseCard from '../../components/student/EnrolledCourseCard';
import UpcomingSessionsCard from '../../components/student/UpcomingSessionsCard';
import RecentCertificatesCard from '../../components/student/RecentCertificatesCard';
import ActivityFeed from '../../components/shared/ActivityFeed';

const StudentDashboardPage = () => {
    const toast = useToast();

    const { data, isLoading, error } = useQuery(
        'studentDashboard',
        getStudentDashboard,
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
                    <Heading size="lg">Student Dashboard</Heading>
                    <Text color="gray.600">Welcome back, {data?.user?.name}</Text>
                </Box>
                <Button as={RouterLink} to="/courses" colorScheme="blue">
                    Browse Courses
                </Button>
            </Flex>

            {/* Stats Overview */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="blue.50" borderRadius="md" mr={4}>
                            <Icon as={FaBook} boxSize={6} color="blue.500" />
                        </Box>
                        <Box>
                            <StatLabel>Enrolled Courses</StatLabel>
                            <StatNumber>{data?.stats?.enrolledCourses || 0}</StatNumber>
                        </Box>
                    </Flex>
                </Stat>

                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="green.50" borderRadius="md" mr={4}>
                            <Icon as={FaCalendarCheck} boxSize={6} color="green.500" />
                        </Box>
                        <Box>
                            <StatLabel>Completed Sessions</StatLabel>
                            <StatNumber>{data?.stats?.completedSessions || 0}</StatNumber>
                            <StatHelpText>This month</StatHelpText>
                        </Box>
                    </Flex>
                </Stat>

                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="purple.50" borderRadius="md" mr={4}>
                            <Icon as={FaCertificate} boxSize={6} color="purple.500" />
                        </Box>
                        <Box>
                            <StatLabel>Certificates</StatLabel>
                            <StatNumber>{data?.stats?.certificatesEarned || 0}</StatNumber>
                        </Box>
                    </Flex>
                </Stat>

                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="orange.50" borderRadius="md" mr={4}>
                            <Icon as={FaClock} boxSize={6} color="orange.500" />
                        </Box>
                        <Box>
                            <StatLabel>Learning Hours</StatLabel>
                            <StatNumber>{data?.stats?.totalLearningHours || 0}</StatNumber>
                            <StatHelpText>Total hours</StatHelpText>
                        </Box>
                    </Flex>
                </Stat>
            </SimpleGrid>

            {/* Main Dashboard Content */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                <GridItem>
                    {/* In Progress Courses */}
                    <Box mb={8}>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md">My Courses</Heading>
                            <Button as={RouterLink} to="/dashboard/my-courses" size="sm" variant="outline">
                                View All
                            </Button>
                        </Flex>

                        {data?.enrolledCourses?.length === 0 ? (
                            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
                                <Text mb={4}>You're not enrolled in any courses yet.</Text>
                                <Button as={RouterLink} to="/courses" colorScheme="blue">
                                    Browse Courses
                                </Button>
                            </Box>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                {data?.enrolledCourses?.slice(0, 4).map(course => (
                                    <EnrolledCourseCard key={course._id} course={course} />
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>

                    {/* Upcoming Sessions */}
                    <Box mb={8}>
                        <Heading size="md" mb={4}>Upcoming Sessions</Heading>
                        {data?.upcomingSessions?.length === 0 ? (
                            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
                                <Text>No upcoming sessions scheduled.</Text>
                            </Box>
                        ) : (
                            <UpcomingSessionsCard sessions={data?.upcomingSessions} />
                        )}
                    </Box>

                    {/* Recent Certificates */}
                    <Box>
                        <Flex justify="space-between" align="center" mb={4}>
                            <Heading size="md">My Certificates</Heading>
                            <Button as={RouterLink} to="/dashboard/certificates" size="sm" variant="outline">
                                View All
                            </Button>
                        </Flex>
                        {data?.certificates?.length === 0 ? (
                            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
                                <Text>You haven't earned any certificates yet.</Text>
                            </Box>
                        ) : (
                            <RecentCertificatesCard certificates={data?.certificates} />
                        )}
                    </Box>
                </GridItem>

                <GridItem>
                    {/* Activity Feed */}
                    <Box p={6} borderWidth="1px" borderRadius="lg">
                        <Heading size="md" mb={4}>Recent Activity</Heading>
                        {data?.activities?.length === 0 ? (
                            <Text textAlign="center">No recent activities.</Text>
                        ) : (
                            <ActivityFeed activities={data?.activities} />
                        )}
                    </Box>

                    {/* Recommended Courses */}
                    <Box mt={8} p={6} borderWidth="1px" borderRadius="lg">
                        <Heading size="md" mb={4}>Recommended For You</Heading>
                        {data?.recommendedCourses?.map(course => (
                            <Box
                                key={course._id}
                                p={3}
                                mb={3}
                                borderWidth="1px"
                                borderRadius="md"
                                _hover={{ bg: "gray.50" }}
                            >
                                <Flex justify="space-between" align="center">
                                    <Box>
                                        <Text fontWeight="bold" noOfLines={1}>{course.title}</Text>
                                        <Badge colorScheme="blue" mt={1}>{course.category}</Badge>
                                    </Box>
                                    <Button
                                        as={RouterLink}
                                        to={`/courses/${course._id}`}
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        View
                                    </Button>
                                </Flex>
                            </Box>
                        ))}
                    </Box>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default StudentDashboardPage;