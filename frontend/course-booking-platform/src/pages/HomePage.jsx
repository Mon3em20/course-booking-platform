import React from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';

import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    SimpleGrid,
    Image,
    Flex,
    Avatar,
    VStack,
    HStack,
    Icon,
    Divider,
    Badge,
    Input,
    InputGroup,
    InputRightElement,
    Stat,
    StatLabel,
    StatNumber,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
    FaSearch,
    FaLaptopCode,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaCertificate,
    FaUsers,
    FaRegLightbulb,
    FaChartLine,
    FaShieldAlt,
} from 'react-icons/fa';
import FeaturedCourses from '../components/home/FeaturedCourses';

const HomePage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    // Categories for the category section
    const categories = [
        { name: 'Programming', icon: FaLaptopCode, color: 'blue.500', count: 120 },
        { name: 'Business', icon: FaChartLine, color: 'green.500', count: 85 },
        { name: 'Design', icon: FaRegLightbulb, color: 'purple.500', count: 64 },
        { name: 'Marketing', icon: FaUsers, color: 'red.500', count: 76 },
        { name: 'Personal Development', icon: FaUserGraduate, color: 'orange.500', count: 92 },
        { name: 'Technology', icon: FaShieldAlt, color: 'cyan.500', count: 105 },
    ];

    // Stats for the stats section
    const stats = [
        { label: 'Students', value: '50,000+' },
        { label: 'Courses', value: '500+' },
        { label: 'Instructors', value: '200+' },
        { label: 'Countries', value: '30+' },
    ];

    // Testimonial data
    const testimonials = [
        {
            id: 1,
            text: "CourseHub completely transformed my career path. The courses were comprehensive yet easy to follow. I went from knowing nothing about web development to landing a junior developer position in just 6 months!",
            name: "Sarah Johnson",
            role: "Front-end Developer",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
            id: 2,
            text: "The instructor support is amazing. Whenever I had questions, they were answered within hours. The community is also very helpful and supportive.",
            name: "Michael Chen",
            role: "Data Scientist",
            avatar: "https://randomuser.me/api/portraits/men/44.jpg"
        },
        {
            id: 3,
            text: "I've taken courses on other platforms, but CourseHub's project-based learning approach really helped me apply what I learned immediately in my job.",
            name: "Priya Sharma",
            role: "Product Manager",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                bg="blue.600"
                color="white"
                py={{ base: 12, md: 24 }}
                position="relative"
                overflow="hidden"
            >
                {/* Background Pattern */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    opacity={0.1}
                    bgImage="url('https://www.transparenttextures.com/patterns/cubes.png')"
                />

                <Container maxW="container.xl" position="relative">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
                        <Box>
                            <Badge
                                colorScheme="whiteAlpha"
                                fontSize="sm"
                                px={3}
                                py={1}
                                mb={4}
                                borderRadius="full"
                            >
                                Learn Anywhere, Anytime
                            </Badge>

                            <Heading
                                as="h1"
                                size="3xl"
                                mb={6}
                                fontWeight="bold"
                                lineHeight="shorter"
                            >
                                Discover Your Potential with Expert-Led Courses
                            </Heading>

                            <Text fontSize="xl" mb={8}>
                                Join thousands of learners and enhance your skills with our diverse range of courses taught by industry experts.
                            </Text>

                            <InputGroup size="lg" mb={8} maxW="500px">
                                <Input
                                    placeholder="What do you want to learn?"
                                    bg="white"
                                    color="gray.800"
                                    _placeholder={{ color: 'gray.500' }}
                                    borderRadius="full"
                                    pr="4.5rem"
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        colorScheme="blue"
                                        borderRadius="full"
                                        as={RouterLink}
                                        to="/courses"
                                        mr={1}
                                    >
                                        <FaSearch />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>

                            <HStack spacing={4}>
                                <Button
                                    as={RouterLink}
                                    to="/courses"
                                    size="lg"
                                    colorScheme="whiteAlpha"
                                    borderRadius="full"
                                    px={8}
                                >
                                    Browse Courses
                                </Button>
                                <Button
                                    as={RouterLink}
                                    to="/register"
                                    size="lg"
                                    colorScheme="white"
                                    variant="outline"
                                    borderRadius="full"
                                    px={8}
                                >
                                    Sign Up Free
                                </Button>
                            </HStack>
                        </Box>

                        {!isMobile && (
                            <Box>
                                <Image
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                                    alt="Students learning"
                                    borderRadius="lg"
                                    shadow="2xl"
                                />
                            </Box>
                        )}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box py={10} bg="blue.50">
                <Container maxW="container.xl">
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5}>
                        {stats.map((stat, index) => (
                            <Stat key={index} p={5} shadow="md" borderRadius="md" bg="white">
                                <StatNumber fontSize="3xl" fontWeight="bold" color="blue.600">
                                    {stat.value}
                                </StatNumber>
                                <StatLabel fontSize="lg">{stat.label}</StatLabel>
                            </Stat>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Featured Courses Section */}
            <Box py={16}>
                <Container maxW="container.xl">
                    <VStack spacing={4} mb={10} textAlign="center">
                        <Heading as="h2" size="xl">Featured Courses</Heading>
                        <Text fontSize="lg" color="gray.600" maxW="2xl">
                            Explore our most popular courses with highest ratings and enrollment
                        </Text>
                    </VStack>

                    <ErrorBoundary>
                        <FeaturedCourses />
                    </ErrorBoundary>

                    <Box textAlign="center" mt={10}>
                        <Button
                            as={RouterLink}
                            to="/courses"
                            size="lg"
                            colorScheme="blue"
                            borderRadius="full"
                            px={8}
                        >
                            View All Courses
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Category Section */}
            <Box py={16} bg="gray.50">
                <Container maxW="container.xl">
                    <VStack spacing={4} mb={10} textAlign="center">
                        <Heading as="h2" size="xl">Browse Courses by Category</Heading>
                        <Text fontSize="lg" color="gray.600" maxW="2xl">
                            Find the perfect course in your field of interest
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={6}>
                        {categories.map((category, index) => (
                            <Box
                                key={index}
                                as={RouterLink}
                                to={`/courses?category=${category.name}`}
                                bg="white"
                                p={6}
                                borderRadius="lg"
                                shadow="md"
                                textAlign="center"
                                transition="transform 0.2s, box-shadow 0.2s"
                                _hover={{
                                    transform: "translateY(-5px)",
                                    shadow: "lg",
                                    textDecoration: "none",
                                }}
                            >
                                <Icon as={category.icon} boxSize={10} color={category.color} mb={4} />
                                <Text fontWeight="bold" mb={1}>{category.name}</Text>
                                <Text fontSize="sm" color="gray.500">{category.count} courses</Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Box py={16}>
                <Container maxW="container.xl">
                    <VStack spacing={4} mb={10} textAlign="center">
                        <Heading as="h2" size="xl">How CourseHub Works</Heading>
                        <Text fontSize="lg" color="gray.600" maxW="2xl">
                            Follow these simple steps to start your learning journey
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                        <Box textAlign="center">
                            <Flex
                                justify="center"
                                align="center"
                                w={16}
                                h={16}
                                borderRadius="full"
                                bg="blue.500"
                                color="white"
                                mx="auto"
                                mb={4}
                            >
                                <Icon as={FaSearch} boxSize={6} />
                            </Flex>
                            <Heading size="md" mb={2}>Find Your Course</Heading>
                            <Text color="gray.600">
                                Browse our extensive library of courses across various categories and skill levels.
                            </Text>
                        </Box>

                        <Box textAlign="center">
                            <Flex
                                justify="center"
                                align="center"
                                w={16}
                                h={16}
                                borderRadius="full"
                                bg="blue.500"
                                color="white"
                                mx="auto"
                                mb={4}
                            >
                                <Icon as={FaChalkboardTeacher} boxSize={6} />
                            </Flex>
                            <Heading size="md" mb={2}>Learn from Experts</Heading>
                            <Text color="gray.600">
                                Engage with high-quality content created by industry professionals and expert instructors.
                            </Text>
                        </Box>

                        <Box textAlign="center">
                            <Flex
                                justify="center"
                                align="center"
                                w={16}
                                h={16}
                                borderRadius="full"
                                bg="blue.500"
                                color="white"
                                mx="auto"
                                mb={4}
                            >
                                <Icon as={FaCertificate} boxSize={6} />
                            </Flex>
                            <Heading size="md" mb={2}>Earn a Certificate</Heading>
                            <Text color="gray.600">
                                Complete your course to receive a certificate that showcases your new skills to employers.
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box py={16} bg="blue.50">
                <Container maxW="container.xl">
                    <VStack spacing={4} mb={10} textAlign="center">
                        <Heading as="h2" size="xl">What Our Students Say</Heading>
                        <Text fontSize="lg" color="gray.600" maxW="2xl">
                            Hear from our community of learners about their experiences
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                        {testimonials.map((testimonial) => (
                            <Box
                                key={testimonial.id}
                                bg="white"
                                p={6}
                                borderRadius="lg"
                                shadow="md"
                                position="relative"
                            >
                                <Icon
                                    as={FaQuote}
                                    position="absolute"
                                    top={4}
                                    right={4}
                                    boxSize={8}
                                    color="blue.100"
                                />
                                <Text fontSize="md" mb={4}>
                                    {testimonial.text}
                                </Text>
                                <Divider mb={4} />
                                <Flex align="center">
                                    <Avatar name={testimonial.name} src={testimonial.avatar} mr={3} />
                                    <Box>
                                        <Text fontWeight="bold">{testimonial.name}</Text>
                                        <Text fontSize="sm" color="gray.500">{testimonial.role}</Text>
                                    </Box>
                                </Flex>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box py={16}>
                <Container maxW="container.md" textAlign="center">
                    <Heading as="h2" size="xl" mb={4}>
                        Ready to Start Your Learning Journey?
                    </Heading>
                    <Text fontSize="lg" color="gray.600" mb={8}>
                        Join thousands of students and transform your career with in-demand skills.
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Button
                            as={RouterLink}
                            to="/register"
                            size="lg"
                            height="60px"
                            colorScheme="blue"
                            borderRadius="md"
                        >
                            Sign Up for Free
                        </Button>
                        <Button
                            as={RouterLink}
                            to="/courses"
                            size="lg"
                            height="60px"
                            colorScheme="blue"
                            variant="outline"
                            borderRadius="md"
                        >
                            Browse Courses
                        </Button>
                    </SimpleGrid>
                </Container>
            </Box>
        </Box>
    );
};

// Custom FaQuote icon component
const FaQuote = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"></path>
        </svg>
    );
};

export default HomePage;