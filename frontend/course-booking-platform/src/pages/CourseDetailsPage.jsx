import React, { useState } from 'react';
import {
    Box,
    Container,
    SimpleGrid,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    VStack,
    HStack,
    List,
    ListItem,
    ListIcon,
    Badge,
    Icon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Divider,
    useToast,
    useDisclosure,
    Spinner,
    Alert,
    AlertIcon,
    Avatar,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    FaCheck,
    FaClock,
    FaUsers,
    FaRegCalendarAlt,
    FaStar,
    FaGlobe,
    FaLaptop,
    FaMobileAlt,
    FaRegFileAlt,
    FaRegPlayCircle,
    FaRegLightbulb,
    FaCertificate,
    FaChalkboardTeacher,
    FaRegClock,
    FaUserGraduate,
} from 'react-icons/fa';
import { getCourse, bookCourse, getCourseReviews } from '../api/courses';
import { useAuth } from '../contexts/AuthContext';
import CourseReviews from '../components/courses/CourseReviews';
import EnrollmentModal from '../components/courses/EnrollmentModal';

const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isAuthenticated, user } = useAuth();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // Get course details
    const { data: course, isLoading, error } = useQuery(
        ['course', courseId],
        () => getCourse(courseId),
        {
            onError: () => {
                toast({
                    title: 'Error loading course',
                    description: 'Unable to load course details. Please try again later.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Book course mutation
    const bookMutation = useMutation(
        (bookingData) => bookCourse(bookingData),
        {
            onSuccess: () => {
                toast({
                    title: 'Enrollment successful',
                    description: 'You have successfully enrolled in this course',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Enrollment failed',
                    description: error.message || 'An error occurred during enrollment',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    // Handle enrollment
    const handleEnroll = () => {
        if (!isAuthenticated) {
            toast({
                title: 'Authentication required',
                description: 'Please sign in to enroll in this course',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        onOpen();
    };

    // Handle enrollment confirmation
    const handleConfirmEnrollment = (data) => {
        setSelectedPaymentMethod(data.paymentMethod);

        const bookingData = {
            courseId,
            paymentMethod: data.paymentMethod,
            // Add any additional booking data here
        };

        bookMutation.mutate(bookingData);
    };

    // Check if user is already enrolled
    const isUserEnrolled = () => {
        if (!isAuthenticated || !course) return false;
        return course.isEnrolled;
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading course details...</Text>
            </Container>
        );
    }

    if (error || !course) {
        return (
            <Container maxW="container.xl" py={10}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Text>Error loading course details. Please try again later.</Text>
                </Alert>
            </Container>
        );
    }

    return (
        <Box bg="gray.50">
            {/* Hero Section */}
            <Box bg="blue.600" color="white" py={12}>
                <Container maxW="container.xl">
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="center">
                        <Box>
                            <Badge colorScheme="yellow" mb={2}>
                                {course.category}
                            </Badge>

                            <Heading as="h1" size="2xl" mb={4}>
                                {course.title}
                            </Heading>

                            <Text fontSize="xl" mb={6}>
                                {course.subtitle || course.description.substring(0, 150) + '...'}
                            </Text>

                            <HStack spacing={6} mb={6} flexWrap="wrap">
                                <HStack>
                                    <Icon as={FaStar} color="yellow.400" />
                                    <Text>
                                        {course.rating?.toFixed(1) || 'New'}
                                        {course.reviewCount ? ` (${course.reviewCount} reviews)` : ''}
                                    </Text>
                                </HStack>

                                <HStack>
                                    <Icon as={FaUsers} />
                                    <Text>{course.enrolledCount || 0} students</Text>
                                </HStack>

                                <HStack>
                                    <Icon as={FaRegClock} />
                                    <Text>{course.duration} hours</Text>
                                </HStack>

                                <HStack>
                                    <Icon as={FaRegCalendarAlt} />
                                    <Text>Last updated {new Date(course.updatedAt).toLocaleDateString()}</Text>
                                </HStack>
                            </HStack>

                            <HStack>
                                <Avatar src={course.instructor?.profileImage} name={course.instructor?.name} size="sm" />
                                <Text>Created by {course.instructor?.name}</Text>
                            </HStack>
                        </Box>

                        <Box>
                            <Box
                                borderRadius="lg"
                                overflow="hidden"
                                bg="white"
                                shadow="xl"
                                mx="auto"
                                maxW="md"
                            >
                                <Image
                                    src={course.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
                                    alt={course.title}
                                    w="100%"
                                    h="250px"
                                    objectFit="cover"
                                />

                                <Box p={6}>
                                    <Flex justify="space-between" align="center" mb={6}>
                                        <Heading size="xl" color="gray.800">
                                            ${course.price?.toFixed(2) || 'Free'}
                                        </Heading>

                                        {course.originalPrice && course.originalPrice > course.price && (
                                            <Text as="s" color="gray.500">
                                                ${course.originalPrice.toFixed(2)}
                                            </Text>
                                        )}
                                    </Flex>

                                    {isUserEnrolled() ? (
                                        <Button
                                            as={RouterLink}
                                            to={`/dashboard/my-courses/${course._id}`}
                                            colorScheme="green"
                                            size="lg"
                                            width="100%"
                                            mb={4}
                                        >
                                            Continue Learning
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleEnroll}
                                            colorScheme="blue"
                                            size="lg"
                                            width="100%"
                                            mb={4}
                                            isLoading={bookMutation.isLoading}
                                            loadingText="Enrolling"
                                        >
                                            Enroll Now
                                        </Button>
                                    )}

                                    <Text fontSize="sm" textAlign="center" color="gray.500" mb={6}>
                                        {course.moneyBackGuarantee ? '30-Day Money-Back Guarantee' : 'This purchase is non-refundable'}
                                    </Text>

                                    <VStack align="start" spacing={3}>
                                        <Heading size="sm">This course includes:</Heading>

                                        <HStack>
                                            <Icon as={FaRegClock} />
                                            <Text>{course.duration} hours of on-demand video</Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={FaRegFileAlt} />
                                            <Text>{course.resources || 5} downloadable resources</Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={FaRegPlayCircle} />
                                            <Text>{course.lectures || 0} lectures</Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={FaGlobe} />
                                            <Text>Full lifetime access</Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={FaMobileAlt} />
                                            <Text>Access on mobile and TV</Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={FaCertificate} />
                                            <Text>Certificate of completion</Text>
                                        </HStack>
                                    </VStack>
                                </Box>
                            </Box>
                        </Box>
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxW="container.xl" py={10}>
                <SimpleGrid columns={{ base: 1, lg: 7 }} spacing={8}>
                    {/* Left Column - Course Details */}
                    <Box gridColumn={{ lg: "span 5" }}>
                        <Tabs colorScheme="blue" isLazy>
                            <TabList mb={6} overflowX="auto" whiteSpace="nowrap">
                                <Tab>Overview</Tab>
                                <Tab>Curriculum</Tab>
                                <Tab>Instructor</Tab>
                                <Tab>Reviews</Tab>
                                <Tab>FAQ</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Overview Tab */}
                                <TabPanel px={0}>
                                    <Box mb={8}>
                                        <Heading size="lg" mb={4}>Course Description</Heading>
                                        <Text whiteSpace="pre-line">{course.description}</Text>
                                    </Box>

                                    <Box mb={8}>
                                        <Heading size="lg" mb={4}>What You'll Learn</Heading>
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                            <List spacing={3}>
                                                {course.learningOutcomes?.slice(0, Math.ceil(course.learningOutcomes.length / 2))
                                                    .map((outcome, index) => (
                                                        <ListItem key={index} display="flex">
                                                            <ListIcon as={FaCheck} color="green.500" mt={1} />
                                                            <Text>{outcome}</Text>
                                                        </ListItem>
                                                    ))
                                                }
                                            </List>
                                            <List spacing={3}>
                                                {course.learningOutcomes?.slice(Math.ceil(course.learningOutcomes.length / 2))
                                                    .map((outcome, index) => (
                                                        <ListItem key={index} display="flex">
                                                            <ListIcon as={FaCheck} color="green.500" mt={1} />
                                                            <Text>{outcome}</Text>
                                                        </ListItem>
                                                    ))
                                                }
                                            </List>
                                        </SimpleGrid>
                                    </Box>

                                    <Box mb={8}>
                                        <Heading size="lg" mb={4}>Course Requirements</Heading>
                                        <List spacing={3}>
                                            {course.prerequisites?.map((prerequisite, index) => (
                                                <ListItem key={index} display="flex">
                                                    <ListIcon as={FaCheck} color="green.500" mt={1} />
                                                    <Text>{prerequisite}</Text>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>

                                    <Box mb={8}>
                                        <Heading size="lg" mb={4}>Who This Course is For</Heading>
                                        <List spacing={3}>
                                            {course.targetAudience?.map((audience, index) => (
                                                <ListItem key={index} display="flex">
                                                    <ListIcon as={FaUserGraduate} color="blue.500" mt={1} />
                                                    <Text>{audience}</Text>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </TabPanel>

                                {/* Curriculum Tab */}
                                <TabPanel px={0}>
                                    <Box mb={4}>
                                        <Flex justify="space-between" align="center" mb={6}>
                                            <Heading size="lg">Course Curriculum</Heading>
                                            <HStack>
                                                <Text>{course.lectures || 0} lectures</Text>
                                                <Text>•</Text>
                                                <Text>{course.duration} hours</Text>
                                            </HStack>
                                        </Flex>

                                        <Accordion allowToggle>
                                            {course.curriculum?.map((section, sectionIndex) => (
                                                <AccordionItem key={sectionIndex}>
                                                    <h3>
                                                        <AccordionButton py={4}>
                                                            <Box flex="1" textAlign="left" fontWeight="bold">
                                                                Section {sectionIndex + 1}: {section.title}
                                                            </Box>
                                                            <Text mr={4} color="gray.500">
                                                                {section.lectures?.length || 0} lectures • {section.duration || 0} min
                                                            </Text>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                    </h3>
                                                    <AccordionPanel pb={4} bg="gray.50">
                                                        <List spacing={2}>
                                                            {section.lectures?.map((lecture, lectureIndex) => (
                                                                <ListItem key={lectureIndex} p={2}>
                                                                    <Flex justify="space-between" align="center">
                                                                        <HStack>
                                                                            <Icon as={lecture.type === 'video' ? FaRegPlayCircle : FaRegFileAlt} color="blue.500" />
                                                                            <Text>{lecture.title}</Text>
                                                                        </HStack>
                                                                        <Text fontSize="sm" color="gray.500">{lecture.duration} min</Text>
                                                                    </Flex>
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </Box>
                                </TabPanel>

                                {/* Instructor Tab */}
                                <TabPanel px={0}>
                                    <Box mb={6}>
                                        <Flex direction={{ base: "column", sm: "row" }} align="start" mb={6}>
                                            <Avatar
                                                size="2xl"
                                                name={course.instructor?.name}
                                                src={course.instructor?.profileImage}
                                                mr={{ base: 0, sm: 6 }}
                                                mb={{ base: 4, sm: 0 }}
                                            />
                                            <Box>
                                                <Heading size="lg" mb={2}>{course.instructor?.name}</Heading>
                                                <Text color="gray.600" mb={4}>{course.instructor?.title || "Course Instructor"}</Text>
                                                <HStack spacing={4} mb={4}>
                                                    <HStack>
                                                        <Icon as={FaStar} color="yellow.400" />
                                                        <Text>{course.instructor?.rating?.toFixed(1) || "4.7"} Instructor Rating</Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Icon as={FaRegPlayCircle} />
                                                        <Text>{course.instructor?.courseCount || "5"} Courses</Text>
                                                    </HStack>
                                                    <HStack>
                                                        <Icon as={FaUsers} />
                                                        <Text>{course.instructor?.studentCount || "2,500"} Students</Text>
                                                    </HStack>
                                                </HStack>
                                            </Box>
                                        </Flex>

                                        <Divider mb={6} />

                                        <Text whiteSpace="pre-line">{course.instructor?.bio || "No instructor bio available."}</Text>
                                    </Box>
                                </TabPanel>

                                {/* Reviews Tab */}
                                <TabPanel px={0}>
                                    <CourseReviews courseId={courseId} />
                                </TabPanel>

                                {/* FAQ Tab */}
                                <TabPanel px={0}>
                                    <Box mb={6}>
                                        <Heading size="lg" mb={6}>Frequently Asked Questions</Heading>

                                        <Accordion allowToggle>
                                            {course.faq?.map((item, index) => (
                                                <AccordionItem key={index}>
                                                    <h3>
                                                        <AccordionButton py={4}>
                                                            <Box flex="1" textAlign="left" fontWeight="bold">
                                                                {item.question}
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                    </h3>
                                                    <AccordionPanel pb={4}>
                                                        <Text>{item.answer}</Text>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}

                                            {/* Default FAQs if none provided */}
                                            {(!course.faq || course.faq.length === 0) && (
                                                <>
                                                    <AccordionItem>
                                                        <h3>
                                                            <AccordionButton py={4}>
                                                                <Box flex="1" textAlign="left" fontWeight="bold">
                                                                    Do I get a certificate after completing the course?
                                                                </Box>
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                        </h3>
                                                        <AccordionPanel pb={4}>
                                                            <Text>Yes, you will receive a certificate of completion that you can share on your LinkedIn profile or with potential employers.</Text>
                                                        </AccordionPanel>
                                                    </AccordionItem>

                                                    <AccordionItem>
                                                        <h3>
                                                            <AccordionButton py={4}>
                                                                <Box flex="1" textAlign="left" fontWeight="bold">
                                                                    How long do I have access to the course materials?
                                                                </Box>
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                        </h3>
                                                        <AccordionPanel pb={4}>
                                                            <Text>You'll have lifetime access to all course materials, including any future updates.</Text>
                                                        </AccordionPanel>
                                                    </AccordionItem>

                                                    <AccordionItem>
                                                        <h3>
                                                            <AccordionButton py={4}>
                                                                <Box flex="1" textAlign="left" fontWeight="bold">
                                                                    Can I get a refund if I'm not satisfied?
                                                                </Box>
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                        </h3>
                                                        <AccordionPanel pb={4}>
                                                            <Text>Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within 30 days of purchase.</Text>
                                                        </AccordionPanel>
                                                    </AccordionItem>
                                                </>
                                            )}
                                        </Accordion>
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>

                    {/* Right Column - Mobile CTA (visible on smaller screens) */}
                    <Box
                        display={{ base: 'block', lg: 'none' }}
                        mt={8}
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                    >
                        <Heading size="lg" mb={4}>
                            ${course.price?.toFixed(2) || 'Free'}
                        </Heading>

                        {isUserEnrolled() ? (
                            <Button
                                as={RouterLink}
                                to={`/dashboard/my-courses/${course._id}`}
                                colorScheme="green"
                                size="lg"
                                width="100%"
                            >
                                Continue Learning
                            </Button>
                        ) : (
                            <Button
                                onClick={handleEnroll}
                                colorScheme="blue"
                                size="lg"
                                width="100%"
                                isLoading={bookMutation.isLoading}
                            >
                                Enroll Now
                            </Button>
                        )}
                    </Box>


                </SimpleGrid>
            </Container>

            {/* Related Courses Section (can be added later) */}

            {/* Enrollment Modal */}
            <EnrollmentModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleConfirmEnrollment}
                course={course}
                isLoading={bookMutation.isLoading}
            />
        </Box>
    );
};

export default CourseDetailsPage;