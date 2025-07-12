import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Flex,
    HStack,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    useDisclosure,
    useColorModeValue,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaSearch, FaEllipsisV, FaCheck, FaTimes, FaEye, FaUserClock, FaDownload } from 'react-icons/fa';
import {
    getInstructorBookings,
    updateBookingStatus,
    downloadBookingInvoice
} from '../../api/instructor';

const BookingsPage = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const bookingDetails = useDisclosure();
    const statusUpdateModal = useDisclosure();
    const [newStatus, setNewStatus] = useState('');

    // Get instructor bookings
    const { data, isLoading, error } = useQuery(
        'instructorBookings',
        getInstructorBookings,
        {
            onError: () => {
                toast({
                    title: 'Error loading bookings',
                    description: 'Failed to load booking data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update booking status mutation
    const updateStatusMutation = useMutation(
        ({ bookingId, status }) => updateBookingStatus(bookingId, status),
        {
            onSuccess: () => {
                toast({
                    title: 'Status updated',
                    description: 'Booking status has been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('instructorBookings');
                statusUpdateModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error updating status',
                    description: error.message || 'Failed to update booking status',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Download invoice mutation
    const downloadInvoiceMutation = useMutation(
        (bookingId) => downloadBookingInvoice(bookingId),
        {
            onSuccess: (data) => {
                // Create a download link
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `invoice-${selectedBooking?.bookingId || 'booking'}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                toast({
                    title: 'Invoice downloaded',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Error downloading invoice',
                    description: error.message || 'Failed to download invoice',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Filter bookings based on search and status
    const getFilteredBookings = () => {
        if (!data?.bookings) return [];

        return data.bookings.filter(booking => {
            const matchesQuery = searchQuery === '' ||
                booking.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;

            return matchesQuery && matchesStatus;
        });
    };

    const filteredBookings = getFilteredBookings();

    // Open booking details
    const openBookingDetails = (booking) => {
        setSelectedBooking(booking);
        bookingDetails.onOpen();
    };

    // Open status update modal
    const openStatusUpdateModal = (booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status);
        statusUpdateModal.onOpen();
    };

    // Handle status update
    const handleStatusUpdate = () => {
        if (!selectedBooking || !newStatus) return;

        updateStatusMutation.mutate({
            bookingId: selectedBooking._id,
            status: newStatus
        });
    };

    // Handle invoice download
    const handleDownloadInvoice = (booking) => {
        setSelectedBooking(booking);
        downloadInvoiceMutation.mutate(booking._id);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

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

    // Get bookings by status
    const pendingBookings = data?.bookings?.filter(booking => booking.status === 'pending') || [];
    const confirmedBookings = data?.bookings?.filter(booking => booking.status === 'confirmed') || [];
    const completedBookings = data?.bookings?.filter(booking => booking.status === 'completed') || [];
    const cancelledBookings = data?.bookings?.filter(booking => booking.status === 'cancelled') || [];

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading bookings...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>Course Bookings</Heading>
                <Text color="gray.600">View and manage student bookings for your courses</Text>
            </Box>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading bookings. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Search and Filter Bar */}
                    <Flex mb={6} flexDir={{ base: "column", md: "row" }} gap={4}>
                        <InputGroup maxW={{ md: "320px" }}>
                            <InputLeftElement pointerEvents="none">
                                <FaSearch color="gray.300" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search bookings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </InputGroup>

                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            maxW={{ md: "200px" }}
                        >
                            <option value="all">All Bookings</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </Select>
                    </Flex>

                    {/* Bookings Tabs */}
                    <Tabs colorScheme="blue" variant="enclosed" isLazy>
                        <TabList>
                            <Tab>All Bookings ({data?.bookings?.length || 0})</Tab>
                            <Tab>Pending ({pendingBookings.length})</Tab>
                            <Tab>Confirmed ({confirmedBookings.length})</Tab>
                            <Tab>Completed ({completedBookings.length})</Tab>
                            <Tab>Cancelled ({cancelledBookings.length})</Tab>
                        </TabList>

                        <TabPanels>
                            {/* All Bookings Tab */}
                            <TabPanel px={0}>
                                {filteredBookings.length === 0 ? (
                                    <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                                        <Text>No bookings found.</Text>
                                    </Box>
                                ) : (
                                    <Box overflowX="auto">
                                        <Table variant="simple" borderWidth="1px" borderRadius="lg">
                                            <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                                                <Tr>
                                                    <Th>Booking ID</Th>
                                                    <Th>Student</Th>
                                                    <Th>Course</Th>
                                                    <Th>Date</Th>
                                                    <Th>Amount</Th>
                                                    <Th>Status</Th>
                                                    <Th width="100px">Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {filteredBookings.map((booking) => (
                                                    <Tr key={booking._id}>
                                                        <Td fontWeight="medium">{booking.bookingId}</Td>
                                                        <Td>{booking.student?.name}</Td>
                                                        <Td>{booking.course?.title}</Td>
                                                        <Td>{formatDate(booking.bookingDate)}</Td>
                                                        <Td>${booking.amount.toFixed(2)}</Td>
                                                        <Td>
                                                            <Badge colorScheme={getStatusColor(booking.status)}>
                                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <Menu>
                                                                <MenuButton
                                                                    as={IconButton}
                                                                    icon={<FaEllipsisV />}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                />
                                                                <MenuList>
                                                                    <MenuItem
                                                                        icon={<FaEye />}
                                                                        onClick={() => openBookingDetails(booking)}
                                                                    >
                                                                        View Details
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        icon={<FaUserClock />}
                                                                        onClick={() => openStatusUpdateModal(booking)}
                                                                    >
                                                                        Update Status
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        icon={<FaDownload />}
                                                                        onClick={() => handleDownloadInvoice(booking)}
                                                                    >
                                                                        Download Invoice
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                )}
                            </TabPanel>

                            {/* Other tabs with filtered lists */}
                            {[
                                { status: 'pending', data: pendingBookings },
                                { status: 'confirmed', data: confirmedBookings },
                                { status: 'completed', data: completedBookings },
                                { status: 'cancelled', data: cancelledBookings },
                            ].map((tabData, idx) => (
                                <TabPanel key={idx} px={0}>
                                    {tabData.data.length === 0 ? (
                                        <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                                            <Text>No {tabData.status} bookings found.</Text>
                                        </Box>
                                    ) : (
                                        <Box overflowX="auto">
                                            <Table variant="simple" borderWidth="1px" borderRadius="lg">
                                                <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                                                    <Tr>
                                                        <Th>Booking ID</Th>
                                                        <Th>Student</Th>
                                                        <Th>Course</Th>
                                                        <Th>Date</Th>
                                                        <Th>Amount</Th>
                                                        <Th width="100px">Actions</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {tabData.data.map((booking) => (
                                                        <Tr key={booking._id}>
                                                            <Td fontWeight="medium">{booking.bookingId}</Td>
                                                            <Td>{booking.student?.name}</Td>
                                                            <Td>{booking.course?.title}</Td>
                                                            <Td>{formatDate(booking.bookingDate)}</Td>
                                                            <Td>${booking.amount.toFixed(2)}</Td>
                                                            <Td>
                                                                <Menu>
                                                                    <MenuButton
                                                                        as={IconButton}
                                                                        icon={<FaEllipsisV />}
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    />
                                                                    <MenuList>
                                                                        <MenuItem
                                                                            icon={<FaEye />}
                                                                            onClick={() => openBookingDetails(booking)}
                                                                        >
                                                                            View Details
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            icon={<FaUserClock />}
                                                                            onClick={() => openStatusUpdateModal(booking)}
                                                                            isDisabled={booking.status === 'cancelled'}
                                                                        >
                                                                            Update Status
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            icon={<FaDownload />}
                                                                            onClick={() => handleDownloadInvoice(booking)}
                                                                        >
                                                                            Download Invoice
                                                                        </MenuItem>
                                                                    </MenuList>
                                                                </Menu>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    )}
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </Tabs>
                </>
            )}

            {/* Booking Details Modal */}
            <Modal isOpen={bookingDetails.isOpen} onClose={bookingDetails.onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Booking Details</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        {selectedBooking && (
                            <VStack spacing={4} align="stretch">
                                <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                                    <Flex justify="space-between" align="center" mb={4}>
                                        <Heading size="md">Booking #{selectedBooking.bookingId}</Heading>
                                        <Badge colorScheme={getStatusColor(selectedBooking.status)} fontSize="sm" px={2} py={1}>
                                            {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                        </Badge>
                                    </Flex>

                                    <VStack spacing={3} align="stretch">
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">Student:</Text>
                                            <Text>{selectedBooking.student?.name}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">Course:</Text>
                                            <Text>{selectedBooking.course?.title}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">Booking Date:</Text>
                                            <Text>{formatDate(selectedBooking.bookingDate)}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">Start Date:</Text>
                                            <Text>{selectedBooking.course?.startDate ?
                                                formatDate(selectedBooking.course.startDate) : 'Not specified'}
                                            </Text>
                                        </Flex>
                                    </VStack>
                                </Box>

                                <Box p={4} borderWidth="1px" borderRadius="md">
                                    <Heading size="sm" mb={4}>Payment Information</Heading>

                                    <VStack spacing={3} align="stretch">
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">Amount:</Text>
                                            <Text>${selectedBooking.amount.toFixed(2)}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">Payment Method:</Text>
                                            <Text>{selectedBooking.paymentMethod}</Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text fontWeight="medium">Payment Status:</Text>
                                            <Badge colorScheme={selectedBooking.paymentStatus === 'paid' ? 'green' : 'yellow'}>
                                                {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                                            </Badge>
                                        </Flex>
                                        {selectedBooking.paymentDate && (
                                            <Flex justify="space-between">
                                                <Text fontWeight="medium">Payment Date:</Text>
                                                <Text>{formatDate(selectedBooking.paymentDate)}</Text>
                                            </Flex>
                                        )}
                                    </VStack>
                                </Box>

                                {selectedBooking.notes && (
                                    <Box p={4} borderWidth="1px" borderRadius="md">
                                        <Heading size="sm" mb={2}>Notes</Heading>
                                        <Text>{selectedBooking.notes}</Text>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <HStack spacing={3}>
                            <Button
                                onClick={() => {
                                    bookingDetails.onClose();
                                    openStatusUpdateModal(selectedBooking);
                                }}
                                colorScheme="blue"
                                isDisabled={selectedBooking?.status === 'cancelled'}
                            >
                                Update Status
                            </Button>
                            <Button
                                onClick={() => handleDownloadInvoice(selectedBooking)}
                                leftIcon={<FaDownload />}
                            >
                                Download Invoice
                            </Button>
                            <Button onClick={bookingDetails.onClose}>Close</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Status Update Modal */}
            <Modal isOpen={statusUpdateModal.isOpen} onClose={statusUpdateModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Booking Status</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        {selectedBooking && (
                            <VStack spacing={4}>
                                <Text>
                                    Update status for booking #{selectedBooking.bookingId} - {selectedBooking.course?.title}
                                </Text>

                                <FormControl>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Select>
                                </FormControl>

                                {newStatus === 'cancelled' && (
                                    <Alert status="warning" borderRadius="md">
                                        <AlertIcon />
                                        <Text fontSize="sm">
                                            Cancelling a booking may trigger a refund process according to your refund policy.
                                            Make sure to follow up with the student if necessary.
                                        </Text>
                                    </Alert>
                                )}
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={statusUpdateModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme={newStatus === 'cancelled' ? 'red' : 'blue'}
                            onClick={handleStatusUpdate}
                            isLoading={updateStatusMutation.isLoading}
                            loadingText="Updating"
                        >
                            {newStatus === 'cancelled' ? 'Cancel Booking' : 'Update Status'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default BookingsPage;