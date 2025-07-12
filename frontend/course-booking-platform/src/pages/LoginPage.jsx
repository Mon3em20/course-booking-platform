import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box, Container, Heading, FormControl, FormLabel,
    Input, Button, Text, Link, VStack, Divider,
    HStack, useToast, FormErrorMessage, InputGroup,
    InputRightElement, Icon
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Get redirect path from URL params
    const from = location.state?.from || location.search
        ? new URLSearchParams(location.search).get('redirect')
        : '/dashboard';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await login(values.email, values.password);
                toast({
                    title: "Login successful",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate(from || '/dashboard');
            } catch (error) {
                toast({
                    title: "Login failed",
                    description: error.message || "Please check your credentials and try again",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Container maxW="md" py={12}>
            <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
                <VStack spacing={6} align="stretch">
                    <Heading textAlign="center">Log In</Heading>
                    <Text textAlign="center" color="gray.600">
                        Welcome back! Please enter your credentials to continue
                    </Text>

                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl
                                id="email"
                                isInvalid={formik.touched.email && formik.errors.email}
                            >
                                <FormLabel>Email Address</FormLabel>
                                <Input
                                    type="email"
                                    {...formik.getFieldProps('email')}
                                    placeholder="your@email.com"
                                />
                                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                            </FormControl>

                            <FormControl
                                id="password"
                                isInvalid={formik.touched.password && formik.errors.password}
                            >
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...formik.getFieldProps('password')}
                                        placeholder="Enter your password"
                                    />
                                    <InputRightElement width="3rem">
                                        <Button
                                            h="1.5rem"
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                        >
                                            {showPassword ? <Icon as={FaEyeSlash} /> : <Icon as={FaEye} />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                            </FormControl>

                            <Box w="100%" textAlign="right">
                                <Link as={RouterLink} to="/forgot-password" color="blue.500" fontSize="sm">
                                    Forgot password?
                                </Link>
                            </Box>

                            <Button
                                colorScheme="blue"
                                size="lg"
                                width="full"
                                type="submit"
                                isLoading={formik.isSubmitting}
                                loadingText="Logging in"
                            >
                                Log In
                            </Button>
                        </VStack>
                    </form>

                    <Divider />

                    <Button
                        leftIcon={<Icon as={FaGoogle} />}
                        colorScheme="red"
                        variant="outline"
                        width="full"
                    >
                        Continue with Google
                    </Button>

                    <Text textAlign="center">
                        Don't have an account?{' '}
                        <Link as={RouterLink} to="/register" color="blue.500">
                            Register
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default LoginPage;