import React from 'react';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Flex,
    Icon,
    Button,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo, FaDesktop } from 'react-icons/fa';

const UpcomingSessionsCard = ({ sessions = [] }) => {
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Format time
    const formatTime = (timeString) => {
        return timeString;
    };

    // Get session icon based on type
    const getSessionIcon = (type) => {
        switch (type) {
            case 'online':
                return FaVideo;
            case 'recorded':
                return FaDesktop;
            default:
                return FaMapMarkerAlt;
        }
    };

    // Get color scheme based on time
    const getColorScheme = (date) => {
        const now = new Date();
        const sessionDate = new Date(date);
        const diffHours = (sessionDate - now) / (1000 * 60 * 60);

        if (diffHours < 3) return "red";
        if (diffHours < 24) return "orange";
        return "blue";
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} bg="white">
            {sessions.length === 0 ? (
                <Text textAlign="center" py={4}>No upcoming sessions</Text>
            ) : (
                <VStack spacing={4} align="stretch">
                    {sessions.slice(0, 5).map((session, index) => (
                        <Box
                            key={session._id || index}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            position="relative"
                        >
                            <Badge
                                colorScheme={getColorScheme(session.date)}
                                position="absolute"
                                top={2}
                                right={2}
                            >
                                {new Date(session.date) < new Date() ? 'In Progress' : 'Upcoming'}
                            </Badge>

                            <HStack spacing={4} align="flex-start">
                                <Box
                                    bg={`${getColorScheme(session.date)}.100`}
                                    color={`${getColorScheme(session.date)}.500`}
                                    p={3}
                                    borderRadius="md"
                                    textAlign="center"
                                    minWidth="60px"
                                >
                                    <Text fontWeight="bold" fontSize="lg">
                                        {new Date(session.date).getDate()}
                                    </Text>
                                    <Text fontSize="xs">
                                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </Text>
                                </Box>

                                <Box flex="1">
                                    <Heading size="sm" mb={2}>
                                        {session.title}
                                    </Heading>

                                    <Text fontSize="sm" color="gray.600" mb={3} noOfLines={2}>
                                        {session.description || `Session for ${session.course?.title || 'Course'}`}
                                    </Text>

                                    <HStack spacing={4} fontSize="sm" color="gray.600">
                                        <Flex align="center">
                                            <Icon as={FaCalendarAlt} mr={1} />
                                            <Text>{formatDate(session.date)}</Text>
                                        </Flex>

                                        <Flex align="center">
                                            <Icon as={FaClock} mr={1} />
                                            <Text>{formatTime(session.startTime)} - {formatTime(session.endTime)}</Text>
                                        </Flex>

                                        <Flex align="center">
                                            <Icon as={getSessionIcon(session.type)} mr={1} />
                                            <Text>{session.location || 'Online'}</Text>
                                        </Flex>
                                    </HStack>
                                </Box>
                            </HStack>

                            {session.type === 'online' && (
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    mt={3}
                                    float="right"
                                    leftIcon={<Icon as={FaVideo} />}
                                >
                                    Join Session
                                </Button>
                            )}
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default UpcomingSessionsCard;