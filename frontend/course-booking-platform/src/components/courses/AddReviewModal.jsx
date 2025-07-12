import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    FormControl,
    FormLabel,
    Textarea,
    HStack,
    Icon,
    Box,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

const AddReviewModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        onSubmit({ rating, comment });
    };

    const isValid = rating > 0 && comment.trim().length >= 5;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Write a Review</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <FormControl mb={6}>
                        <FormLabel>Your Rating</FormLabel>
                        <HStack spacing={2}>
                            {[...Array(5)].map((_, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <Icon
                                        key={i}
                                        as={FaStar}
                                        boxSize={8}
                                        color={(hover || rating) >= ratingValue ? "yellow.400" : "gray.300"}
                                        cursor="pointer"
                                        onClick={() => setRating(ratingValue)}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                );
                            })}
                        </HStack>
                        {rating > 0 && (
                            <Text mt={2} fontSize="sm" color="gray.600">
                                {rating === 1 && "Poor"}
                                {rating === 2 && "Fair"}
                                {rating === 3 && "Good"}
                                {rating === 4 && "Very Good"}
                                {rating === 5 && "Excellent"}
                            </Text>
                        )}
                    </FormControl>

                    <FormControl>
                        <FormLabel>Your Review</FormLabel>
                        <Textarea
                            placeholder="Share your experience with this course..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                        />
                        <Text fontSize="xs" color="gray.500" mt={2}>
                            Minimum 5 characters required
                        </Text>
                    </FormControl>

                    <Box mt={6} p={3} bg="blue.50" borderRadius="md">
                        <Text fontSize="sm">
                            Your review will be public and will help other students make informed decisions.
                        </Text>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isDisabled={!isValid}
                        isLoading={isSubmitting}
                        loadingText="Submitting"
                    >
                        Submit Review
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddReviewModal;