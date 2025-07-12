import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    VStack,
    HStack,
    Divider,
    Icon,
} from '@chakra-ui/react';
import { FaCheckCircle, FaMedal, FaStamp } from 'react-icons/fa';

const CertificateViewer = ({ certificate }) => {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            position="relative"
            p={8}
            bgGradient="linear(to-br, white, blue.50)"
            backgroundSize="cover"
            boxShadow="md"
        >
            {/* Certificate Background Pattern */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.05}
                backgroundImage="url('https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')"
                backgroundSize="cover"
                backgroundPosition="center"
                borderRadius="lg"
            />

            {/* Certificate Content */}
            <VStack spacing={6} position="relative" align="center" py={4}>
                {/* Header */}
                <Flex direction="column" align="center">
                    <Image
                        src="/logo.png"
                        alt="CourseHub Logo"
                        height="50px"
                        mb={3}
                        fallbackSrc="https://via.placeholder.com/150x50?text=CourseHub"
                    />
                    <Text textTransform="uppercase" letterSpacing="wide" color="gray.500" fontSize="sm">
                        Certificate of Completion
                    </Text>
                    <Heading size="xl" mt={4} mb={2} textAlign="center" fontFamily="serif">
                        Certificate of Achievement
                    </Heading>
                </Flex>

                {/* Main Text */}
                <VStack spacing={4} maxW="700px" textAlign="center">
                    <Text fontSize="lg">This is to certify that</Text>
                    <Heading size="lg" fontFamily="cursive" color="blue.700">
                        {certificate.student?.name || 'Student Name'}
                    </Heading>
                    <Text fontSize="lg">has successfully completed</Text>
                    <Heading size="md" fontWeight="semibold">
                        {certificate.course?.title || 'Course Title'}
                    </Heading>
                    <Text fontSize="md" maxW="500px" color="gray.600">
                        {certificate.course?.description || 'Course description would appear here.'}
                    </Text>
                </VStack>

                {/* Details */}
                <VStack spacing={1} mb={2}>
                    <Text>with a grade of</Text>
                    <Heading size="md" color="green.600">
                        {certificate.grade || 'PASS'}
                    </Heading>
                </VStack>

                <Divider w="70%" borderColor="gray.300" />

                {/* Signatures */}
                <Flex
                    justify="space-between"
                    w="full"
                    maxW="700px"
                    mt={6}
                    px={8}
                    flexDir={{ base: 'column', md: 'row' }}
                    align="center"
                    textAlign="center"
                >
                    <VStack>
                        <Box borderBottom="1px solid" borderColor="gray.400" px={12} py={2}>
                            {certificate.instructor?.signature ? (
                                <Image
                                    src={certificate.instructor.signature}
                                    alt="Instructor Signature"
                                    h="40px"
                                />
                            ) : (
                                <Text fontFamily="cursive" fontSize="xl">John Smith</Text>
                            )}
                        </Box>
                        <Text fontWeight="medium" mt={1}>
                            {certificate.course?.instructor?.name || 'Instructor Name'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">Instructor</Text>
                    </VStack>

                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        my={{ base: 6, md: 0 }}
                    >
                        <Icon as={FaMedal} boxSize={16} color="gold" />
                    </Box>

                    <VStack>
                        <Box borderBottom="1px solid" borderColor="gray.400" px={12} py={2}>
                            {certificate.platformSignature ? (
                                <Image
                                    src={certificate.platformSignature}
                                    alt="Platform Signature"
                                    h="40px"
                                />
                            ) : (
                                <Text fontFamily="cursive" fontSize="xl">Sarah Johnson</Text>
                            )}
                        </Box>
                        <Text fontWeight="medium" mt={1}>Sarah Johnson</Text>
                        <Text fontSize="sm" color="gray.600">Platform Director</Text>
                    </VStack>
                </Flex>

                {/* Footer */}
                <HStack spacing={8} mt={4}>
                    <VStack>
                        <Text fontSize="xs" color="gray.500">ISSUED ON</Text>
                        <Text fontWeight="medium">{formatDate(certificate.issueDate)}</Text>
                    </VStack>

                    <Box position="relative">
                        <Icon
                            as={FaStamp}
                            boxSize={16}
                            color="blue.600"
                            opacity={0.8}
                        />
                        <Icon
                            as={FaCheckCircle}
                            boxSize={6}
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            color="white"
                        />
                    </Box>

                    <VStack>
                        <Text fontSize="xs" color="gray.500">CERTIFICATE ID</Text>
                        <Text fontWeight="medium">{certificate.certificateNumber}</Text>
                    </VStack>
                </HStack>

                <Text mt={4} fontSize="xs" color="gray.500">
                    Verify this certificate at coursehub.com/verify-certificate
                </Text>
            </VStack>
        </Box>
    );
};

export default CertificateViewer;