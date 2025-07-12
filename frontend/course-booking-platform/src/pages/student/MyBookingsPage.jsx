import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Badge,
    Flex,
    HStack,
    Select,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentBookings, cancelBooking } from '../../api/student';
import { Link as RouterLink } from 'react-router-dom';

const MyBookingsPage = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelDialogRef = React.useRef();
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const queryClient = useQueryClient();

    // Get bookings data
    const { data, isLoading, error } = useQuery(
        'studentBookings',
        getStudentBookings,
        {
            onError: () => {
                toast({
                    title: 'Error loading bookings',
                    description: 'Failed to load your booking data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Cancel booking mutation
    const cancelMutation = useMutation(
        (bookingId) => cancelBooking(bookingId),
        {
            onSuccess: () => {
                toast({
                    title: 'Booking cancelled',
                    description: 'Your booking has been successfully cancelled',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Refetch bookings data
                queryClient.invalidateQueries('studentBookings');
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to cancel booking',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onSettled: () => {
                onClose();
            }
        }
    );

    // Handle booking cancellation
    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        onOpen();
    };

    const confirmCancelBooking = () => {
        if (selectedBooking) {
            cancelMutation.mutate(selectedBooking._id);
        }
    };

    // Filter bookings based on status
    const getFilteredBookings = () => {
        if (!data?.bookings) return [];

        if (filterStatus === 'all') {
            return data.bookings;
        }

        return data.bookings.filter(booking => booking.status === filterStatus);
    };

    const filteredBookings = getFilteredBookings();

    // Get badge color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'cancelled':
                return 'red';
            case 'completed':
                return 'blue';
            default:
                return 'gray';
        }
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading your bookings...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>My Bookings</Heading>
                <Text color="gray.600">View and manage your course bookings</Text>
            </Box>

            {error ? (
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Text>Error loading your bookings. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Filter controls */}
                    <Flex justify="space-between" mb={6} align="center">
                        <Text>
                            Total Bookings: <strong>{data?.bookings?.length || 0}</strong>
                        </Text>

                        <HStack>
                            <Text>Filter:</Text>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                w="auto"
                            >
                                <option value="all">All Bookings</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </Select>
                        </HStack>
                    </Flex>

                    {/* Bookings table */}
                    {filteredBookings.length === 0 ? (
                        <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
                            <Text mb={6}>No bookings found.</Text>
                            <Button
                                as={RouterLink}
                                to="/courses"
                                colorScheme="blue"
                            >
                                Browse Courses
                            </Button>
                        </Box>
                    ) : (
                        <Box overflowX="auto">
                            <Table variant="simple" borderWidth="1px" borderRadius="lg">
                                <Thead bg="gray.50">
                                    <Tr>
                                        <Th>Booking ID</Th>
                                        <Th>Course</Th>
                                        <Th>Date</Th>
                                        <Th>Price</Th>
                                        <Th>Payment Status</Th>
                                        <Th>Booking Status</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filteredBookings.map((booking) => (
                                        <Tr key={booking._id}>
                                            <Td fontWeight="medium">{booking.bookingId}</Td>
                                            <Td>
                                                <Text>{booking.course?.title}</Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    {booking.course?.instructor?.name}
                                                </Text>
                                            </Td>
                                            <Td>{new Date(booking.bookingDate).toLocaleDateString()}</Td>
                                            <Td>${booking.amount?.toFixed(2)}</Td>
                                            <Td>
                                                <Badge colorScheme={booking.paymentStatus === 'paid' ? 'green' : 'yellow'}>
                                                    {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Badge colorScheme={getStatusColor(booking.status)}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <HStack spacing={2}>
                                                    <Button
                                                        as={RouterLink}
                                                        to={`/dashboard/my-courses/${booking.course?._id}`}
                                                        size="sm"
                                                        colorScheme="blue"
                                                        isDisabled={booking.status === 'cancelled'}
                                                    >
                                                        View Course
                                                    </Button>

                                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="outline"
                                                            onClick={() => handleCancelBooking(booking)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}

                    {/* Cancel Booking Confirmation Dialog */}
                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelDialogRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Cancel Booking
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure you want to cancel this booking? This action cannot be undone.
                                    {selectedBooking?.course?.cancellationPolicy && (
                                        <Box mt={4} p={3} bg="yellow.50" borderRadius="md">
                                            <Text fontWeight="bold">Cancellation Policy:</Text>
                                            <Text>{selectedBooking.course.cancellationPolicy}</Text>
                                        </Box>
                                    )}
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelDialogRef} onClick={onClose}>
                                        Keep Booking
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={confirmCancelBooking}
                                        ml={3}
                                        isLoading={cancelMutation.isLoading}
                                        loadingText="Cancelling"
                                    >
                                        Cancel Booking
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </>
            )}
        </Container>
    );
};

export default MyBookingsPage;