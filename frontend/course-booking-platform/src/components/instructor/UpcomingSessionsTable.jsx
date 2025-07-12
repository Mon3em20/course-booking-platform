import React from 'react';
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
    Icon,
    Link,
    Tooltip,
    useColorModeValue
} from '@chakra-ui/react';
import { FaVideo, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const UpcomingSessionsTable = ({ sessions = [], isLoading = false }) => {
    const tableBgColor = useColorModeValue('white', 'gray.800');
    const todayColor = useColorModeValue('blue.50', 'blue.900');

    // Sort sessions by date and time
    const sortedSessions = [...sessions].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
    });

    // Check if session is today
    const isToday = (dateString) => {
        const today = new Date();
        const sessionDate = new Date(dateString);
        return (
            sessionDate.getDate() === today.getDate() &&
            sessionDate.getMonth() === today.getMonth() &&
            sessionDate.getFullYear() === today.getFullYear()
        );
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate time until session
    const getTimeUntil = (dateString, timeString) => {
        const sessionDateTime = new Date(`${dateString}T${timeString}`);
        const now = new Date();
        const diffMs = sessionDateTime - now;

        // If session is in the past
        if (diffMs < 0) return 'Started';

        const diffDays = Math.floor(diffMs / 86400000); // days
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        if (diffDays > 0) {
            return `${diffDays}d ${diffHrs}h`;
        } else if (diffHrs > 0) {
            return `${diffHrs}h ${diffMins}m`;
        } else {
            return `${diffMins}m`;
        }
    };

    // Get status badge info
    const getStatusInfo = (session) => {
        const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
        const now = new Date();

        if (sessionDateTime < now) {
            // Session has started or passed
            const endDateTime = new Date(`${session.date}T${session.endTime}`);
            if (now > endDateTime) {
                return { color: 'gray', text: 'Completed' };
            } else {
                return { color: 'green', text: 'In Progress' };
            }
        } else {
            // Upcoming session
            const diffMs = sessionDateTime - now;
            const diffHrs = diffMs / 3600000; // hours

            if (diffHrs < 1) {
                return { color: 'red', text: 'Starting Soon' };
            } else if (diffHrs < 24 && isToday(session.date)) {
                return { color: 'orange', text: 'Today' };
            } else {
                return { color: 'blue', text: 'Upcoming' };
            }
        }
    };

    if (isLoading) {
        return (
            <Box textAlign="center" py={6}>
                <Text>Loading upcoming sessions...</Text>
            </Box>
        );
    }

    if (sortedSessions.length === 0) {
        return (
            <Box textAlign="center" py={6}>
                <Text>No upcoming sessions found</Text>
                <Button
                    as={RouterLink}
                    to="/instructor/courses"
                    mt={4}
                    size="sm"
                    colorScheme="blue"
                >
                    Manage Courses
                </Button>
            </Box>
        );
    }

    return (
        <Box
            overflowX="auto"
            borderRadius="lg"
            borderWidth="1px"
            bg={tableBgColor}
        >
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th>Session</Th>
                        <Th>Course</Th>
                        <Th>Date & Time</Th>
                        <Th>Location</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedSessions.map((session) => {
                        const statusInfo = getStatusInfo(session);
                        const isSessionToday = isToday(session.date);

                        return (
                            <Tr
                                key={session._id}
                                bg={isSessionToday ? todayColor : 'inherit'}
                            >
                                <Td>
                                    <Text fontWeight="medium">{session.title}</Text>
                                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                        {session.description}
                                    </Text>
                                </Td>
                                <Td>
                                    <Text fontSize="sm">{session.course.title}</Text>
                                </Td>
                                <Td>
                                    <Flex alignItems="center">
                                        <Icon as={FaCalendarAlt} mr={2} color="blue.500" />
                                        <Box>
                                            <Text fontSize="sm">{formatDate(session.date)}</Text>
                                            <Flex alignItems="center">
                                                <Icon as={FaClock} mr={1} color="gray.500" fontSize="xs" />
                                                <Text fontSize="xs">
                                                    {session.startTime} - {session.endTime}
                                                </Text>
                                            </Flex>
                                            <Text fontSize="xs" fontWeight="bold" color={statusInfo.text === "Starting Soon" ? "red.500" : "gray.500"}>
                                                {getTimeUntil(session.date, session.startTime)} {statusInfo.text !== "Completed" && "left"}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Td>
                                <Td>
                                    <Flex alignItems="center">
                                        <Icon
                                            as={session.location === 'online' ? FaVideo : FaMapMarkerAlt}
                                            mr={2}
                                            color={session.location === 'online' ? "blue.500" : "orange.500"}
                                        />
                                        <Text fontSize="sm">
                                            {session.location === 'online' ? 'Online' : session.location}
                                        </Text>
                                    </Flex>

                                    {session.location === 'online' && session.meetingUrl && (
                                        <Link
                                            href={session.meetingUrl}
                                            isExternal
                                            fontSize="xs"
                                            color="blue.500"
                                            display="flex"
                                            alignItems="center"
                                            mt={1}
                                        >
                                            Meeting Link <Icon as={FaExternalLinkAlt} ml={1} fontSize="2xs" />
                                        </Link>
                                    )}
                                </Td>
                                <Td>
                                    <Badge colorScheme={statusInfo.color}>
                                        {statusInfo.text}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Flex>
                                        <Tooltip label="View session details">
                                            <Button
                                                as={RouterLink}
                                                to={`/instructor/courses/${session.course._id}?session=${session._id}`}
                                                size="xs"
                                                mr={2}
                                            >
                                                View
                                            </Button>
                                        </Tooltip>

                                        {(statusInfo.text === "Upcoming" || statusInfo.text === "Today" || statusInfo.text === "Starting Soon") && (
                                            <Tooltip label="Start the session">
                                                <Button
                                                    size="xs"
                                                    colorScheme="green"
                                                    as={Link}
                                                    href={session.meetingUrl || '#'}
                                                    isExternal
                                                >
                                                    Start
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </Flex>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Box>
    );
};

export default UpcomingSessionsTable;