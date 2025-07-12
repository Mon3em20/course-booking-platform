import React, { useState } from 'react';
import {
    Box, Container, Heading, Text, SimpleGrid,
    Stat, StatLabel, StatNumber, StatHelpText,
    Flex, Icon, Grid, GridItem, Button,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    Table, Thead, Tbody, Tr, Th, Td, Spinner,
    useToast, Badge, Select, HStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    FaUsers, FaMoneyBillWave, FaBookOpen,
    FaUserGraduate, FaChalkboardTeacher, FaUserShield,
    FaClipboardList
} from 'react-icons/fa';
import { getAdminDashboard } from '../../api/admin';
import RevenueChart from '../../components/admin/RevenueChart';
import UserStatsChart from '../../components/admin/UserStatsChart';
import CourseStatsChart from '../../components/admin/CourseStatsChart';

const AdminDashboardPage = () => {
    const toast = useToast();
    const [timeRange, setTimeRange] = useState('month');

    const { data, isLoading, error } = useQuery(
        ['adminDashboard', timeRange],
        () => getAdminDashboard(timeRange),
        {
            onError: (err) => {
                toast({
                    title: 'Error loading dashboard',
                    description: err.message || 'Failed to load dashboard data.',
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
                    There was an error loading the dashboard. Please try again later.
                </Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" mb={8}>
                <Box>
                    <Heading size="lg">Admin Dashboard</Heading>
                    <Text color="gray.600">Platform Overview</Text>
                </Box>
                <HStack>
                    <Text>Time Range:</Text>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        w="150px"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </Select>
                </HStack>
            </Flex>

            {/* Stats Overview */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex align="center">
                        <Box p={2} bg="blue.50" borderRadius="md" mr={4}>
                            <Icon as={FaUsers} boxSize={6} color="blue.500" />
                        </Box>
                        <Box>
                            <StatLabel>Total Users</StatLabel>
                            <StatNumber>{data?.stats?.totalUsers || 0}</StatNumber>
                            <StatHelpText>
                                {data?.stats?.newUsers > 0 && `+${data?.stats?.newUsers} new`}
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
                            <StatLabel>Revenue</StatLabel>
                            <StatNumber>${data?.stats?.totalRevenue?.toFixed(2) || '0.00'}</StatNumber>
                            <StatHelpText>
                                {data?.stats?.revenueChange > 0
                                    ? `↑ ${data?.stats?.revenueChange}%`
                                    : `↓ ${Math.abs(data?.stats?.revenueChange)}%`}
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
                            <Icon as={FaClipboardList} boxSize={6} color="orange.500" />
                        </Box>
                        <Box>
                            <StatLabel>Bookings</StatLabel>
                            <StatNumber>{data?.stats?.totalBookings || 0}</StatNumber>
                            <StatHelpText>
                                {data?.stats?.completedBookings || 0} completed
                            </StatHelpText>
                        </Box>
                    </Flex>
                </Stat>
            </SimpleGrid>

            {/* Charts */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8} mb={8}>
                <GridItem>
                    <Box p={6} borderWidth="1px" borderRadius="lg" h="100%">
                        <Flex justify="space-between" mb={6}>
                            <Heading size="md">Revenue Overview</Heading>
                        </Flex>
                        <RevenueChart data={data?.revenueData} />
                    </Box>
                </GridItem>

                <GridItem>
                    <Box p={6} borderWidth="1px" borderRadius="lg" h="100%">
                        <Heading size="md" mb={6}>User Distribution</Heading>
                        <UserStatsChart data={data?.userStats} />
                        <CourseStatsChart data={data?.courseStats} />

                    </Box>
                </GridItem>
            </Grid>

            {/* Tabs for different data views */}
            <Box borderWidth="1px" borderRadius="lg">
                <Tabs colorScheme="blue" isLazy>
                    <TabList px={4} pt={4}>
                        <Tab><Icon as={FaUserGraduate} mr={2} /> Students</Tab>
                        <Tab><Icon as={FaChalkboardTeacher} mr={2} /> Instructors</Tab>
                        <Tab><Icon as={FaBookOpen} mr={2} /> Courses</Tab>
                        <Tab><Icon as={FaMoneyBillWave} mr={2} /> Transactions</Tab>
                    </TabList>

                    <TabPanels>
                        {/* Students Tab */}
                        <TabPanel>
                            <Box overflowX="auto">
                                <Flex justify="space-between" mb={4}>
                                    <Heading size="md">Recent Students</Heading>
                                    <Button
                                        as={RouterLink}
                                        to="/admin/users?role=student"
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        View All Students
                                    </Button>
                                </Flex>

                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Email</Th>
                                            <Th>Enrolled Courses</Th>
                                            <Th>Joined Date</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.recentStudents?.map(student => (
                                            <Tr key={student._id}>
                                                <Td fontWeight="medium">{student.name}</Td>
                                                <Td>{student.email}</Td>
                                                <Td>{student.enrolledCoursesCount}</Td>
                                                <Td>{new Date(student.createdAt).toLocaleDateString()}</Td>
                                                <Td>
                                                    <Badge colorScheme={student.isActive ? "green" : "red"}>
                                                        {student.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>

                        {/* Instructors Tab */}
                        <TabPanel>
                            <Box overflowX="auto">
                                <Flex justify="space-between" mb={4}>
                                    <Heading size="md">Top Instructors</Heading>
                                    <Button
                                        as={RouterLink}
                                        to="/admin/users?role=instructor"
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        View All Instructors
                                    </Button>
                                </Flex>

                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Email</Th>
                                            <Th>Courses</Th>
                                            <Th>Students</Th>
                                            <Th>Avg. Rating</Th>
                                            <Th>Revenue</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.topInstructors?.map(instructor => (
                                            <Tr key={instructor._id}>
                                                <Td fontWeight="medium">{instructor.name}</Td>
                                                <Td>{instructor.email}</Td>
                                                <Td>{instructor.coursesCount}</Td>
                                                <Td>{instructor.studentsCount}</Td>
                                                <Td>{instructor.averageRating?.toFixed(1) || 'N/A'}</Td>
                                                <Td>${instructor.totalRevenue?.toFixed(2) || '0.00'}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>

                        {/* Courses Tab */}
                        <TabPanel>
                            <Box overflowX="auto">
                                <Flex justify="space-between" mb={4}>
                                    <Heading size="md">Popular Courses</Heading>
                                    <Button
                                        as={RouterLink}
                                        to="/admin/courses"
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        View All Courses
                                    </Button>
                                </Flex>

                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Title</Th>
                                            <Th>Instructor</Th>
                                            <Th>Category</Th>
                                            <Th>Enrolled</Th>
                                            <Th>Price</Th>
                                            <Th>Rating</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.popularCourses?.map(course => (
                                            <Tr key={course._id}>
                                                <Td fontWeight="medium">{course.title}</Td>
                                                <Td>{course.instructor.name}</Td>
                                                <Td>{course.category}</Td>
                                                <Td>{course.enrolledCount} / {course.capacity}</Td>
                                                <Td>${course.price.toFixed(2)}</Td>
                                                <Td>{course.averageRating?.toFixed(1) || 'N/A'}</Td>
                                                <Td>
                                                    <Badge colorScheme={course.isActive ? "green" : "red"}>
                                                        {course.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>

                        {/* Transactions Tab */}
                        <TabPanel>
                            <Box overflowX="auto">
                                <Flex justify="space-between" mb={4}>
                                    <Heading size="md">Recent Transactions</Heading>
                                    <Button
                                        as={RouterLink}
                                        to="/admin/bookings"
                                        size="sm"
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        View All Transactions
                                    </Button>
                                </Flex>

                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>ID</Th>
                                            <Th>Student</Th>
                                            <Th>Course</Th>
                                            <Th>Amount</Th>
                                            <Th>Date</Th>
                                            <Th>Payment Method</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.recentTransactions?.map(transaction => (
                                            <Tr key={transaction._id}>
                                                <Td fontWeight="medium">#{transaction.bookingId}</Td>
                                                <Td>{transaction.student.name}</Td>
                                                <Td>{transaction.course.title}</Td>
                                                <Td>${transaction.amount.toFixed(2)}</Td>
                                                <Td>{new Date(transaction.date).toLocaleDateString()}</Td>
                                                <Td>{transaction.paymentMethod}</Td>
                                                <Td>
                                                    <Badge
                                                        colorScheme={
                                                            transaction.status === 'completed' ? 'green' :
                                                                transaction.status === 'pending' ? 'yellow' : 'red'
                                                        }
                                                    >
                                                        {transaction.status}
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default AdminDashboardPage;