import React from 'react';
import {
    Box,
    Image,
    Badge,
    Text,
    Flex,
    HStack,
    Icon,
    Button,
    VStack,
    Avatar,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaStar, FaUsers, FaClock, FaChalkboardTeacher } from 'react-icons/fa';

const CourseCard = ({ course }) => {
    // التحقق من وجود بيانات الدورة
    if (!course) {
        return null;
    }

    // استخراج البيانات مع قيم افتراضية لمنع الأخطاء
    const {
        _id = '',
        title = 'Course Title',
        description = 'No description available',
        imageUrl = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        price = 0,
        level = 'Beginner',
        rating = 0,
        reviewCount = 0,
        enrolledCount = 0,
        duration = 0,
        lectures = 0,
        instructor = {}
    } = course || {};

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            transition="transform 0.2s, box-shadow 0.2s"
            _hover={{
                transform: "translateY(-5px)",
                boxShadow: "lg",
            }}
            height="100%"
            display="flex"
            flexDirection="column"
        >
            {/* Course Image */}
            <Box position="relative">
                <Image
                    src={imageUrl}
                    alt={title}
                    height="200px"
                    width="100%"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/640x360?text=Course+Image"
                />

                {/* Price Badge */}
                <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    px={2}
                    py={1}
                    borderRadius="md"
                    colorScheme={price > 0 ? "blue" : "green"}
                    fontSize="sm"
                    fontWeight="bold"
                >
                    {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
                </Badge>

                {/* Course Level */}
                <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    px={2}
                    py={1}
                    borderRadius="md"
                    colorScheme="purple"
                    fontSize="xs"
                >
                    {level}
                </Badge>
            </Box>

            {/* Course Info */}
            <VStack p={4} spacing={3} align="stretch" flex="1">
                <Text
                    fontWeight="bold"
                    fontSize="lg"
                    lineHeight="tight"
                    noOfLines={2}
                >
                    {title}
                </Text>

                {/* Instructor Info */}
                <Flex align="center">
                    <Avatar
                        size="xs"
                        name={instructor?.name || 'Instructor'}
                        src={instructor?.profileImage}
                        mr={2}
                    />
                    <Text color="gray.600" fontSize="sm">
                        {instructor?.name || 'Instructor'}
                    </Text>
                </Flex>

                {/* Description */}
                <Text
                    color="gray.600"
                    fontSize="sm"
                    noOfLines={2}
                    flex="1"
                >
                    {description}
                </Text>

                {/* Course Stats */}
                <HStack spacing={4} mt={2}>
                    {rating > 0 && (
                        <Flex align="center">
                            <Icon as={FaStar} color="yellow.400" mr={1} />
                            <Text fontSize="sm">{rating.toFixed(1)}</Text>
                            {reviewCount > 0 && (
                                <Text fontSize="xs" color="gray.500" ml={1}>
                                    ({reviewCount})
                                </Text>
                            )}
                        </Flex>
                    )}

                    <Flex align="center">
                        <Icon as={FaUsers} color="blue.500" mr={1} />
                        <Text fontSize="sm">
                            {enrolledCount} {enrolledCount === 1 ? 'student' : 'students'}
                        </Text>
                    </Flex>
                </HStack>

                <HStack spacing={4}>
                    <Flex align="center">
                        <Icon as={FaClock} color="green.500" mr={1} />
                        <Text fontSize="sm">{duration} hours</Text>
                    </Flex>

                    <Flex align="center">
                        <Icon as={FaChalkboardTeacher} color="purple.500" mr={1} />
                        <Text fontSize="sm">{lectures} lectures</Text>
                    </Flex>
                </HStack>
            </VStack>

            {/* Card Footer */}
            <Box p={4} pt={0}>
                <Button
                    as={RouterLink}
                    to={`/courses/${_id}`}
                    colorScheme="blue"
                    size="sm"
                    width="100%"
                >
                    View Course
                </Button>
            </Box>
        </Box>
    );
};

export default CourseCard;