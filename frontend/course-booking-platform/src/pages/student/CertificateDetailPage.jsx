import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Image,
    Icon,
    useToast,
    Spinner,
    Flex,
    Grid,
    GridItem,
    Divider,
    Badge,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaDownload, FaShare, FaPrint, FaQrcode, FaStamp } from 'react-icons/fa';
import { getCertificateById } from '../../api/certificates';

const CertificateDetailPage = () => {
    const { certificateId } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    const { data: certificate, isLoading, error } = useQuery(
        ['certificate', certificateId],
        () => getCertificateById(certificateId),
        {
            onError: () => {
                toast({
                    title: 'Error loading certificate',
                    description: 'Could not load the certificate details',
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

    if (isLoading) {
        return (
            <Container maxW="container.lg" py={10}>
                <Flex justify="center" align="center" py={10}>
                    <Spinner size="xl" thickness="4px" color="blue.500" />
                </Flex>
            </Container>
        );
    }

    if (error || !certificate) {
        return (
            <Container maxW="container.lg" py={10}>
                <Box textAlign="center" py={10}>
                    <Heading size="md" mb={4}>Certificate not found</Heading>
                    <Text mb={6}>The certificate you're looking for does not exist or you don't have permission to view it.</Text>
                    <Button onClick={() => navigate('/dashboard/certificates')}>
                        Back to Certificates
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.lg" py={8}>
            <HStack mb={6} justify="space-between" align="center">
                <Box>
                    <Heading size="lg">Certificate of Completion</Heading>
                    <Text color="gray.600">
                        {certificate.course?.title}
                    </Text>
                </Box>

                <HStack>
                    <Button leftIcon={<Icon as={FaDownload} />} colorScheme="blue" variant="outline">
                        Download PDF
                    </Button>
                    <Button leftIcon={<Icon as={FaShare} />} colorScheme="green" variant="outline">
                        Share
                    </Button>
                    <Button leftIcon={<Icon as={FaPrint} />} variant="outline">
                        Print
                    </Button>
                </HStack>
            </HStack>

            {/* Certificate Preview */}
            <Box
                p={10}
                bg="white"
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                position="relative"
                overflow="hidden"
                mb={6}
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    opacity={0.05}
                    backgroundImage="url('https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')"
                    backgroundSize="cover"
                    backgroundPosition="center"
                />

                <VStack spacing={6} position="relative">
                    <Box textAlign="center" mb={6}>
                        <Heading size="md" color="gray.500" mb={2}>
                            CourseHub
                        </Heading>
                        <Heading size="xl" mb={2}>
                            Certificate of Completion
                        </Heading>
                        <Text>This certifies that</Text>
                    </Box>

                    <Heading size="xl" fontFamily="cursive">
                        {certificate.student?.name}
                    </Heading>

                    <Text fontSize="lg" textAlign="center" maxW="80%" mx="auto">
                        has successfully completed the course
                        <Text fontWeight="bold" fontSize="xl" mt={2}>
                            {certificate.course?.title}
                        </Text>
                    </Text>

                    <Text>with a duration of {certificate.course?.duration} hours</Text>

                    <Divider my={4} />

                    <Grid templateColumns="repeat(3, 1fr)" width="100%" gap={4} mt={4}>
                        <GridItem textAlign="center">
                            <Text fontSize="sm" color="gray.500">Date of Completion</Text>
                            <Text fontWeight="bold">{formatDate(certificate.completionDate)}</Text>
                        </GridItem>

                        <GridItem textAlign="center" borderLeft="1px" borderRight="1px" borderColor="gray.200" px={4}>
                            <Text fontSize="sm" color="gray.500">Certificate Number</Text>
                            <Text fontWeight="bold">{certificate.certificateNumber}</Text>
                        </GridItem>

                        <GridItem textAlign="center">
                            <Text fontSize="sm" color="gray.500">Instructor</Text>
                            <Text fontWeight="bold">{certificate.course?.instructor?.name}</Text>
                        </GridItem>
                    </Grid>

                    <Flex justify="space-between" width="100%" mt={8}>
                        <Box textAlign="center">
                            <Box mx="auto" mb={2}>
                                <Icon as={FaStamp} boxSize={8} color="blue.500" />
                            </Box>
                            <Text fontSize="sm">Official Seal</Text>
                        </Box>

                        <Box textAlign="center">
                            <Box
                                width="80px"
                                height="80px"
                                bg="gray.100"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mx="auto"
                                mb={2}
                            >
                                <Icon as={FaQrcode} boxSize={10} />
                            </Box>
                            <Text fontSize="sm">Verification QR Code</Text>
                        </Box>
                    </Flex>
                </VStack>
            </Box>

            {/* Certificate Details */}
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
                <GridItem>
                    <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                        <Heading size="md" mb={4}>Certificate Details</Heading>

                        <VStack spacing={4} align="stretch">
                            <Grid templateColumns="1fr 2fr" gap={4}>
                                <Text fontWeight="bold">Student Name:</Text>
                                <Text>{certificate.student?.name}</Text>
                            </Grid>

                            <Grid templateColumns="1fr 2fr" gap={4}>
                                <Text fontWeight="bold">Course Title:</Text>
                                <Text>{certificate.course?.title}</Text>
                            </Grid>

                            <Grid templateColumns="1fr 2fr" gap={4}>
                                <Text fontWeight="bold">Instructor:</Text>
                                <Text>{certificate.course?.instructor?.name}</Text>
                            </Grid>

                            <Grid templateColumns="1fr 2fr" gap={4}>
                                <Text fontWeight="bold">Issue Date:</Text>
                                <Text>{formatDate(certificate.issueDate)}</Text>
                            </Grid>

                            <Grid templateColumns="1fr 2fr" gap={4}>
                                <Text fontWeight="bold">Completion Date:</Text>
                                <Text>{formatDate(certificate.completionDate)}</Text>
                            </Grid>

                            <Grid templateColumns="1fr 2fr" gap={4}>
                                <Text fontWeight="bold">Certificate ID:</Text>
                                <Text>{certificate.certificateNumber}</Text>
                            </Grid>

                            <Grid templateColumns="1fr 2fr" gap={4}>
                                <Text fontWeight="bold">Status:</Text>
                                <Badge colorScheme="green" px={2} py={1}>Verified</Badge>
                            </Grid>
                        </VStack>
                    </Box>
                </GridItem>

                <GridItem>
                    <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                        <Heading size="md" mb={4}>Verification</Heading>
                        <Text mb={4}>
                            This certificate can be verified online using the certificate number or by scanning the QR code.
                        </Text>

                        <VStack spacing={4} align="stretch">
                            <Box
                                width="150px"
                                height="150px"
                                bg="gray.100"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mx="auto"
                            >
                                <Icon as={FaQrcode} boxSize={16} />
                            </Box>

                            <Text fontSize="sm" textAlign="center">
                                Certificate ID: {certificate.certificateNumber}
                            </Text>

                            <Button colorScheme="blue" width="full" mt={2}>
                                Verify Certificate
                            </Button>
                        </VStack>
                    </Box>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default CertificateDetailPage;