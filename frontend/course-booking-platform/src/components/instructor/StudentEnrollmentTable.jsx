import React, { useState } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Badge,
    Button,
    Flex,
    Avatar,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon,
    useColorModeValue,
    Tooltip
} from '@chakra-ui/react';
import {
    FaSearch,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaFilter,
    FaEnvelope,
    FaEye,
    FaChevronDown
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const StudentEnrollmentTable = ({
                                    enrollments = [],
                                    isLoading = false,
                                    onContactStudent = () => {},
                                    onViewDetails = () => {}
                                }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('enrollmentDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [courseFilter, setCourseFilter] = useState('all');

    const tableBgColor = useColorModeValue('white', 'gray.800');
    const headerBgColor = useColorModeValue('gray.50', 'gray.700');

    // Handle sort
    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Get unique courses for filter
    const uniqueCourses = [...new Set(enrollments.map(item => item.course.title))];

    // Apply filters and sorting
    const filteredEnrollments = enrollments
        .filter(enrollment => {
            // Apply search
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                enrollment.student.name.toLowerCase().includes(searchLower) ||
                enrollment.student.email.toLowerCase().includes(searchLower) ||
                enrollment.course.title.toLowerCase().includes(searchLower);

            // Apply course filter
            const matchesCourse = courseFilter === 'all' || enrollment.course.title === courseFilter;

            return matchesSearch && matchesCourse;
        })
        .sort((a, b) => {
            // Apply sorting
            let comparison = 0;

            if (sortField === 'studentName') {
                comparison = a.student.name.localeCompare(b.student.name);
            } else if (sortField === 'courseName') {
                comparison = a.course.title.localeCompare(b.course.title);
            } else if (sortField === 'enrollmentDate') {
                comparison = new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
            } else if (sortField === 'progress') {
                comparison = a.progress - b.progress;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

    // Get sort icon
    const getSortIcon = (field) => {
        if (field !== sortField) return <Icon as={FaSort} boxSize={3} ml={1} opacity={0.5} />;
        return sortDirection === 'asc' ? <Icon as={FaSortUp} boxSize={3} ml={1} /> : <Icon as={FaSortDown} boxSize={3} ml={1} />;
    };

    if (isLoading) {
        return (
            <Box textAlign="center" py={6}>
                <Text>Loading enrollment data...</Text>
            </Box>
        );
    }

    if (enrollments.length === 0) {
        return (
            <Box textAlign="center" py={6}>
                <Text>No student enrollments found</Text>
            </Box>
        );
    }

    return (
        <Box borderRadius="lg" overflow="hidden" borderWidth="1px" bg={tableBgColor}>
            {/* Filters */}
            <Flex p={4} bg={headerBgColor} wrap="wrap" gap={4} align="center" justify="space-between">
                <InputGroup maxW="300px">
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="sm"
                    />
                </InputGroup>

                <Menu>
                    <MenuButton as={Button} rightIcon={<FaChevronDown />} size="sm" leftIcon={<FaFilter />}>
                        {courseFilter === 'all' ? 'All Courses' : courseFilter}
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => setCourseFilter('all')}>All Courses</MenuItem>
                        {uniqueCourses.map(course => (
                            <MenuItem key={course} onClick={() => setCourseFilter(course)}>
                                {course}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </Flex>

            {/* Table */}
            <Box overflowX="auto">
                <Table variant="simple" size="sm">
                    <Thead bg={headerBgColor}>
                        <Tr>
                            <Th
                                cursor="pointer"
                                onClick={() => handleSort('studentName')}
                                userSelect="none"
                            >
                                <Flex align="center">
                                    Student {getSortIcon('studentName')}
                                </Flex>
                            </Th>
                            <Th
                                cursor="pointer"
                                onClick={() => handleSort('courseName')}
                                userSelect="none"
                            >
                                <Flex align="center">
                                    Course {getSortIcon('courseName')}
                                </Flex>
                            </Th>
                            <Th
                                cursor="pointer"
                                onClick={() => handleSort('enrollmentDate')}
                                userSelect="none"
                            >
                                <Flex align="center">
                                    Enrolled On {getSortIcon('enrollmentDate')}
                                </Flex>
                            </Th>
                            <Th
                                cursor="pointer"
                                onClick={() => handleSort('progress')}
                                userSelect="none"
                            >
                                <Flex align="center">
                                    Progress {getSortIcon('progress')}
                                </Flex>
                            </Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredEnrollments.map((enrollment) => (
                            <Tr key={enrollment._id}>
                                <Td>
                                    <Flex align="center">
                                        <Avatar
                                            size="sm"
                                            name={enrollment.student.name}
                                            src={enrollment.student.avatarUrl}
                                            mr={2}
                                        />
                                        <Box>
                                            <Text fontWeight="medium">{enrollment.student.name}</Text>
                                            <Text fontSize="xs" color="gray.500">{enrollment.student.email}</Text>
                                        </Box>
                                    </Flex>
                                </Td>
                                <Td>
                                    <Text>{enrollment.course.title}</Text>
                                </Td>
                                <Td>
                                    <Text>{formatDate(enrollment.enrollmentDate)}</Text>
                                </Td>
                                <Td>
                                    <Flex align="center" maxW="150px">
                                        <Text mr={2} fontSize="sm" whiteSpace="nowrap">
                                            {enrollment.progress}%
                                        </Text>
                                        <Box flex="1" bg="gray.100" h="8px" borderRadius="full">
                                            <Box
                                                bg={
                                                    enrollment.progress < 30 ? "red.400" :
                                                        enrollment.progress < 70 ? "orange.400" :
                                                            "green.400"
                                                }
                                                h="100%"
                                                w={`${enrollment.progress}%`}
                                                borderRadius="full"
                                            />
                                        </Box>
                                    </Flex>
                                </Td>
                                <Td>
                                    <Badge
                                        colorScheme={
                                            enrollment.status === 'completed' ? 'green' :
                                                enrollment.status === 'active' ? 'blue' :
                                                    enrollment.status === 'pending' ? 'orange' : 'gray'
                                        }
                                    >
                                        {enrollment.status}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Flex>
                                        <Tooltip label="Contact student">
                                            <Button
                                                size="xs"
                                                variant="ghost"
                                                colorScheme="blue"
                                                onClick={() => onContactStudent(enrollment.student)}
                                                mr={2}
                                            >
                                                <Icon as={FaEnvelope} />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip label="View details">
                                            <Button
                                                size="xs"
                                                variant="ghost"
                                                onClick={() => onViewDetails(enrollment)}
                                            >
                                                <Icon as={FaEye} />
                                            </Button>
                                        </Tooltip>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Empty State */}
            {filteredEnrollments.length === 0 && (
                <Box py={6} textAlign="center">
                    <Text>No enrollments found matching your filters</Text>
                </Box>
            )}

            {/* Pagination could be added here */}
        </Box>
    );
};

export default StudentEnrollmentTable;