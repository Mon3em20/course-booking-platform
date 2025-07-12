import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    VStack,
    HStack,
    Icon,
    useToast,
    Flex,
    Divider,
    Select,
    Alert,
    AlertIcon,
    FormErrorMessage,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const toast = useToast();

    // Contact form validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
        department: Yup.string().required('Please select a department')
    });

    // Contact form handling
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
            department: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true);

            // Simulate API call
            try {
                // Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                setIsSuccess(true);
                formik.resetForm();

                toast({
                    title: "Message sent successfully",
                    description: "We'll get back to you as soon as possible.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: "Error sending message",
                    description: "Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <Container maxW="container.xl" py={10}>
            {/* Hero Section */}
            <Box textAlign="center" mb={12}>
                <Heading as="h1" size="2xl" mb={4}>
                    Contact Us
                </Heading>
                <Text fontSize="xl" maxW="2xl" mx="auto" color="gray.600">
                    Have questions about our courses or platform? We're here to help! Get in touch with our team for support, feedback, or partnership inquiries.
                </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={16}>
                {/* Contact Form */}
                <Box>
                    <VStack align="stretch" spacing={6} p={8} bg="white" borderRadius="lg" boxShadow="md">
                        <Heading as="h2" size="lg">
                            Send us a Message
                        </Heading>

                        {isSuccess && (
                            <Alert status="success" mb={4} borderRadius="md">
                                <AlertIcon />
                                Your message has been sent. We'll respond as soon as possible.
                            </Alert>
                        )}

                        <form onSubmit={formik.handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl
                                    id="name"
                                    isInvalid={formik.touched.name && formik.errors.name}
                                >
                                    <FormLabel>Full Name</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
                                        {...formik.getFieldProps('name')}
                                    />
                                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="email"
                                    isInvalid={formik.touched.email && formik.errors.email}
                                >
                                    <FormLabel>Email Address</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        {...formik.getFieldProps('email')}
                                    />
                                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="department"
                                    isInvalid={formik.touched.department && formik.errors.department}
                                >
                                    <FormLabel>Department</FormLabel>
                                    <Select
                                        placeholder="Select department"
                                        name="department"
                                        {...formik.getFieldProps('department')}
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="sales">Sales & Billing</option>
                                        <option value="partnership">Partnerships</option>
                                        <option value="careers">Careers</option>
                                    </Select>
                                    <FormErrorMessage>{formik.errors.department}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="subject"
                                    isInvalid={formik.touched.subject && formik.errors.subject}
                                >
                                    <FormLabel>Subject</FormLabel>
                                    <Input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject of your message"
                                        {...formik.getFieldProps('subject')}
                                    />
                                    <FormErrorMessage>{formik.errors.subject}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="message"
                                    isInvalid={formik.touched.message && formik.errors.message}
                                >
                                    <FormLabel>Message</FormLabel>
                                    <Textarea
                                        name="message"
                                        placeholder="Your message..."
                                        rows={5}
                                        {...formik.getFieldProps('message')}
                                    />
                                    <FormErrorMessage>{formik.errors.message}</FormErrorMessage>
                                </FormControl>

                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    width="full"
                                    mt={4}
                                    type="submit"
                                    isLoading={isSubmitting}
                                    loadingText="Sending"
                                >
                                    Send Message
                                </Button>
                            </VStack>
                        </form>
                    </VStack>
                </Box>

                {/* Contact Information */}
                <Box>
                    <VStack align="stretch" spacing={8}>
                        <Box p={8} bg="white" borderRadius="lg" boxShadow="md">
                            <Heading as="h2" size="lg" mb={6}>
                                Contact Information
                            </Heading>

                            <VStack align="stretch" spacing={6}>
                                <HStack>
                                    <Flex
                                        align="center"
                                        justify="center"
                                        bg="blue.50"
                                        color="blue.500"
                                        borderRadius="full"
                                        boxSize={12}
                                        flexShrink={0}
                                    >
                                        <Icon as={FaMapMarkerAlt} boxSize={5} />
                                    </Flex>
                                    <Box>
                                        <Text fontWeight="bold">Our Location</Text>
                                        <Text>123 Education Street, Tech City, CA 12345</Text>
                                    </Box>
                                </HStack>

                                <HStack>
                                    <Flex
                                        align="center"
                                        justify="center"
                                        bg="blue.50"
                                        color="blue.500"
                                        borderRadius="full"
                                        boxSize={12}
                                        flexShrink={0}
                                    >
                                        <Icon as={FaPhone} boxSize={5} />
                                    </Flex>
                                    <Box>
                                        <Text fontWeight="bold">Phone Number</Text>
                                        <Text>+1 (555) 123-4567</Text>
                                    </Box>
                                </HStack>

                                <HStack>
                                    <Flex
                                        align="center"
                                        justify="center"
                                        bg="blue.50"
                                        color="blue.500"
                                        borderRadius="full"
                                        boxSize={12}
                                        flexShrink={0}
                                    >
                                        <Icon as={FaEnvelope} boxSize={5} />
                                    </Flex>
                                    <Box>
                                        <Text fontWeight="bold">Email Address</Text>
                                        <Text>support@coursehub.com</Text>
                                    </Box>
                                </HStack>

                                <HStack>
                                    <Flex
                                        align="center"
                                        justify="center"
                                        bg="blue.50"
                                        color="blue.500"
                                        borderRadius="full"
                                        boxSize={12}
                                        flexShrink={0}
                                    >
                                        <Icon as={FaClock} boxSize={5} />
                                    </Flex>
                                    <Box>
                                        <Text fontWeight="bold">Office Hours</Text>
                                        <Text>Monday - Friday: 9:00 AM - 5:00 PM</Text>
                                        <Text>Saturday: 10:00 AM - 2:00 PM</Text>
                                        <Text>Sunday: Closed</Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </Box>

                        <Box p={8} bg="white" borderRadius="lg" boxShadow="md">
                            <Heading as="h3" size="md" mb={4}>
                                Connect With Us
                            </Heading>

                            <HStack spacing={4}>
                                <Button leftIcon={<FaFacebook />} colorScheme="facebook" variant="solid">
                                    Facebook
                                </Button>
                                <Button leftIcon={<FaTwitter />} colorScheme="twitter" variant="solid">
                                    Twitter
                                </Button>
                                <Button leftIcon={<FaInstagram />} colorScheme="pink" variant="solid">
                                    Instagram
                                </Button>
                                <Button leftIcon={<FaLinkedin />} colorScheme="linkedin" variant="solid">
                                    LinkedIn
                                </Button>
                            </HStack>
                        </Box>

                        <Box p={8} bg="blue.500" color="white" borderRadius="lg" boxShadow="md">
                            <Heading as="h3" size="md" mb={4}>
                                Need Immediate Assistance?
                            </Heading>
                            <Text mb={4}>
                                Our support team is available via live chat during business hours. Click the chat button in the bottom right corner of your screen to start a conversation.
                            </Text>
                            <Button colorScheme="whiteAlpha" size="lg">
                                Start Live Chat
                            </Button>
                        </Box>
                    </VStack>
                </Box>
            </SimpleGrid>

            {/* Google Maps */}
            <Box mb={16} borderRadius="lg" overflow="hidden" boxShadow="md" height="400px">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30594994064!2d-74.25986548248684!3d40.697149422055666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1643825056458!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="CourseHub location"
                ></iframe>
            </Box>

            {/* FAQ Link */}
            <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                <Heading as="h2" size="lg" mb={4}>
                    Have More Questions?
                </Heading>
                <Text fontSize="lg" maxW="2xl" mx="auto" mb={6}>
                    Check out our Frequently Asked Questions page for answers to common questions about our courses, platform, and policies.
                </Text>
                <Button colorScheme="blue" size="lg" as="a" href="/faq">
                    Visit FAQ Page
                </Button>
            </Box>
        </Container>
    );
};

export default ContactPage;