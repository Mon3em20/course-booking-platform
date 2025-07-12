import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Avatar,
    Icon,
    Divider,
    Badge,
} from '@chakra-ui/react';
import {
    FaBook,
    FaCertificate,
    FaStar,
    FaCalendarCheck,
    FaComment,
    FaGraduationCap,
} from 'react-icons/fa';

const ActivityFeed = ({ activities = [] }) => {
    // Get icon based on activity type
    const getActivityIcon = (type) => {
        switch (type) {
            case 'enrollment':
                return FaBook;
            case 'certificate':
                return FaCertificate;
            case 'review':
                return FaStar;
            case 'session':
                return FaCalendarCheck;
            case 'comment':
                return FaComment;
            default:
                return FaGraduationCap;
        }
    };

    // Get color based on activity type
    const getActivityColor = (type) => {
        switch (type) {
            case 'enrollment':
                return 'blue';
            case 'certificate':
                return 'purple';
            case 'review':
                return 'yellow';
            case 'session':
                return 'green';
            case 'comment':
                return 'orange';
            default:
                return 'gray';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    };

    return (
        <VStack spacing={4} align="stretch">
            {activities.length === 0 ? (
                <Text textAlign="center" py={4} color="gray.500">
                    No recent activities
                </Text>
            ) : (
                activities.map((activity, index) => (
                    <React.Fragment key={activity._id || index}>
                        <HStack spacing={3} align="flex-start">
                            <Box
                                p={2}
                                bg={`${getActivityColor(activity.type)}.100`}
                                color={`${getActivityColor(activity.type)}.500`}
                                borderRadius="md"
                            >
                                <Icon as={getActivityIcon(activity.type)} boxSize={5} />
                            </Box>

                            <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium">
                                    {activity.title}
                                </Text>
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    {formatDate(activity.date)}
                                </Text>
                                {activity.description && (
                                    <Text fontSize="sm" mt={1} color="gray.700">
                                        {activity.description}
                                    </Text>
                                )}
                                {activity.course && (
                                    <Badge
                                        mt={2}
                                        fontSize="xs"
                                        colorScheme={getActivityColor(activity.type)}
                                        variant="subtle"
                                    >
                                        {activity.course}
                                    </Badge>
                                )}
                            </Box>

                            {activity.user && (
                                <Avatar
                                    size="xs"
                                    name={activity.user.name}
                                    src={activity.user.profileImage}
                                />
                            )}
                        </HStack>
                        {index < activities.length - 1 && <Divider my={2} />}
                    </React.Fragment>
                ))
            )}
        </VStack>
    );
};

export default ActivityFeed;