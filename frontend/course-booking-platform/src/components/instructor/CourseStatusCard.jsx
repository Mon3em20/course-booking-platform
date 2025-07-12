import React from 'react';
import {
    Box,
    Flex,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Badge,
    Icon,
    Divider,
    Button,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaGraduationCap, FaUsers, FaStar, FaEye, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CourseStatusCard = ({ course }) => {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Calculate course progress
    const getProgressPercentage = () => {
        if (!course.startDate || !course.endDate) return 0;

        const start = new Date(course.startDate).getTime();
        const end = new Date(course.endDate).getTime();
        const now = Date.now();

        if (now < start) return 0;
        if (now > end) return 100;

        return Math.round(((now - start) / (end - start)) * 100);
    };

    // Get status color
    const getStatusColor = () => {
        if (!course.isActive) return 'red';
        if (course.enrolledCount >= course.capacity) return 'orange';
        return 'green';
    };

    // Get status text
    const getStatusText = () => {
        if (!course.isActive) return 'Inactive';
        if (course.enrolledCount >= course.capacity) return 'Full';
        return 'Active';
    };

    return (
        <Box
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={cardBg}
            borderColor={borderColor}
            position="relative"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'lg'
            }}
        >
            {/* Status Badge */}
            <Badge
                position="absolute"
                top={2}
                right={2}
                colorScheme={getStatusColor()}
            >
                {getStatusText()}
            </Badge>

            <Flex direction="column" h="100%">
                {/* Course Title */}
                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    noOfLines={2}
                    mb={2}
                >
                    {course.title}
                </Text>

                <Flex align="center" mb={3}>
                    <Icon as={FaGraduationCap} color="blue.500" mr={2} />
                    <Text fontSize="sm" color="gray.500">
                        {course.category} • {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Text>
                </Flex>

                {/* Stats */}
                <Flex justify="space-between" wrap="wrap" mb={4}>
                    <Stat size="sm">
                        <StatLabel fontSize="xs">Enrolled</StatLabel>
                        <Flex align="center">
                            <Icon as={FaUsers} color="green.500" mr={1} />
                            <StatNumber fontSize="md">{course.enrolledCount}/{course.capacity}</StatNumber>
                        </Flex>
                    </Stat>

                    <Stat size="sm">
                        <StatLabel fontSize="xs">Rating</StatLabel>
                        <Flex align="center">
                            <Icon as={FaStar} color="yellow.500" mr={1} />
                            <StatNumber fontSize="md">{course.averageRating?.toFixed(1) || 'N/A'}</StatNumber>
                        </Flex>
                    </Stat>

                    <Stat size="sm">
                        <StatLabel fontSize="xs">Views</StatLabel>
                        <Flex align="center">
                            <Icon as={FaEye} color="purple.500" mr={1} />
                            <StatNumber fontSize="md">{course.viewsCount || 0}</StatNumber>
                        </Flex>
                    </Stat>
                </Flex>

                {/* Date Range */}
                <Flex align="center" mb={3}>
                    <Icon as={FaClock} color="blue.500" mr={2} />
                    <Text fontSize="sm">
                        {formatDate(course.startDate)} - {formatDate(course.endDate)}
                    </Text>
                </Flex>

                {/* Progress Bar */}
                <Box my={3}>
                    <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs">Course Progress</Text>
                        <Text fontSize="xs" fontWeight="bold">{getProgressPercentage()}%</Text>
                    </Flex>
                    <Box
                        w="100%"
                        bg="gray.100"
                        borderRadius="full"
                        h="4px"
                    >
                        <Box
                            w={`${getProgressPercentage()}%`}
                            bg="blue.500"
                            borderRadius="full"
                            h="100%"
                        />
                    </Box>
                </Box>

                <Divider my={3} />

                {/* Actions */}
                <Flex justify="space-between" mt="auto">
                    <Tooltip label="View course details">
                        <Button
                            as={Link}
                            to={`/instructor/courses/${course._id}`}
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                        >
                            Details
                        </Button>
                    </Tooltip>

                    <Tooltip label="Edit course">
                        <Button
                            as={Link}
                            to={`/instructor/courses/edit/${course._id}`}
                            size="sm"
                            colorScheme="blue"
                        >
                            Edit
                        </Button>
                    </Tooltip>
                </Flex>
            </Flex>
        </Box>
    );
};

export default CourseStatusCard;