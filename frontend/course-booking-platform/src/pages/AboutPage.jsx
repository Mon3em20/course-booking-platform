import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Image,
    SimpleGrid,
    VStack,
    HStack,
    Icon,
    Flex,
    Button,
    Divider,
    Avatar,
} from '@chakra-ui/react';
import { FaGraduationCap, FaUsers, FaLaptopCode, FaGlobe, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const AboutPage = () => {
    // Team members data
    const teamMembers = [
        {
            name: 'Sarah Johnson',
            position: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            bio: 'Former education technology director with 15+ years experience in the e-learning industry.'
        },
        {
            name: 'David Chen',
            position: 'CTO',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            bio: 'Software engineer with a passion for building scalable educational platforms.'
        },
        {
            name: 'Maria Rodriguez',
            position: 'Head of Education',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
            bio: 'Former university professor with a PhD in Educational Technology.'
        },
        {
            name: 'James Wilson',
            position: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            bio: 'Digital marketing expert specialized in educational products and services.'
        },
    ];

    // Statistics
    const stats = [
        { number: '50,000+', label: 'Students', icon: FaUsers },
        { number: '200+', label: 'Instructors', icon: FaGraduationCap },
        { number: '500+', label: 'Courses', icon: FaLaptopCode },
        { number: '30+', label: 'Countries', icon: FaGlobe },
    ];

    return (
        <Container maxW="container.xl" py={10}>
            {/* Hero Section */}
            <Box textAlign="center" mb={16}>
                <Heading as="h1" size="2xl" mb={4}>
                    About CourseHub
                </Heading>
                <Text fontSize="xl" maxW="3xl" mx="auto" color="gray.600">
                    Your premier destination for online education and skill development. We connect passionate learners with expert instructors to create a global learning community.
                </Text>
            </Box>

            {/* Our Mission Section */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} mb={16}>
                <Box>
                    <Heading as="h2" size="xl" mb={4}>
                        Our Mission
                    </Heading>
                    <Text fontSize="lg" mb={4}>
                        At CourseHub, we believe that quality education should be accessible to everyone, everywhere. Our mission is to empower individuals to reach their full potential through flexible, affordable, and high-quality learning experiences.
                    </Text>
                    <Text fontSize="lg" mb={4}>
                        Founded in 2022, CourseHub has quickly grown from a small startup to a leading online education platform, serving students from over 30 countries.
                    </Text>
                    <Text fontSize="lg">
                        We partner with industry experts, universities, and organizations to bring the best educational content to our platform, ensuring our students receive up-to-date, relevant knowledge and skills.
                    </Text>
                </Box>
                <Box>
                    <Image
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                        alt="Students learning together"
                        borderRadius="lg"
                        objectFit="cover"
                        height="100%"
                    />
                </Box>
            </SimpleGrid>

            {/* Statistics Section */}
            <Box
                bg="blue.600"
                color="white"
                py={12}
                px={8}
                borderRadius="lg"
                mb={16}
                boxShadow="xl"
            >
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                    {stats.map((stat, index) => (
                        <VStack key={index}>
                            <Icon as={stat.icon} boxSize={12} />
                            <Text fontSize="4xl" fontWeight="bold">{stat.number}</Text>
                            <Text fontSize="xl">{stat.label}</Text>
                        </VStack>
                    ))}
                </SimpleGrid>
            </Box>

            {/* Our Story Section */}
            <Box mb={16}>
                <Heading as="h2" size="xl" mb={8} textAlign="center">
                    Our Story
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                    <VStack
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        align="start"
                        height="100%"
                    >
                        <Box
                            bg="blue.500"
                            color="white"
                            borderRadius="full"
                            w={12}
                            h={12}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={4}
                        >
                            <Text fontWeight="bold">1</Text>
                        </Box>
                        <Heading size="md" mb={2}>The Beginning</Heading>
                        <Text>
                            CourseHub started as a small project in 2022, focused on connecting independent instructors with eager students. The platform initially offered just 10 courses in web development and design.
                        </Text>
                    </VStack>

                    <VStack
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        align="start"
                        height="100%"
                    >
                        <Box
                            bg="blue.500"
                            color="white"
                            borderRadius="full"
                            w={12}
                            h={12}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={4}
                        >
                            <Text fontWeight="bold">2</Text>
                        </Box>
                        <Heading size="md" mb={2}>Growth Phase</Heading>
                        <Text>
                            By 2023, we expanded to over 100 courses across multiple disciplines. We secured our first round of funding and built partnerships with leading industry experts and educational institutions.
                        </Text>
                    </VStack>

                    <VStack
                        p={6}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        align="start"
                        height="100%"
                    >
                        <Box
                            bg="blue.500"
                            color="white"
                            borderRadius="full"
                            w={12}
                            h={12}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            mb={4}
                        >
                            <Text fontWeight="bold">3</Text>
                        </Box>
                        <Heading size="md" mb={2}>Today</Heading>
                        <Text>
                            Now CourseHub hosts over 500 courses, serves more than 50,000 students worldwide, and continues to innovate in the online education space with advanced features and personalized learning paths.
                        </Text>
                    </VStack>
                </SimpleGrid>
            </Box>

            {/* Our Team Section */}
            <Box mb={16}>
                <Heading as="h2" size="xl" mb={8} textAlign="center">
                    Our Team
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                    {teamMembers.map((member, index) => (
                        <VStack
                            key={index}
                            p={6}
                            bg="white"
                            borderRadius="lg"
                            boxShadow="md"
                            align="center"
                            spacing={4}
                        >
                            <Avatar size="xl" src={member.image} name={member.name} />
                            <Heading size="md">{member.name}</Heading>
                            <Text fontWeight="medium" color="blue.600">{member.position}</Text>
                            <Text textAlign="center">{member.bio}</Text>
                            <HStack spacing={4}>
                                <Icon as={FaLinkedin} boxSize={5} color="blue.500" cursor="pointer" />
                                <Icon as={FaTwitter} boxSize={5} color="blue.500" cursor="pointer" />
                            </HStack>
                        </VStack>
                    ))}
                </SimpleGrid>
            </Box>

            {/* Values Section */}
            <Box mb={16}>
                <Heading as="h2" size="xl" mb={8} textAlign="center">
                    Our Values
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <VStack align="start" p={6} bg="white" borderRadius="lg" boxShadow="md">
                        <Heading size="md" color="blue.500" mb={2}>Quality Education</Heading>
                        <Text>
                            We are committed to maintaining high standards in all our courses. Every instructor is vetted, and courses undergo a quality review process before being published on our platform.
                        </Text>
                    </VStack>

                    <VStack align="start" p={6} bg="white" borderRadius="lg" boxShadow="md">
                        <Heading size="md" color="blue.500" mb={2}>Accessibility</Heading>
                        <Text>
                            We believe education should be accessible to everyone. We offer courses at various price points, scholarship opportunities, and ensure our platform is usable by people of all abilities.
                        </Text>
                    </VStack>

                    <VStack align="start" p={6} bg="white" borderRadius="lg" boxShadow="md">
                        <Heading size="md" color="blue.500" mb={2}>Innovation</Heading>
                        <Text>
                            We continuously improve our platform and teaching methodologies, incorporating the latest educational research and technology to enhance the learning experience.
                        </Text>
                    </VStack>

                    <VStack align="start" p={6} bg="white" borderRadius="lg" boxShadow="md">
                        <Heading size="md" color="blue.500" mb={2}>Community</Heading>
                        <Text>
                            We foster a supportive learning environment where students and instructors can connect, collaborate, and grow together. Our community is at the heart of everything we do.
                        </Text>
                    </VStack>
                </SimpleGrid>
            </Box>

            {/* Call to Action */}
            <Box textAlign="center" py={10}>
                <Heading as="h2" size="xl" mb={4}>
                    Ready to Start Learning?
                </Heading>
                <Text fontSize="lg" maxW="2xl" mx="auto" mb={6}>
                    Join our community of learners and instructors today and take the next step in your educational journey.
                </Text>
                <HStack spacing={4} justify="center">
                    <Button as={RouterLink} to="/courses" size="lg" colorScheme="blue">
                        Browse Courses
                    </Button>
                    <Button as={RouterLink} to="/register" size="lg" variant="outline" colorScheme="blue">
                        Create Account
                    </Button>
                </HStack>
            </Box>
        </Container>
    );
};

export default AboutPage;