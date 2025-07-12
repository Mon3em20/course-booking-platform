import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Progress,
    Button,
    Badge,
    HStack,
    Icon,
    Image,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaPlayCircle, FaCalendarAlt, FaClock } from 'react-icons/fa';

const EnrolledCourseCard = ({ course }) => {
    // Calculate progress
    const progress = course.completedSessions ?
        Math.round((course.completedSessions / course.totalSessions) * 100) : 0;

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            shadow="sm"
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
        >
            <Flex direction={{ base: 'column', sm: 'row' }} h="100%">
                <Box
                    position="relative"
                    width={{ base: "100%", sm: "200px" }}
                    height={{ base: "150px", sm: "auto" }}
                    minHeight="100%"
                >
                    <Image
                        src={course.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
                        alt={course.title}
                        objectFit="cover"
                        h="100%"
                        w="100%"
                    />
                    {course.nextSession && (
                        <Badge
                            position="absolute"
                            top={2}
                            left={2}
                            colorScheme="green"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                        >
                            Next session: {formatDate(course.nextSession.date)}
                        </Badge>
                    )}
                </Box>

                <Box p={4} flex="1">
                    <Flex direction="column" h="100%">
                        <Box mb={2}>
                            <Heading size="md" noOfLines={2} mb={2}>
                                {course.title}
                            </Heading>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                {course.instructor?.name || 'Unknown Instructor'}
                            </Text>
                        </Box>

                        <HStack spacing={4} fontSize="sm" color="gray.600" mb={3}>
                            <Flex align="center">
                                <Icon as={FaCalendarAlt} mr={1} />
                                <Text>
                                    {formatDate(course.startDate)} - {formatDate(course.endDate)}
                                </Text>
                            </Flex>
                            <Flex align="center">
                                <Icon as={FaClock} mr={1} />
                                <Text>{course.duration} hours</Text>
                            </Flex>
                        </HStack>

                        <Box mb={3} flex="1">
                            <Flex align="center" justify="space-between" mb={1}>
                                <Text fontSize="sm" fontWeight="medium">
                                    Progress
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    {course.completedSessions || 0}/{course.totalSessions || 0} sessions
                                </Text>
                            </Flex>
                            <Progress
                                value={progress}
                                size="sm"
                                colorScheme={progress >= 100 ? "green" : "blue"}
                                borderRadius="full"
                            />
                        </Box>

                        <Flex justify="space-between" align="center" mt={2}>
                            {course.completedSessions === course.totalSessions ? (
                                <Badge colorScheme="green" p={1} borderRadius="md">
                                    Completed
                                </Badge>
                            ) : (
                                <Badge colorScheme="blue" p={1} borderRadius="md">
                                    In Progress
                                </Badge>
                            )}
                            <Button
                                as={RouterLink}
                                to={`/dashboard/my-courses/${course._id}`}
                                size="sm"
                                rightIcon={<Icon as={FaPlayCircle} />}
                                colorScheme="blue"
                            >
                                Continue Learning
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default EnrolledCourseCard;