import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    FormErrorMessage,
    useToast,
    Alert,
    AlertIcon,
    Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuth();
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await forgotPassword(values.email);
                setIsSubmitted(true);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message || 'Something went wrong. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Container maxW="md" py={12}>
            <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
                <VStack spacing={6} align="stretch">
                    <Heading textAlign="center">Forgot Password</Heading>

                    {isSubmitted ? (
                        <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            <Box>
                                <Text>Password reset instructions sent!</Text>
                                <Text fontSize="sm" mt={1}>
                                    Please check your email for instructions on how to reset your password.
                                </Text>
                            </Box>
                        </Alert>
                    ) : (
                        <>
                            <Text textAlign="center" color="gray.600">
                                Enter your email address and we'll send you instructions to reset your password.
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

                                    <Button
                                        colorScheme="blue"
                                        width="full"
                                        type="submit"
                                        isLoading={formik.isSubmitting}
                                        loadingText="Submitting"
                                    >
                                        Send Reset Instructions
                                    </Button>
                                </VStack>
                            </form>
                        </>
                    )}

                    <Box textAlign="center">
                        <Link as={RouterLink} to="/login" color="blue.500">
                            Back to Login
                        </Link>
                    </Box>
                </VStack>
            </Box>
        </Container>
    );
};

export default ForgotPasswordPage;