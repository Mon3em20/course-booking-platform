import React from 'react';
import {
    Box,
    SimpleGrid,
    Image,
    Text,
    HStack,
    VStack,
    Button,
    Icon,
    Flex,
    Badge,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaDownload, FaShare, FaEye } from 'react-icons/fa';

const RecentCertificatesCard = ({ certificates = [] }) => {
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (certificates.length === 0) {
        return (
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
                <Text>You haven't earned any certificates yet. Complete a course to earn one!</Text>
            </Box>
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {certificates.slice(0, 4).map((certificate) => (
                <Box
                    key={certificate._id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg="white"
                    position="relative"
                    overflow="hidden"
                    boxShadow="sm"
                    _hover={{ boxShadow: 'md' }}
                >
                    <Flex justify="space-between" mb={3}>
                        <Badge colorScheme="green" px={2} py={1}>
                            Verified
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                            {formatDate(certificate.issueDate)}
                        </Text>
                    </Flex>

                    <Box
                        p={3}
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        bgGradient="linear(to-r, blue.50, purple.50)"
                        mb={4}
                        position="relative"
                        height="120px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            opacity={0.1}
                            backgroundImage="url('https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')"
                            backgroundSize="cover"
                            backgroundPosition="center"
                        />
                        <VStack spacing={1}>
                            <Text fontSize="lg" fontWeight="bold" textAlign="center">
                                Certificate of Completion
                            </Text>
                            <Text fontSize="sm" textAlign="center">
                                {certificate.certificateNumber}
                            </Text>
                        </VStack>
                    </Box>

                    <Text fontWeight="bold" mb={1}>
                        {certificate.course?.title || "Course Title"}
                    </Text>

                    <Text fontSize="sm" color="gray.600" mb={3} noOfLines={2}>
                        Issued to {certificate.student?.name || "Student Name"}
                    </Text>

                    <HStack spacing={2} mt={4}>
                        <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Icon as={FaEye} />}
                            as={RouterLink}
                            to={`/dashboard/certificates/${certificate._id}`}
                            flex="1"
                        >
                            View
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Icon as={FaDownload} />}
                            flex="1"
                            colorScheme="blue"
                            onClick={() => window.open(`/api/certificates/${certificate._id}/download`, '_blank')}
                        >
                            Download
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Icon as={FaShare} />}
                            flex="1"
                            colorScheme="green"
                        >
                            Share
                        </Button>
                    </HStack>
                </Box>
            ))}
        </SimpleGrid>
    );
};

export default RecentCertificatesCard;