import React from 'react';
import {
    Box,
    Container,
    Stack,
    SimpleGrid,
    Text,
    Link,
    VisuallyHidden,
    chakra,
    useColorModeValue,
    Heading,
    Input,
    Button,
    Flex,
    Divider,
    IconButton,
} from '@chakra-ui/react';
import { FaTwitter, FaYoutube, FaInstagram, FaFacebook, FaLinkedin, FaPaperPlane } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../shared/Logo';

const SocialButton = ({ children, label, href }) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

const Footer = () => {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}
            borderTopWidth={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
            <Container as={Stack} maxW={'container.xl'} py={10}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1.5fr' }}
                    spacing={8}
                >
                    <Stack spacing={6}>
                        <Box>
                            <Logo />
                        </Box>
                        <Text fontSize={'sm'}>
                            Your complete course booking platform for online and in-person learning.
                            Find courses from top instructors and enhance your skills.
                        </Text>
                        <Stack direction={'row'} spacing={4}>
                            <SocialButton label={'Twitter'} href={'#'}>
                                <FaTwitter />
                            </SocialButton>
                            <SocialButton label={'YouTube'} href={'#'}>
                                <FaYoutube />
                            </SocialButton>
                            <SocialButton label={'Instagram'} href={'#'}>
                                <FaInstagram />
                            </SocialButton>
                            <SocialButton label={'Facebook'} href={'#'}>
                                <FaFacebook />
                            </SocialButton>
                            <SocialButton label={'LinkedIn'} href={'#'}>
                                <FaLinkedin />
                            </SocialButton>
                        </Stack>
                    </Stack>

                    <Stack align={'flex-start'}>
                        <Heading fontWeight={500} fontSize={'md'} mb={2}>
                            Quick Links
                        </Heading>
                        <Link as={RouterLink} to="/">Home</Link>
                        <Link as={RouterLink} to="/courses">Courses</Link>
                        <Link as={RouterLink} to="/about">About Us</Link>
                        <Link as={RouterLink} to="/contact">Contact</Link>
                        <Link as={RouterLink} to="/faq">FAQ</Link>
                    </Stack>

                    <Stack align={'flex-start'}>
                        <Heading fontWeight={500} fontSize={'md'} mb={2}>
                            For Students
                        </Heading>
                        <Link as={RouterLink} to="/register?role=student">Register as Student</Link>
                        <Link as={RouterLink} to="/dashboard/my-courses">My Courses</Link>
                        <Link as={RouterLink} to="/dashboard/certificates">My Certificates</Link>
                        <Link as={RouterLink} to="/verify-certificate">Verify Certificate</Link>
                        <Link as={RouterLink} to="/help">Help Center</Link>
                    </Stack>

                    <Stack align={'flex-start'}>
                        <Heading fontWeight={500} fontSize={'md'} mb={2}>
                            For Instructors
                        </Heading>
                        <Link as={RouterLink} to="/register?role=instructor">Become an Instructor</Link>
                        <Link as={RouterLink} to="/instructor/courses">Create Course</Link>
                        <Link as={RouterLink} to="/instructor/dashboard">Instructor Dashboard</Link>
                        <Link as={RouterLink} to="/instructor/help">Teaching Resources</Link>
                        <Link as={RouterLink} to="/policies">Policies</Link>
                    </Stack>

                    <Stack align={'flex-start'}>
                        <Heading fontWeight={500} fontSize={'md'} mb={2}>
                            Subscribe to our Newsletter
                        </Heading>
                        <Text fontSize={'sm'}>
                            Stay up to date with the latest courses, news, and special offers
                        </Text>
                        <Flex mt={2} width="100%">
                            <Input
                                placeholder={'Your email address'}
                                bg={useColorModeValue('white', 'gray.800')}
                                border={1}
                                borderColor={useColorModeValue('gray.300', 'gray.500')}
                                borderEndRadius={0}
                                _focus={{
                                    borderColor: 'blue.500',
                                }}
                            />
                            <Button
                                colorScheme="blue"
                                borderStartRadius={0}
                                leftIcon={<FaPaperPlane />}
                            >
                                Subscribe
                            </Button>
                        </Flex>
                    </Stack>
                </SimpleGrid>

                <Divider my={6} />

                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    justify={{ base: 'center', md: 'space-between' }}
                    align={{ base: 'center', md: 'center' }}
                >
                    <Text fontSize="sm">
                        © {new Date().getFullYear()} Course Booking Platform. All rights reserved
                    </Text>
                    <Stack direction={'row'} spacing={6} mt={{ base: 4, md: 0 }}>
                        <Link as={RouterLink} to="/privacy" fontSize="sm">Privacy Policy</Link>
                        <Link as={RouterLink} to="/terms" fontSize="sm">Terms of Service</Link>
                        <Link as={RouterLink} to="/cookies" fontSize="sm">Cookie Policy</Link>
                    </Stack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;