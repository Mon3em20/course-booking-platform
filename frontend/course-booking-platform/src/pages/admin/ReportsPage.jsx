import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Flex,
    HStack,
    VStack,
    Button,
    Select,
    Card,
    CardBody,
    CardHeader,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from '@chakra-ui/react';
import {
    FaDownload,
    FaChartBar,
    FaChartLine,
    FaChartPie,
    FaCalendarAlt,
    FaFilter,
    FaEllipsisV,
    FaEye,
    FaFileExport,
} from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    getRevenueReport,
    getEnrollmentReport,
    getInstructorPerformanceReport,
    getCoursePerformanceReport,
    exportReportData
} from '../../api/admin';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsPage = () => {
    const toast = useToast();
    const [timePeriod, setTimePeriod] = useState('month');
    const [reportType, setReportType] = useState('revenue');

    // Get revenue report
    const {
        data: revenueData,
        isLoading: revenueLoading,
        error: revenueError
    } = useQuery(
        ['revenueReport', timePeriod],
        () => getRevenueReport(timePeriod),
        {
            enabled: reportType === 'revenue',
            onError: () => {
                toast({
                    title: 'Error loading revenue data',
                    description: 'Failed to load revenue report',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Get enrollment report
    const {
        data: enrollmentData,
        isLoading: enrollmentLoading,
        error: enrollmentError
    } = useQuery(
        ['enrollmentReport', timePeriod],
        () => getEnrollmentReport(timePeriod),
        {
            enabled: reportType === 'enrollment',
            onError: () => {
                toast({
                    title: 'Error loading enrollment data',
                    description: 'Failed to load enrollment report',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Get instructor performance report
    const {
        data: instructorData,
        isLoading: instructorLoading,
        error: instructorError
    } = useQuery(
        ['instructorReport', timePeriod],
        () => getInstructorPerformanceReport(timePeriod),
        {
            enabled: reportType === 'instructors',
            onError: () => {
                toast({
                    title: 'Error loading instructor data',
                    description: 'Failed to load instructor performance report',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Get course performance report
    const {
        data: courseData,
        isLoading: courseLoading,
        error: courseError
    } = useQuery(
        ['courseReport', timePeriod],
        () => getCoursePerformanceReport(timePeriod),
        {
            enabled: reportType === 'courses',
            onError: () => {
                toast({
                    title: 'Error loading course data',
                    description: 'Failed to load course performance report',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Export report data
    const exportMutation = useMutation(
        (params) => exportReportData(params.type, params.period),
        {
            onSuccess: (data) => {
                // Create a download link for the CSV data
                const blob = new Blob([data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', `${reportType}_report_${timePeriod}.csv`);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                toast({
                    title: 'Export successful',
                    description: 'Report data has been exported to CSV',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Export failed',
                    description: error.message || 'Failed to export report data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    const handleExport = () => {
        exportMutation.mutate({ type: reportType, period: timePeriod });
    };

    // COLORS for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Check if data is loading
    const isLoading =
        (reportType === 'revenue' && revenueLoading) ||
        (reportType === 'enrollment' && enrollmentLoading) ||
        (reportType === 'instructors' && instructorLoading) ||
        (reportType === 'courses' && courseLoading);

    // Check for errors
    const hasError =
        (reportType === 'revenue' && revenueError) ||
        (reportType === 'enrollment' && enrollmentError) ||
        (reportType === 'instructors' && instructorError) ||
        (reportType === 'courses' && courseError);

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>Analytics & Reports</Heading>
                <Text color="gray.600">Analyze platform performance, revenue, and user data</Text>
            </Box>

            {/* Report Controls */}
            <Flex
                mb={6}
                justify="space-between"
                align="center"
                wrap={{ base: "wrap", md: "nowrap" }}
                gap={4}
            >
                <HStack>
                    <Select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        w="auto"
                        icon={<FaChartBar />}
                    >
                        <option value="revenue">Revenue Report</option>
                        <option value="enrollment">Enrollment Report</option>
                        <option value="instructors">Instructor Performance</option>
                        <option value="courses">Course Performance</option>
                    </Select>

                    <Select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        w="auto"
                        icon={<FaCalendarAlt />}
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 3 Months</option>
                        <option value="year">Last 12 Months</option>
                    </Select>
                </HStack>

                <Button
                    leftIcon={<FaDownload />}
                    colorScheme="blue"
                    onClick={handleExport}
                    isLoading={exportMutation.isLoading}
                    loadingText="Exporting"
                >
                    Export Report
                </Button>
            </Flex>

            {isLoading ? (
                <Box textAlign="center" py={10}>
                    <Spinner size="xl" thickness="4px" color="blue.500" />
                    <Text mt={4}>Loading report data...</Text>
                </Box>
            ) : hasError ? (
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Text>Error loading report data. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Revenue Report */}
                    {reportType === 'revenue' && (
                        <>
                            {/* Revenue Summary Stats */}
                            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Total Revenue</StatLabel>
                                    <StatNumber>${revenueData?.totalRevenue?.toFixed(2) || '0.00'}</StatNumber>
                                    <HStack justify="center">
                                        <StatHelpText
                                            mb={0}
                                            color={revenueData?.percentChange >= 0 ? 'green.500' : 'red.500'}
                                        >
                                            {revenueData?.percentChange >= 0 ? '↑' : '↓'} {Math.abs(revenueData?.percentChange || 0)}%
                                        </StatHelpText>
                                        <Text fontSize="sm" color="gray.500">vs. previous period</Text>
                                    </HStack>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Net Revenue</StatLabel>
                                    <StatNumber>${revenueData?.netRevenue?.toFixed(2) || '0.00'}</StatNumber>
                                    <StatHelpText mb={0}>After refunds</StatHelpText>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Total Orders</StatLabel>
                                    <StatNumber>{revenueData?.orderCount || 0}</StatNumber>
                                    <StatHelpText mb={0}>Completed bookings</StatHelpText>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Average Order Value</StatLabel>
                                    <StatNumber>${revenueData?.averageOrderValue?.toFixed(2) || '0.00'}</StatNumber>
                                    <StatHelpText mb={0}>Per booking</StatHelpText>
                                </Stat>
                            </SimpleGrid>

                            {/* Revenue Charts */}
                            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
                                {/* Revenue Over Time Chart */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Revenue Over Time</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={revenueData?.timeData || []}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => `$${value}`} />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Gross Revenue" />
                                                    <Line type="monotone" dataKey="netRevenue" stroke="#82ca9d" name="Net Revenue" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>

                                {/* Revenue by Category Chart */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Revenue by Category</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={revenueData?.categoryData || []}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {revenueData?.categoryData?.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => `$${value}`} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>
                            </SimpleGrid>

                            {/* Revenue Table */}
                            <Card mb={6}>
                                <CardHeader>
                                    <Heading size="md">Revenue Details</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Box overflowX="auto">
                                        <Table variant="simple" size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th>Date</Th>
                                                    <Th isNumeric>Gross Revenue</Th>
                                                    <Th isNumeric>Refunds</Th>
                                                    <Th isNumeric>Net Revenue</Th>
                                                    <Th isNumeric>Orders</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {revenueData?.tableData?.map((row, index) => (
                                                    <Tr key={index}>
                                                        <Td>{row.date}</Td>
                                                        <Td isNumeric>${row.revenue.toFixed(2)}</Td>
                                                        <Td isNumeric>${row.refunds.toFixed(2)}</Td>
                                                        <Td isNumeric>${row.netRevenue.toFixed(2)}</Td>
                                                        <Td isNumeric>{row.orders}</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </CardBody>
                            </Card>
                        </>
                    )}

                    {/* Enrollment Report */}
                    {reportType === 'enrollment' && (
                        <>
                            {/* Enrollment Summary Stats */}
                            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Total Enrollments</StatLabel>
                                    <StatNumber>{enrollmentData?.totalEnrollments || 0}</StatNumber>
                                    <HStack justify="center">
                                        <StatHelpText
                                            mb={0}
                                            color={enrollmentData?.percentChange >= 0 ? 'green.500' : 'red.500'}
                                        >
                                            {enrollmentData?.percentChange >= 0 ? '↑' : '↓'} {Math.abs(enrollmentData?.percentChange || 0)}%
                                        </StatHelpText>
                                        <Text fontSize="sm" color="gray.500">vs. previous period</Text>
                                    </HStack>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Paid Enrollments</StatLabel>
                                    <StatNumber>{enrollmentData?.paidEnrollments || 0}</StatNumber>
                                    <StatHelpText mb={0}>{enrollmentData?.paidPercentage?.toFixed(0) || 0}% of total</StatHelpText>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Free Enrollments</StatLabel>
                                    <StatNumber>{enrollmentData?.freeEnrollments || 0}</StatNumber>
                                    <StatHelpText mb={0}>{enrollmentData?.freePercentage?.toFixed(0) || 0}% of total</StatHelpText>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Completion Rate</StatLabel>
                                    <StatNumber>{enrollmentData?.completionRate?.toFixed(0) || 0}%</StatNumber>
                                    <StatHelpText mb={0}>Course completions</StatHelpText>
                                </Stat>
                            </SimpleGrid>

                            {/* Enrollment Charts */}
                            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
                                {/* Enrollment Over Time Chart */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Enrollments Over Time</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={enrollmentData?.timeData || []}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="totalEnrollments" stroke="#8884d8" name="Total Enrollments" />
                                                    <Line type="monotone" dataKey="paidEnrollments" stroke="#82ca9d" name="Paid Enrollments" />
                                                    <Line type="monotone" dataKey="freeEnrollments" stroke="#ffc658" name="Free Enrollments" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>

                                {/* Enrollment by Category Chart */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Enrollments by Category</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={enrollmentData?.categoryData || []}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="enrollments" fill="#8884d8" name="Enrollments" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>
                            </SimpleGrid>

                            {/* Enrollment Table */}
                            <Card mb={6}>
                                <CardHeader>
                                    <Heading size="md">Top Courses by Enrollment</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Box overflowX="auto">
                                        <Table variant="simple" size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th>Course</Th>
                                                    <Th>Category</Th>
                                                    <Th>Instructor</Th>
                                                    <Th isNumeric>Enrollments</Th>
                                                    <Th isNumeric>Completion Rate</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {enrollmentData?.courseData?.map((course, index) => (
                                                    <Tr key={index}>
                                                        <Td>{course.title}</Td>
                                                        <Td>{course.category}</Td>
                                                        <Td>{course.instructor}</Td>
                                                        <Td isNumeric>{course.enrollments}</Td>
                                                        <Td isNumeric>{course.completionRate}%</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </CardBody>
                            </Card>
                        </>
                    )}

                    {/* Instructor Performance Report */}
                    {reportType === 'instructors' && (
                        <>
                            <Card mb={6}>
                                <CardHeader>
                                    <Heading size="md">Instructor Performance</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Box overflowX="auto">
                                        <Table variant="simple">
                                            <Thead>
                                                <Tr>
                                                    <Th>Instructor</Th>
                                                    <Th isNumeric>Courses</Th>
                                                    <Th isNumeric>Students</Th>
                                                    <Th isNumeric>Revenue</Th>
                                                    <Th isNumeric>Avg Rating</Th>
                                                    <Th>Status</Th>
                                                    <Th width="60px">Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {instructorData?.instructors?.map((instructor, index) => (
                                                    <Tr key={index}>
                                                        <Td>{instructor.name}</Td>
                                                        <Td isNumeric>{instructor.courseCount}</Td>
                                                        <Td isNumeric>{instructor.studentCount}</Td>
                                                        <Td isNumeric>${instructor.revenue.toFixed(2)}</Td>
                                                        <Td isNumeric>{instructor.averageRating.toFixed(1)}</Td>
                                                        <Td>
                                                            <Badge colorScheme={instructor.isActive ? 'green' : 'red'}>
                                                                {instructor.isActive ? 'Active' : 'Inactive'}
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
                                                                    <MenuItem icon={<FaEye />}>View Profile</MenuItem>
                                                                    <MenuItem icon={<FaChartBar />}>Detailed Analytics</MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </CardBody>
                            </Card>

                            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                {/* Top Instructors by Revenue */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Top Instructors by Revenue</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={instructorData?.topByRevenue?.slice(0, 5) || []}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    layout="vertical"
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" />
                                                    <YAxis type="category" dataKey="name" width={100} />
                                                    <Tooltip formatter={(value) => `$${value}`} />
                                                    <Legend />
                                                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>

                                {/* Top Instructors by Students */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Top Instructors by Students</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={instructorData?.topByStudents?.slice(0, 5) || []}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    layout="vertical"
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" />
                                                    <YAxis type="category" dataKey="name" width={100} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="studentCount" fill="#82ca9d" name="Students" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>
                            </SimpleGrid>
                        </>
                    )}

                    {/* Course Performance Report */}
                    {reportType === 'courses' && (
                        <>
                            {/* Course Summary Stats */}
                            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Total Courses</StatLabel>
                                    <StatNumber>{courseData?.totalCourses || 0}</StatNumber>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Published Courses</StatLabel>
                                    <StatNumber>{courseData?.publishedCourses || 0}</StatNumber>
                                    <StatHelpText mb={0}>
                                        {courseData?.publishedPercentage?.toFixed(0) || 0}% of total
                                    </StatHelpText>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Average Rating</StatLabel>
                                    <StatNumber>{courseData?.averageRating?.toFixed(1) || 0}</StatNumber>
                                    <StatHelpText mb={0}>
                                        {courseData?.totalReviews || 0} total reviews
                                    </StatHelpText>
                                </Stat>

                                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                                    <StatLabel>Average Completion</StatLabel>
                                    <StatNumber>{courseData?.averageCompletion?.toFixed(0) || 0}%</StatNumber>
                                    <StatHelpText mb={0}>Course completion rate</StatHelpText>
                                </Stat>
                            </SimpleGrid>

                            <Tabs colorScheme="blue" isLazy mb={6}>
                                <TabList>
                                    <Tab>Top Performing</Tab>
                                    <Tab>Most Revenue</Tab>
                                    <Tab>Highest Rated</Tab>
                                    <Tab>Lowest Performing</Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel px={0} py={4}>
                                        {renderCourseTable(courseData?.topPerforming)}
                                    </TabPanel>

                                    <TabPanel px={0} py={4}>
                                        {renderCourseTable(courseData?.topRevenue)}
                                    </TabPanel>

                                    <TabPanel px={0} py={4}>
                                        {renderCourseTable(courseData?.highestRated)}
                                    </TabPanel>

                                    <TabPanel px={0} py={4}>
                                        {renderCourseTable(courseData?.lowestPerforming)}
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>

                            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                                {/* Enrollments by Category Chart */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Enrollments by Category</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={courseData?.categoryEnrollments || []}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {courseData?.categoryEnrollments?.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>

                                {/* Course Ratings Distribution */}
                                <Card>
                                    <CardHeader pb={0}>
                                        <Heading size="md">Rating Distribution</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Box height="300px">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={courseData?.ratingDistribution || []}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="rating" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="count" fill="#8884d8" name="Number of Courses" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardBody>
                                </Card>
                            </SimpleGrid>
                        </>
                    )}
                </>
            )}
        </Container>
    );

    // Helper function to render course table
    function renderCourseTable(courses) {
        if (!courses || courses.length === 0) {
            return (
                <Box textAlign="center" py={4}>
                    <Text>No course data available.</Text>
                </Box>
            );
        }

        return (
            <Box overflowX="auto">
                <Table variant="simple" size="sm">
                    <Thead>
                        <Tr>
                            <Th>Course</Th>
                            <Th>Instructor</Th>
                            <Th>Category</Th>
                            <Th isNumeric>Enrollments</Th>
                            <Th isNumeric>Revenue</Th>
                            <Th isNumeric>Rating</Th>
                            <Th isNumeric>Completion</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {courses.map((course, index) => (
                            <Tr key={index}>
                                <Td>{course.title}</Td>
                                <Td>{course.instructor}</Td>
                                <Td>{course.category}</Td>
                                <Td isNumeric>{course.enrollments}</Td>
                                <Td isNumeric>${course.revenue.toFixed(2)}</Td>
                                <Td isNumeric>{course.rating.toFixed(1)}</Td>
                                <Td isNumeric>{course.completionRate}%</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        );
    }
};

export default ReportsPage;