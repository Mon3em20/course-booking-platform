import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box, Container, Heading, FormControl, FormLabel,
    Input, Button, Text, Link, VStack, Divider,
    HStack, useToast, FormErrorMessage, InputGroup,
    InputRightElement, Icon, Radio, RadioGroup, Stack
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student'
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required')
                .min(3, 'Name should be at least 3 characters'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password should be at least 6 characters'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
            role: Yup.string()
                .required('Please select a role')
                .oneOf(['student', 'instructor'], 'Invalid role')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await register(values.name, values.email, values.password, values.role);
                toast({
                    title: "Registration successful",
                    description: "Your account has been created.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/login');
            } catch (error) {
                toast({
                    title: "Registration failed",
                    description: error.message || "An error occurred during registration.",
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
                    <Heading textAlign="center">Create Account</Heading>
                    <Text textAlign="center" color="gray.600">
                        Join our learning community today
                    </Text>

                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl
                                id="name"
                                isInvalid={formik.touched.name && formik.errors.name}
                            >
                                <FormLabel>Full Name</FormLabel>
                                <Input
                                    type="text"
                                    {...formik.getFieldProps('name')}
                                    placeholder="Enter your full name"
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
                                        placeholder="Create a password"
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

                            <FormControl
                                id="confirmPassword"
                                isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            >
                                <FormLabel>Confirm Password</FormLabel>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    {...formik.getFieldProps('confirmPassword')}
                                    placeholder="Confirm your password"
                                />
                                <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                            </FormControl>

                            <FormControl
                                id="role"
                                isInvalid={formik.touched.role && formik.errors.role}
                            >
                                <FormLabel>I want to:</FormLabel>
                                <RadioGroup {...formik.getFieldProps('role')} value={formik.values.role}>
                                    <Stack direction="row" spacing={6}>
                                        <Radio value="student">Learn as a student</Radio>
                                        <Radio value="instructor">Teach as an instructor</Radio>
                                    </Stack>
                                </RadioGroup>
                                <FormErrorMessage>{formik.errors.role}</FormErrorMessage>
                            </FormControl>

                            <Button
                                colorScheme="blue"
                                size="lg"
                                width="full"
                                type="submit"
                                isLoading={formik.isSubmitting}
                                loadingText="Creating Account"
                                mt={2}
                            >
                                Register
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
                        Register with Google
                    </Button>

                    <Text textAlign="center">
                        Already have an account?{' '}
                        <Link as={RouterLink} to="/login" color="blue.500">
                            Log In
                        </Link>
                    </Text>

                    <Text fontSize="xs" textAlign="center" color="gray.500">
                        By registering, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default RegisterPage;