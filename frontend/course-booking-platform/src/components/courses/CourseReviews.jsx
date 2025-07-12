import React, { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Flex,
    Avatar,
    VStack,
    HStack,
    Icon,
    Divider,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { FaStar, FaStarHalf, FaRegStar, FaThumbsUp, FaFlag, FaReply } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseReviews, addCourseReview } from '../../api/courses';
import { useAuth } from '../../contexts/AuthContext';
import AddReviewModal from './AddReviewModal';

const CourseReviews = ({ courseId }) => {
    const { user, isAuthenticated } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const queryClient = useQueryClient();

    // Get course reviews
    const { data, isLoading, error } = useQuery(
        ['courseReviews', courseId],
        () => getCourseReviews(courseId),
        {
            onError: () => {
                toast({
                    title: 'Error loading reviews',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Add review mutation
    const addReviewMutation = useMutation(
        (reviewData) => addCourseReview(courseId, reviewData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['courseReviews', courseId]);
                toast({
                    title: 'Review submitted',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error submitting review',
                    description: error.message || 'Something went wrong',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Render stars
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<Icon key={i} as={FaStar} color="yellow.400" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<Icon key={i} as={FaStarHalf} color="yellow.400" />);
            } else {
                stars.push(<Icon key={i} as={FaRegStar} color="yellow.400" />);
            }
        }
        return stars;
    };

    // Calculate average rating
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;

        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return sum / reviews.length;
    };

    // Generate rating distribution
    const getRatingDistribution = (reviews) => {
        if (!reviews || reviews.length === 0) return Array(5).fill(0);

        const distribution = Array(5).fill(0);
        reviews.forEach(review => {
            distribution[5 - Math.floor(review.rating)]++;
        });

        return distribution;
    };

    // Check if user has already reviewed
    const hasUserReviewed = () => {
        if (!isAuthenticated || !user || !data?.reviews) return false;
        return data.reviews.some(review => review.student?._id === user._id);
    };

    const handleAddReview = (reviewData) => {
        addReviewMutation.mutate(reviewData);
    };

    // Loading and error states
    if (isLoading) {
        return <Box>Loading reviews...</Box>;
    }

    if (error) {
        return <Box>Error loading reviews</Box>;
    }

    const averageRating = calculateAverageRating(data?.reviews || []);
    const ratingDistribution = getRatingDistribution(data?.reviews || []);

    return (
        <Box>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'flex-start', md: 'center' }}
                mb={6}
            >
                <Heading size="md">Student Reviews</Heading>

                {isAuthenticated && !hasUserReviewed() && (
                    <Button
                        onClick={onOpen}
                        colorScheme="blue"
                        size="sm"
                        mt={{ base: 2, md: 0 }}
                    >
                        Write a Review
                    </Button>
                )}
            </Flex>

            <Flex
                direction={{ base: 'column', md: 'row' }}
                mb={8}
                p={6}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
            >
                <Box flex="1" textAlign="center" mb={{ base: 4, md: 0 }}>
                    <Text fontSize="4xl" fontWeight="bold">
                        {averageRating.toFixed(1)}
                    </Text>
                    <HStack justify="center" spacing={1}>
                        {renderStars(averageRating)}
                    </HStack>
                    <Text mt={1} fontSize="sm" color="gray.500">
                        Based on {data?.reviews?.length || 0} reviews
                    </Text>
                </Box>

                <Box flex="2" px={{ md: 6 }}>
                    {ratingDistribution.map((count, index) => {
                        const stars = 5 - index;
                        const percentage = data?.reviews?.length
                            ? Math.round((count / data.reviews.length) * 100)
                            : 0;

                        return (
                            <Flex key={stars} align="center" mb={1}>
                                <Text fontSize="sm" width="40px">
                                    {stars} star
                                </Text>
                                <Box
                                    flex="1"
                                    bg="gray.200"
                                    h="8px"
                                    mx={2}
                                    borderRadius="full"
                                    overflow="hidden"
                                >
                                    <Box
                                        h="100%"
                                        bg="yellow.400"
                                        borderRadius="full"
                                        w={`${percentage}%`}
                                    />
                                </Box>
                                <Text fontSize="sm" width="40px">
                                    {count}
                                </Text>
                            </Flex>
                        );
                    })}
                </Box>
            </Flex>

            {data?.reviews?.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <Text>No reviews yet. Be the first to leave a review!</Text>
                </Box>
            ) : (
                <VStack spacing={6} align="stretch">
                    {data?.reviews.map((review) => (
                        <Box
                            key={review._id}
                            p={5}
                            borderWidth="1px"
                            borderRadius="lg"
                            bg="white"
                        >
                            <Flex justify="space-between" mb={2}>
                                <HStack>
                                    <Avatar
                                        size="sm"
                                        name={review.student?.name}
                                        src={review.student?.profileImage}
                                    />
                                    <Box>
                                        <Text fontWeight="medium">{review.student?.name}</Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {formatDate(review.createdAt)}
                                        </Text>
                                    </Box>
                                </HStack>
                                <HStack spacing={1}>
                                    {renderStars(review.rating)}
                                </HStack>
                            </Flex>

                            <Text mt={3}>{review.comment}</Text>

                            {review.reply && (
                                <Box mt={4} ml={4} p={3} bg="gray.50" borderRadius="md">
                                    <Flex>
                                        <Avatar
                                            size="xs"
                                            name={review.course?.instructor?.name}
                                            src={review.course?.instructor?.profileImage}
                                            mr={2}
                                        />
                                        <Box>
                                            <Text fontSize="sm" fontWeight="medium">
                                                {review.course?.instructor?.name}
                                                <Text as="span" fontWeight="normal" ml={1}>
                                                    (Instructor)
                                                </Text>
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {formatDate(review.replyDate)}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <Text fontSize="sm" mt={2}>
                                        {review.reply}
                                    </Text>
                                </Box>
                            )}

                            <Flex mt={4} justify="space-between">
                                <HStack spacing={4}>
                                    <Button
                                        size="xs"
                                        leftIcon={<FaThumbsUp />}
                                        variant="ghost"
                                    >
                                        Helpful ({review.helpfulCount || 0})
                                    </Button>
                                    <Button
                                        size="xs"
                                        leftIcon={<FaFlag />}
                                        variant="ghost"
                                        colorScheme="red"
                                    >
                                        Report
                                    </Button>
                                </HStack>

                                {user?.role === 'instructor' && !review.reply && (
                                    <Button
                                        size="xs"
                                        leftIcon={<FaReply />}
                                        variant="ghost"
                                        colorScheme="blue"
                                    >
                                        Reply
                                    </Button>
                                )}
                            </Flex>
                        </Box>
                    ))}
                </VStack>
            )}

            <AddReviewModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleAddReview}
                isSubmitting={addReviewMutation.isLoading}
            />
        </Box>
    );
};

export default CourseReviews;