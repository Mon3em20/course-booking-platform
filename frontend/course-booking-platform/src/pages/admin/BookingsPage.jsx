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
    Avatar,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    SimpleGrid,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Divider,
} from '@chakra-ui/react';
import {
    FaSearch,
    FaEllipsisV,
    FaEdit,
    FaTrash,
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaDownload,
    FaMoneyBill,
    FaCalendarAlt,
    FaUserGraduate,
    FaChalkboardTeacher,
} from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    refundBooking,
    exportBookingsData
} from '../../api/admin';

const BookingsPage = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const bookingDetailsModal = useDisclosure();
    const updateStatusModal = useDisclosure();
    const refundModal = useDisclosure();
    const deleteModal = useDisclosure();

    const [newStatus, setNewStatus] = useState('');
    const [refundReason, setRefundReason] = useState('');

    // Get all bookings
    const { data, isLoading, error } = useQuery(
        'adminBookings',
        getAllBookings,
        {
            onError: () => {
                toast({
                    title: 'Error loading bookings',
                    description: 'Failed to load bookings data',
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
                queryClient.invalidateQueries('adminBookings');
                updateStatusModal.onClose();
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

    // Process refund mutation
    const refundMutation = useMutation(
        ({ bookingId, reason }) => refundBooking(bookingId, reason),
        {
            onSuccess: () => {
                toast({
                    title: 'Refund processed',
                    description: 'The refund has been processed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('adminBookings');
                refundModal.onClose();
                setRefundReason('');
            },
            onError: (error) => {
                toast({
                    title: 'Error processing refund',
                    description: error.message || 'Failed to process refund',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Delete booking mutation
    const deleteMutation = useMutation(
        (bookingId) => deleteBooking(bookingId),
        {
            onSuccess: () => {
                toast({
                    title: 'Booking deleted',
                    description: 'The booking has been deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('adminBookings');
                deleteModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error deleting booking',
                    description: error.message || 'Failed to delete booking',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Export bookings data
    const exportMutation = useMutation(
        exportBookingsData,
        {
            onSuccess: (data) => {
                // Create a download link for the CSV data
                const blob = new Blob([data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', 'bookings_export.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                toast({
                    title: 'Export successful',
                    description: 'Bookings data has been exported to CSV',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Export failed',
                    description: error.message || 'Failed to export bookings data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Filter bookings based on search, status, payment, and date
    const getFilteredBookings = () => {
        if (!data?.bookings) return [];

        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);

        return data.bookings.filter(booking => {
            const matchesSearch = searchQuery === '' ||
                booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;

            const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment;

            const bookingDate = new Date(booking.bookingDate);
            const matchesDate = dateFilter === 'all' ||
                (dateFilter === 'today' && bookingDate.toDateString() === today.toDateString()) ||
                (dateFilter === 'week' && bookingDate >= oneWeekAgo) ||
                (dateFilter === 'month' && bookingDate >= oneMonthAgo);

            return matchesSearch && matchesStatus && matchesPayment && matchesDate;
        });
    };

    const filteredBookings = getFilteredBookings();

    // Open booking details modal
    const openBookingDetails = (booking) => {
        setSelectedBooking(booking);
        bookingDetailsModal.onOpen();
    };

    // Open update status modal
    const openUpdateStatusModal = (booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status);
        updateStatusModal.onOpen();
    };

    // Open refund modal
    const openRefundModal = (booking) => {
        setSelectedBooking(booking);
        setRefundReason('');
        refundModal.onOpen();
    };

    // Open delete modal
    const openDeleteModal = (booking) => {
        setSelectedBooking(booking);
        deleteModal.onOpen();
    };

    // Handle update status
    const handleUpdateStatus = () => {
        if (!selectedBooking || !newStatus) return;

        updateStatusMutation.mutate({
            bookingId: selectedBooking._id,
            status: newStatus
        });
    };

    // Handle refund
    const handleRefund = () => {
        if (!selectedBooking || !refundReason.trim()) return;

        refundMutation.mutate({
            bookingId: selectedBooking._id,
            reason: refundReason
        });
    };

    // Handle delete
    const handleDelete = () => {
        if (!selectedBooking) return;
        deleteMutation.mutate(selectedBooking._id);
    };

    // Get badge color based on status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'cancelled':
                return 'red';
            case 'completed':
                return 'blue';
            case 'refunded':
                return 'purple';
            default:
                return 'gray';
        }
    };

    // Get badge color based on payment status
    const getPaymentBadgeColor = (status) => {
        switch (status) {
            case 'paid':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'failed':
                return 'red';
            case 'refunded':
                return 'purple';
            default:
                return 'gray';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    // Get booking counts by status
    const confirmedCount = data?.bookings?.filter(booking => booking.status === 'confirmed').length || 0;
    const pendingCount = data?.bookings?.filter(booking => booking.status === 'pending').length || 0;
    const completedCount = data?.bookings?.filter(booking => booking.status === 'completed').length || 0;
    const cancelledCount = data?.bookings?.filter(booking => booking.status === 'cancelled').length || 0;
    const refundedCount = data?.bookings?.filter(booking => booking.status === 'refunded').length || 0;

    // Calculate total revenue and refunds
    const calculateRevenue = () => {
        if (!data?.bookings) return { revenue: 0, refunds: 0, net: 0 };

        let revenue = 0;
        let refunds = 0;

        data.bookings.forEach(booking => {
            if (booking.paymentStatus === 'paid' && booking.status !== 'refunded') {
                revenue += booking.amount;
            }
            if (booking.status === 'refunded' || booking.paymentStatus === 'refunded') {
                refunds += booking.amount;
            }
        });

        return {
            revenue: revenue.toFixed(2),
            refunds: refunds.toFixed(2),
            net: (revenue - refunds).toFixed(2)
        };
    };

    const financialStats = calculateRevenue();

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading bookings data...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>Bookings Management</Heading>
                <Text color="gray.600">View and manage all course bookings in the system</Text>
            </Box>

            {/* Financial Stats */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center">
                    <StatLabel>Total Bookings</StatLabel>
                    <StatNumber>{data?.bookings?.length || 0}</StatNumber>
                    <StatHelpText mb={0}>All time</StatHelpText>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center" borderLeft="4px solid" borderColor="green.500">
                    <StatLabel>Total Revenue</StatLabel>
                    <StatNumber>${financialStats.revenue}</StatNumber>
                    <StatHelpText mb={0}>Before refunds</StatHelpText>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center" borderLeft="4px solid" borderColor="red.500">
                    <StatLabel>Total Refunds</StatLabel>
                    <StatNumber>${financialStats.refunds}</StatNumber>
                    <StatHelpText mb={0}>{refundedCount} bookings</StatHelpText>
                </Stat>

                <Stat bg="white" p={5} borderRadius="lg" boxShadow="sm" textAlign="center" borderLeft="4px solid" borderColor="blue.500">
                    <StatLabel>Net Revenue</StatLabel>
                    <StatNumber>${financialStats.net}</StatNumber>
                    <StatHelpText mb={0}>After refunds</StatHelpText>
                </Stat>
            </SimpleGrid>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading bookings. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Search and Filter Bar */}
                    <Flex
                        mb={6}
                        flexDir={{ base: "column", md: "row" }}
                        gap={4}
                        justify="space-between"
                    >
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

                        <HStack spacing={{ base: 2, md: 3 }} flexWrap="wrap">
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                size="md"
                                w="auto"
                            >
                                <option value="all">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                            </Select>

                            <Select
                                value={filterPayment}
                                onChange={(e) => setFilterPayment(e.target.value)}
                                size="md"
                                w="auto"
                            >
                                <option value="all">All Payments</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </Select>

                            <Select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                size="md"
                                w="auto"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </Select>

                            <Button
                                leftIcon={<FaDownload />}
                                colorScheme="blue"
                                onClick={() => exportMutation.mutate()}
                                isLoading={exportMutation.isLoading}
                                loadingText="Exporting"
                            >
                                Export
                            </Button>
                        </HStack>
                    </Flex>

                    {/* Bookings Tabs */}
                    <Tabs colorScheme="blue" isLazy>
                        <TabList overflowX="auto" whiteSpace="nowrap">
                            <Tab>All Bookings ({data?.bookings?.length || 0})</Tab>
                            <Tab>Confirmed ({confirmedCount})</Tab>
                            <Tab>Pending ({pendingCount})</Tab>
                            <Tab>Completed ({completedCount})</Tab>
                            <Tab>Cancelled ({cancelledCount})</Tab>
                            <Tab>Refunded ({refundedCount})</Tab>
                        </TabList>

                        <TabPanels>
                            {/* All Bookings Tab */}
                            <TabPanel px={0}>
                                {renderBookingsTable(filteredBookings)}
                            </TabPanel>

                            {/* Confirmed Bookings Tab */}
                            <TabPanel px={0}>
                                {renderBookingsTable(data?.bookings?.filter(booking => booking.status === 'confirmed') || [])}
                            </TabPanel>

                            {/* Pending Bookings Tab */}
                            <TabPanel px={0}>
                                {renderBookingsTable(data?.bookings?.filter(booking => booking.status === 'pending') || [])}
                            </TabPanel>

                            {/* Completed Bookings Tab */}
                            <TabPanel px={0}>
                                {renderBookingsTable(data?.bookings?.filter(booking => booking.status === 'completed') || [])}
                            </TabPanel>

                            {/* Cancelled Bookings Tab */}
                            <TabPanel px={0}>
                                {renderBookingsTable(data?.bookings?.filter(booking => booking.status === 'cancelled') || [])}
                            </TabPanel>

                            {/* Refunded Bookings Tab */}
                            <TabPanel px={0}>
                                {renderBookingsTable(data?.bookings?.filter(booking => booking.status === 'refunded') || [])}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </>
            )}

            {/* Booking Details Modal */}
            <Modal isOpen={bookingDetailsModal.isOpen} onClose={bookingDetailsModal.onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Booking Details</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        {selectedBooking && (
                            <VStack spacing={6} align="stretch">
                                <Box bg="gray.50" p={4} borderRadius="md">
                                    <Flex justify="space-between" align="center" mb={4}>
                                        <Heading size="md">Booking #{selectedBooking.bookingId}</Heading>
                                        <HStack>
                                            <Badge colorScheme={getStatusBadgeColor(selectedBooking.status)}>
                                                {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                            </Badge>
                                            <Badge colorScheme={getPaymentBadgeColor(selectedBooking.paymentStatus)}>
                                                {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                                            </Badge>
                                        </HStack>
                                    </Flex>

                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <Box>
                                            <Text fontWeight="bold" mb={1}>Course:</Text>
                                            <HStack>
                                                <Avatar
                                                    size="xs"
                                                    name={selectedBooking.course?.title}
                                                    src={selectedBooking.course?.imageUrl}
                                                />
                                                <Text>{selectedBooking.course?.title}</Text>
                                            </HStack>
                                        </Box>

                                        <Box>
                                            <Text fontWeight="bold" mb={1}>Student:</Text>
                                            <HStack>
                                                <Avatar
                                                    size="xs"
                                                    name={selectedBooking.student?.name}
                                                    src={selectedBooking.student?.profileImage}
                                                />
                                                <Text>{selectedBooking.student?.name}</Text>
                                            </HStack>
                                        </Box>

                                        <Box>
                                            <Text fontWeight="bold" mb={1}>Instructor:</Text>
                                            <HStack>
                                                <Avatar
                                                    size="xs"
                                                    name={selectedBooking.course?.instructor?.name}
                                                    src={selectedBooking.course?.instructor?.profileImage}
                                                />
                                                <Text>{selectedBooking.course?.instructor?.name}</Text>
                                            </HStack>
                                        </Box>

                                        <Box>
                                            <Text fontWeight="bold" mb={1}>Amount:</Text>
                                            <Text>{formatCurrency(selectedBooking.amount)}</Text>
                                        </Box>
                                    </SimpleGrid>
                                </Box>

                                <Divider />

                                <Box>
                                    <Heading size="sm" mb={3}>Booking Information</Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <Box>
                                            <Text color="gray.600" fontSize="sm">Booking Date:</Text>
                                            <Text>{formatDate(selectedBooking.bookingDate)}</Text>
                                        </Box>

                                        <Box>
                                            <Text color="gray.600" fontSize="sm">Payment Method:</Text>
                                            <Text>{selectedBooking.paymentMethod || 'N/A'}</Text>
                                        </Box>

                                        {selectedBooking.paymentDate && (
                                            <Box>
                                                <Text color="gray.600" fontSize="sm">Payment Date:</Text>
                                                <Text>{formatDate(selectedBooking.paymentDate)}</Text>
                                            </Box>
                                        )}

                                        {selectedBooking.status === 'refunded' && selectedBooking.refundReason && (
                                            <Box>
                                                <Text color="gray.600" fontSize="sm">Refund Reason:</Text>
                                                <Text>{selectedBooking.refundReason}</Text>
                                            </Box>
                                        )}

                                        {selectedBooking.status === 'refunded' && selectedBooking.refundDate && (
                                            <Box>
                                                <Text color="gray.600" fontSize="sm">Refund Date:</Text>
                                                <Text>{formatDate(selectedBooking.refundDate)}</Text>
                                            </Box>
                                        )}
                                    </SimpleGrid>
                                </Box>

                                {selectedBooking.notes && (
                                    <Box>
                                        <Heading size="sm" mb={2}>Notes</Heading>
                                        <Text>{selectedBooking.notes}</Text>
                                    </Box>
                                )}

                                <Divider />

                                <Box>
                                    <Heading size="sm" mb={3}>Actions</Heading>
                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                        <Button
                                            leftIcon={<FaEdit />}
                                            onClick={() => {
                                                bookingDetailsModal.onClose();
                                                openUpdateStatusModal(selectedBooking);
                                            }}
                                            colorScheme="blue"
                                            isDisabled={selectedBooking.status === 'refunded'}
                                        >
                                            Update Status
                                        </Button>

                                        {selectedBooking.paymentStatus === 'paid' && selectedBooking.status !== 'refunded' && (
                                            <Button
                                                leftIcon={<FaMoneyBill />}
                                                onClick={() => {
                                                    bookingDetailsModal.onClose();
                                                    openRefundModal(selectedBooking);
                                                }}
                                                colorScheme="orange"
                                            >
                                                Process Refund
                                            </Button>
                                        )}

                                        <Button
                                            leftIcon={<FaTrash />}
                                            onClick={() => {
                                                bookingDetailsModal.onClose();
                                                openDeleteModal(selectedBooking);
                                            }}
                                            colorScheme="red"
                                        >
                                            Delete Booking
                                        </Button>
                                    </SimpleGrid>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={bookingDetailsModal.onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Update Status Modal */}
            <Modal isOpen={updateStatusModal.isOpen} onClose={updateStatusModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Booking Status</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text mb={4}>
                            Update status for booking #{selectedBooking?.bookingId}
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
                            <Alert status="warning" mt={4}>
                                <AlertIcon />
                                <Text fontSize="sm">
                                    Cancelling a booking may affect student access to the course.
                                </Text>
                            </Alert>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={updateStatusModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleUpdateStatus}
                            isLoading={updateStatusMutation.isLoading}
                            loadingText="Updating"
                        >
                            Update Status
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Refund Modal */}
            <Modal isOpen={refundModal.isOpen} onClose={refundModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Process Refund</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text mb={4}>
                            You are about to process a refund of <strong>{selectedBooking && formatCurrency(selectedBooking.amount)}</strong> for booking #{selectedBooking?.bookingId}.
                        </Text>

                        <FormControl isRequired>
                            <FormLabel>Refund Reason</FormLabel>
                            <Input
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                placeholder="Enter reason for refund"
                            />
                        </FormControl>

                        <Alert status="warning" mt={4}>
                            <AlertIcon />
                            <Text fontSize="sm">
                                Processing a refund will cancel the booking and revoke the student's access to the course. This action cannot be undone.
                            </Text>
                        </Alert>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={refundModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="orange"
                            onClick={handleRefund}
                            isLoading={refundMutation.isLoading}
                            loadingText="Processing"
                            isDisabled={!refundReason.trim()}
                        >
                            Process Refund
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Booking</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text>
                            Are you sure you want to delete booking #{selectedBooking?.bookingId}? This action cannot be undone.
                        </Text>
                        <Alert status="error" mt={4}>
                            <AlertIcon />
                            <Text fontSize="sm">
                                Deleting this booking will permanently remove it from the system, including all associated payment records and course access data.
                            </Text>
                        </Alert>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={deleteModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleDelete}
                            isLoading={deleteMutation.isLoading}
                            loadingText="Deleting"
                        >
                            Delete Booking
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );

    // Helper function to render bookings table
    function renderBookingsTable(bookings) {
        if (!bookings.length) {
            return (
                <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                    <Text>No bookings found.</Text>
                </Box>
            );
        }

        return (
            <Box overflowX="auto">
                <Table variant="simple" borderWidth="1px" borderRadius="lg">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Booking ID</Th>
                            <Th>Course</Th>
                            <Th>Student</Th>
                            <Th>Date</Th>
                            <Th>Amount</Th>
                            <Th>Status</Th>
                            <Th>Payment</Th>
                            <Th width="80px">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bookings.map((booking) => (
                            <Tr key={booking._id}>
                                <Td>{booking.bookingId}</Td>
                                <Td>
                                    <Text noOfLines={2}>{booking.course?.title}</Text>
                                </Td>
                                <Td>
                                    <HStack>
                                        <Avatar size="xs" name={booking.student?.name} src={booking.student?.profileImage} />
                                        <Text>{booking.student?.name}</Text>
                                    </HStack>
                                </Td>
                                <Td>{formatDate(booking.bookingDate)}</Td>
                                <Td>{formatCurrency(booking.amount)}</Td>
                                <Td>
                                    <Badge colorScheme={getStatusBadgeColor(booking.status)}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge colorScheme={getPaymentBadgeColor(booking.paymentStatus)}>
                                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
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
                                                icon={<FaEdit />}
                                                onClick={() => openUpdateStatusModal(booking)}
                                                isDisabled={booking.status === 'refunded'}
                                            >
                                                Update Status
                                            </MenuItem>
                                            {booking.paymentStatus === 'paid' && booking.status !== 'refunded' && (
                                                <MenuItem
                                                    icon={<FaMoneyBill />}
                                                    onClick={() => openRefundModal(booking)}
                                                >
                                                    Process Refund
                                                </MenuItem>
                                            )}
                                            <MenuItem
                                                icon={<FaTrash />}
                                                onClick={() => openDeleteModal(booking)}
                                                color="red.500"
                                            >
                                                Delete
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        );
    }
};

export default BookingsPage;