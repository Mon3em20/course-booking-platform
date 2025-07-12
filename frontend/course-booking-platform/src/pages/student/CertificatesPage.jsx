import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Tab,
    Icon,
    Button,
    Flex,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure, Link,
} from '@chakra-ui/react';
import { FaSearch, FaDownload, FaShare, FaEnvelope } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { getStudentCertificates } from '../../api/student';
import RecentCertificatesCard from '../../components/student/RecentCertificatesCard';
import CertificateViewer from '../../components/student/CertificateViewer';

const CertificatesPage = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    const { data, isLoading, error } = useQuery(
        'studentCertificates',
        getStudentCertificates,
        {
            onError: () => {
                toast({
                    title: 'Error loading certificates',
                    description: 'Failed to load your certificates',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Filter certificates based on search query
    const getFilteredCertificates = () => {
        if (!data?.certificates) return [];

        if (!searchQuery) {
            return data.certificates;
        }

        return data.certificates.filter(cert =>
            cert.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // View certificate handler
    const handleViewCertificate = (certificate) => {
        setSelectedCertificate(certificate);
        onOpen();
    };

    // Download certificate handler
    const handleDownloadCertificate = (certificateId) => {
        toast({
            title: 'Downloading certificate',
            description: 'Your certificate is being downloaded',
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
        // In a real app, this would trigger an actual download
        // downloadCertificate(certificateId);
    };

    // Share certificate handler
    const handleShareCertificate = (certificateId) => {
        // In a real app, this would open a share dialog
        toast({
            title: 'Share certificate',
            description: 'Share options would appear here',
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
    };

    // Email certificate handler
    const handleEmailCertificate = (certificateId) => {
        toast({
            title: 'Email certificate',
            description: 'Your certificate will be emailed to you',
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
        // In a real app, this would send an email with the certificate
    };

    // Get completed vs available certificates
    const completedCertificates = data?.certificates || [];
    const availableCertificates = data?.availableCertificates || [];
    const filteredCertificates = getFilteredCertificates();

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading your certificates...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>My Certificates</Heading>
                <Text color="gray.600">View and manage your course completion certificates</Text>
            </Box>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading your certificates. Please try again later.</Text>
                </Alert>
            ) : (
                <>
                    {/* Search input */}
                    <InputGroup mb={6} maxW="500px">
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FaSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search certificates by course name or certificate ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>

                    {/* Tabs for different certificate statuses */}
                    {searchQuery ? (
                        // Search results view
                        <VStack spacing={6} align="stretch">
                            <Heading size="md">
                                Search Results
                                <Text as="span" fontWeight="normal" color="gray.500" ml={2}>
                                    ({filteredCertificates.length} certificates found)
                                </Text>
                            </Heading>

                            {filteredCertificates.length === 0 ? (
                                <Box p={8} textAlign="center" bg="gray.50" borderRadius="md">
                                    <Text>No certificates match your search criteria.</Text>
                                </Box>
                            ) : (
                                <RecentCertificatesCard certificates={filteredCertificates} />
                            )}
                        </VStack>
                    ) : (
                        // Regular tabbed view
                        <Tabs colorScheme="blue" isLazy>
                            <TabList mb={6}>
                                <Tab>Earned Certificates ({completedCertificates.length})</Tab>
                                <Tab>Available to Earn ({availableCertificates.length})</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Earned Certificates Tab */}
                                <TabPanel px={0}>
                                    {completedCertificates.length === 0 ? (
                                        <Box p={8} textAlign="center" bg="gray.50" borderRadius="md">
                                            <Text mb={4}>You haven't earned any certificates yet. Complete a course to receive a certificate.</Text>
                                            <Button
                                                as={RouterLink}
                                                to="/dashboard/my-courses"
                                                colorScheme="blue"
                                            >
                                                Go to My Courses
                                            </Button>
                                        </Box>
                                    ) : (
                                        <VStack spacing={8} align="stretch">
                                            <RecentCertificatesCard certificates={completedCertificates} />
                                        </VStack>
                                    )}
                                </TabPanel>

                                {/* Available Certificates Tab */}
                                <TabPanel px={0}>
                                    {availableCertificates.length === 0 ? (
                                        <Box p={8} textAlign="center" bg="gray.50" borderRadius="md">
                                            <Text mb={4}>You don't have any courses that offer certificates at the moment.</Text>
                                            <Button
                                                as={RouterLink}
                                                to="/courses"
                                                colorScheme="blue"
                                            >
                                                Browse Courses
                                            </Button>
                                        </Box>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                            {availableCertificates.map(course => (
                                                <Box
                                                    key={course._id}
                                                    p={5}
                                                    borderWidth="1px"
                                                    borderRadius="lg"
                                                    bg="white"
                                                    boxShadow="sm"
                                                >
                                                    <Heading size="md" mb={2}>{course.title}</Heading>
                                                    <Text mb={4} color="gray.600">{course.instructor?.name}</Text>

                                                    <HStack mb={4}>
                                                        <Text>Course Progress:</Text>
                                                        <Text fontWeight="bold">
                                                            {course.progress}% Complete
                                                        </Text>
                                                    </HStack>

                                                    <Text fontSize="sm" color="gray.500" mb={4}>
                                                        Complete this course to earn your certificate
                                                    </Text>

                                                    <Button
                                                        as={RouterLink}
                                                        to={`/dashboard/my-courses/${course._id}`}
                                                        colorScheme="blue"
                                                        width="full"
                                                    >
                                                        Continue Course
                                                    </Button>
                                                    <Link as={RouterLink} to={`/certificates/${certificate._id}`}>
                                                        <Button colorScheme="blue" size="sm">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    )}
                </>
            )}

            {/* Certificate Viewer Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Certificate of Completion</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        {selectedCertificate && (
                            <CertificateViewer certificate={selectedCertificate} />
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <HStack spacing={4}>
                            <Button
                                leftIcon={<FaDownload />}
                                onClick={() => handleDownloadCertificate(selectedCertificate?._id)}
                                colorScheme="blue"
                            >
                                Download
                            </Button>
                            <Button
                                leftIcon={<FaShare />}
                                onClick={() => handleShareCertificate(selectedCertificate?._id)}
                                colorScheme="green"
                                variant="outline"
                            >
                                Share
                            </Button>
                            <Button
                                leftIcon={<FaEnvelope />}
                                onClick={() => handleEmailCertificate(selectedCertificate?._id)}
                                variant="outline"
                            >
                                Email to Me
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Close</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default CertificatesPage;