import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { resetPassword } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    // Validate token on mount
    useEffect(() => {
        // Here you would typically verify the token with your API
        // For simplicity, we're assuming it's valid if it exists
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
                .matches(/[0-9]/, 'Password must contain at least one number'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await resetPassword(token, values.password);
                setIsSuccess(true);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to reset password. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (!tokenValid) {
        return (
            <Container maxW="md" py={12}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <Text fontWeight="bold">Invalid or expired reset link</Text>
                        <Text>The password reset link is invalid or has expired. Please request a new one.</Text>
                    </Box>
                </Alert>
                <Box mt={4} textAlign="center">
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate('/forgot-password')}
                    >
                        Request New Reset Link
                    </Button>
                </Box>
            </Container>
        );
    }

    if (isSuccess) {
        return (
            <Container maxW="md" py={12}>
                <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                        <Text fontWeight="bold">Password reset successful!</Text>
                        <Text>Your password has been successfully reset. You will be redirected to the login page shortly.</Text>
                    </Box>
                </Alert>
                <Box mt={4} textAlign="center">
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="md" py={12}>
            <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
                <VStack spacing={6} align="stretch">
                    <Heading textAlign="center">Reset Password</Heading>

                    <Text textAlign="center" color="gray.600">
                        Please enter your new password below.
                    </Text>

                    <form onSubmit={formik.handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl
                                id="password"
                                isInvalid={formik.touched.password && formik.errors.password}
                            >
                                <FormLabel>New Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...formik.getFieldProps('password')}
                                        placeholder="Enter new password"
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            variant="ghost"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                            </FormControl>

                            <FormControl
                                id="confirmPassword"
                                isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            >
                                <FormLabel>Confirm Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...formik.getFieldProps('confirmPassword')}
                                        placeholder="Confirm new password"
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            variant="ghost"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                            </FormControl>

                            <Button
                                colorScheme="blue"
                                width="full"
                                type="submit"
                                isLoading={formik.isSubmitting}
                                loadingText="Resetting Password"
                                mt={2}
                            >
                                Reset Password
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};

export default ResetPasswordPage;