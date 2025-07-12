import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Input,
    Button,
    VStack,
    HStack,
    Icon,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast,
    Divider,
    Alert,
    AlertIcon,
    Grid,
    GridItem,
    Badge,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { FaCertificate, FaSearch, FaQrcode, FaCheck, FaTimes } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { verifyCertificate } from '../api/certificates';

const VerifyCertificatePage = () => {
    const [certificateNumber, setCertificateNumber] = useState('');
    const [error, setError] = useState('');
    const toast = useToast();

    const { mutate, isLoading, data: certificate } = useMutation(
        (number) => verifyCertificate(number),
        {
            onSuccess: (data) => {
                toast({
                    title: 'Certificate verified',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setError('');
            },
            onError: (error) => {
                setError(error.message || 'Certificate not found or invalid');
                toast({
                    title: 'Verification failed',
                    description: error.message || 'Certificate not found or invalid',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!certificateNumber.trim()) {
            setError('Please enter a certificate number');
            return;
        }

        mutate(certificateNumber.trim());
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Icon as={FaCertificate} boxSize={12} color="blue.500" mb={4} />
                    <Heading mb={2}>Certificate Verification</Heading>
                    <Text color="gray.600" maxW="600px" mx="auto">
                        Enter the certificate number to verify its authenticity and view details of the certificate.
                    </Text>
                </Box>

                <Box
                    p={8}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="sm"
                    borderWidth="1px"
                >
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={!!error}>
                            <FormLabel htmlFor="certificateNumber">Certificate Number</FormLabel>
                            <HStack>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={FaSearch} color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                        id="certificateNumber"
                                        placeholder="Enter certificate number e.g. CERT-123456"
                                        value={certificateNumber}
                                        onChange={(e) => setCertificateNumber(e.target.value)}
                                    />
                                </InputGroup>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    isLoading={isLoading}
                                    loadingText="Verifying"
                                    width="180px"
                                >
                                    Verify Certificate
                                </Button>
                            </HStack>
                            {error && <FormErrorMessage>{error}</FormErrorMessage>}
                        </FormControl>
                    </form>

                    <Divider my={8} />

                    <HStack justify="center" mb={6} spacing={4}>
                        <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                            <Icon as={FaSearch} boxSize={6} color="blue.500" mb={2} />
                            <Text fontWeight="medium">Enter Certificate Number</Text>
                        </Box>
                        <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                            <Icon as={FaQrcode} boxSize={6} color="blue.500" mb={2} />
                            <Text fontWeight="medium">Or Scan QR Code</Text>
                        </Box>
                    </HStack>

                    {certificate && (
                        <Box mt={6}>
                            <Alert
                                status="success"
                                variant="subtle"
                                mb={6}
                                borderRadius="md"
                            >
                                <AlertIcon />
                                This certificate is valid and has been verified successfully.
                            </Alert>

                            <Box p={6} borderWidth="1px" borderRadius="lg" bg="gray.50">
                                <Heading size="md" mb={4}>Certificate Information</Heading>

                                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                                    <GridItem>
                                        <VStack spacing={4} align="stretch">
                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Certificate Number:</Text>
                                                <Text>{certificate.certificateNumber}</Text>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Student Name:</Text>
                                                <Text>{certificate.student?.name}</Text>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Course:</Text>
                                                <Text>{certificate.course?.title}</Text>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Instructor:</Text>
                                                <Text>{certificate.course?.instructor?.name}</Text>
                                            </HStack>
                                        </VStack>
                                    </GridItem>

                                    <GridItem>
                                        <VStack spacing={4} align="stretch">
                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Issue Date:</Text>
                                                <Text>{formatDate(certificate.issueDate)}</Text>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Completion Date:</Text>
                                                <Text>{formatDate(certificate.completionDate)}</Text>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Status:</Text>
                                                <Badge colorScheme="green">Valid</Badge>
                                            </HStack>

                                            <HStack justify="space-between">
                                                <Text fontWeight="bold">Verification Date:</Text>
                                                <Text>{new Date().toLocaleDateString()}</Text>
                                            </HStack>
                                        </VStack>
                                    </GridItem>
                                </Grid>

                                <Button
                                    colorScheme="blue"
                                    width="full"
                                    mt={6}
                                    onClick={() => window.open(`/certificates/${certificate._id}`, '_blank')}
                                >
                                    View Full Certificate
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box bg="gray.50" p={6} borderRadius="lg" borderWidth="1px">
                    <Heading size="md" mb={4}>Frequently Asked Questions</Heading>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Text fontWeight="bold">How do I find my certificate number?</Text>
                            <Text>Your certificate number can be found on your certificate document, usually in the format "CERT-XXXXXX".</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold">What if my certificate cannot be verified?</Text>
                            <Text>If your certificate cannot be verified, please contact our support team for assistance.</Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold">How can employers verify my certificate?</Text>
                            <Text>Employers can use this same verification tool by entering your certificate number or scanning the QR code on your certificate.</Text>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default VerifyCertificatePage;