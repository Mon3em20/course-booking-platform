import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    Switch,
    Checkbox,
    Divider,
    useToast,
    useDisclosure,
    IconButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Alert,
    AlertIcon,
    Textarea,
    Card,
    CardHeader,
    CardBody,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaTrash, FaDownload } from 'react-icons/fa';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import {
    changePassword,
    deleteAccount,
    updateInstructorPreferences,
    updatePaymentInfo,
    exportInstructorData
} from '../../api/instructor';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    // Get instructor preferences
    const { data: preferences } = useQuery(
        'instructorPreferences',
        () => {
            // This would be an API call in a real app
            return {
                notificationPreferences: {
                    emailNotifications: true,
                    studentEnrollments: true,
                    courseReviews: true,
                    paymentNotifications: true,
                    marketingEmails: false,
                },
                privacySettings: {
                    showProfileToCourseStudents: true,
                    showSocialLinks: true,
                    allowDirectMessages: true,
                },
                displayPreferences: {
                    courseDisplay: 'grid',
                    themeDarkMode: false,
                    language: 'en',
                },
                paymentInfo: {
                    paypalEmail: user?.email || '',
                    bankName: '',
                    accountNumber: '',
                    swiftCode: '',
                    taxId: '',
                }
            };
        }
    );

    // Password change form
    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string()
                .required('New password is required')
                .min(8, 'Password must be at least 8 characters')
                .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
                .matches(/[0-9]/, 'Password must contain at least one number'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: (values) => {
            passwordMutation.mutate({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
        },
    });

    // Payment info form
    const paymentFormik = useFormik({
        initialValues: {
            paypalEmail: preferences?.paymentInfo?.paypalEmail || '',
            bankName: preferences?.paymentInfo?.bankName || '',
            accountNumber: preferences?.paymentInfo?.accountNumber || '',
            swiftCode: preferences?.paymentInfo?.swiftCode || '',
            taxId: preferences?.paymentInfo?.taxId || '',
        },
        validationSchema: Yup.object({
            paypalEmail: Yup.string().email('Invalid email address'),
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            paymentInfoMutation.mutate(values);
        },
    });

    // State for notification preferences
    const [notificationPrefs, setNotificationPrefs] = useState({
        emailNotifications: preferences?.notificationPreferences?.emailNotifications || true,
        studentEnrollments: preferences?.notificationPreferences?.studentEnrollments || true,
        courseReviews: preferences?.notificationPreferences?.courseReviews || true,
        paymentNotifications: preferences?.notificationPreferences?.paymentNotifications || true,
        marketingEmails: preferences?.notificationPreferences?.marketingEmails || false,
    });

    // State for privacy settings
    const [privacySettings, setPrivacySettings] = useState({
        showProfileToCourseStudents: preferences?.privacySettings?.showProfileToCourseStudents || true,
        showSocialLinks: preferences?.privacySettings?.showSocialLinks || true,
        allowDirectMessages: preferences?.privacySettings?.allowDirectMessages || true,
    });

    // State for display preferences
    const [displayPrefs, setDisplayPrefs] = useState({
        courseDisplay: preferences?.displayPreferences?.courseDisplay || 'grid',
        themeDarkMode: preferences?.displayPreferences?.themeDarkMode || false,
        language: preferences?.displayPreferences?.language || 'en',
    });

    // Password change mutation
    const passwordMutation = useMutation(
        (data) => changePassword(data),
        {
            onSuccess: () => {
                toast({
                    title: 'Password changed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                passwordFormik.resetForm();
            },
            onError: (error) => {
                toast({
                    title: 'Error changing password',
                    description: error.message || 'Failed to change password',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Delete account mutation
    const deleteMutation = useMutation(
        deleteAccount,
        {
            onSuccess: () => {
                toast({
                    title: 'Account deleted',
                    description: 'Your account has been deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                logout();
            },
            onError: (error) => {
                toast({
                    title: 'Error deleting account',
                    description: error.message || 'Failed to delete account',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
            }
        }
    );

    // Update notification preferences mutation
    const notificationPrefsMutation = useMutation(
        (preferences) => updateInstructorPreferences({ type: 'notifications', preferences }),
        {
            onSuccess: () => {
                toast({
                    title: 'Notification preferences updated',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    );

    // Update privacy settings mutation
    const privacySettingsMutation = useMutation(
        (settings) => updateInstructorPreferences({ type: 'privacy', settings }),
        {
            onSuccess: () => {
                toast({
                    title: 'Privacy settings updated',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    );

    // Update display preferences mutation
    const displayPrefsMutation = useMutation(
        (preferences) => updateInstructorPreferences({ type: 'display', preferences }),
        {
            onSuccess: () => {
                toast({
                    title: 'Display preferences updated',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    );

    // Update payment info mutation
    const paymentInfoMutation = useMutation(
        (paymentInfo) => updatePaymentInfo(paymentInfo),
        {
            onSuccess: () => {
                toast({
                    title: 'Payment information updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Error updating payment information',
                    description: error.message || 'Failed to update payment information',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Export data mutation
    const exportMutation = useMutation(
        exportInstructorData,
        {
            onSuccess: (data) => {
                // Create a download link for the exported data
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'instructor-data.json';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                toast({
                    title: 'Data exported successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Error exporting data',
                    description: error.message || 'Failed to export your data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Handle notification preference change
    const handleNotificationChange = (name) => {
        const updatedPrefs = {
            ...notificationPrefs,
            [name]: !notificationPrefs[name]
        };
        setNotificationPrefs(updatedPrefs);
        notificationPrefsMutation.mutate(updatedPrefs);
    };

    // Handle privacy settings change
    const handlePrivacyChange = (name) => {
        const updatedSettings = {
            ...privacySettings,
            [name]: !privacySettings[name]
        };
        setPrivacySettings(updatedSettings);
        privacySettingsMutation.mutate(updatedSettings);
    };

    // Handle display preferences change
    const handleDisplayPrefChange = (name, value) => {
        const updatedPrefs = {
            ...displayPrefs,
            [name]: name === 'themeDarkMode' ? !displayPrefs.themeDarkMode : value
        };
        setDisplayPrefs(updatedPrefs);
        displayPrefsMutation.mutate(updatedPrefs);
    };

    // Handle data export
    const handleExportData = () => {
        exportMutation.mutate();
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>Account Settings</Heading>
                <Text color="gray.600">Manage your account settings and preferences</Text>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Password Change */}
                <Card shadow="md">
                    <CardHeader>
                        <Heading size="md">Change Password</Heading>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={passwordFormik.handleSubmit}>
                            <VStack spacing={4} align="stretch">
                                <FormControl
                                    id="currentPassword"
                                    isInvalid={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                                >
                                    <FormLabel>Current Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            {...passwordFormik.getFieldProps('currentPassword')}
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
                                    <FormErrorMessage>{passwordFormik.errors.currentPassword}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="newPassword"
                                    isInvalid={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                                >
                                    <FormLabel>New Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showNewPassword ? 'text' : 'password'}
                                            {...passwordFormik.getFieldProps('newPassword')}
                                        />
                                        <InputRightElement>
                                            <IconButton
                                                variant="ghost"
                                                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                                icon={showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{passwordFormik.errors.newPassword}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="confirmPassword"
                                    isInvalid={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                                >
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...passwordFormik.getFieldProps('confirmPassword')}
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
                                    <FormErrorMessage>{passwordFormik.errors.confirmPassword}</FormErrorMessage>
                                </FormControl>

                                <Button
                                    mt={4}
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={passwordMutation.isLoading}
                                    loadingText="Changing Password"
                                >
                                    Change Password
                                </Button>
                            </VStack>
                        </form>
                    </CardBody>
                </Card>

                {/* Payment Information */}
                <Card shadow="md">
                    <CardHeader>
                        <Heading size="md">Payment Information</Heading>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={paymentFormik.handleSubmit}>
                            <VStack spacing={4} align="stretch">
                                <FormControl
                                    id="paypalEmail"
                                    isInvalid={paymentFormik.touched.paypalEmail && paymentFormik.errors.paypalEmail}
                                >
                                    <FormLabel>PayPal Email</FormLabel>
                                    <Input
                                        {...paymentFormik.getFieldProps('paypalEmail')}
                                        placeholder="email@example.com"
                                    />
                                    <FormErrorMessage>{paymentFormik.errors.paypalEmail}</FormErrorMessage>
                                </FormControl>

                                <FormControl id="bankName">
                                    <FormLabel>Bank Name</FormLabel>
                                    <Input
                                        {...paymentFormik.getFieldProps('bankName')}
                                        placeholder="Bank name"
                                    />
                                </FormControl>

                                <FormControl id="accountNumber">
                                    <FormLabel>Account Number</FormLabel>
                                    <Input
                                        {...paymentFormik.getFieldProps('accountNumber')}
                                        placeholder="Account number"
                                    />
                                </FormControl>

                                <FormControl id="swiftCode">
                                    <FormLabel>SWIFT Code</FormLabel>
                                    <Input
                                        {...paymentFormik.getFieldProps('swiftCode')}
                                        placeholder="SWIFT code"
                                    />
                                </FormControl>

                                <FormControl id="taxId">
                                    <FormLabel>Tax ID (Optional)</FormLabel>
                                    <Input
                                        {...paymentFormik.getFieldProps('taxId')}
                                        placeholder="Tax ID"
                                    />
                                </FormControl>

                                <Button
                                    mt={4}
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={paymentInfoMutation.isLoading}
                                    loadingText="Saving"
                                >
                                    Save Payment Information
                                </Button>
                            </VStack>
                        </form>
                    </CardBody>
                </Card>

                {/* Notification Preferences */}
                <Card shadow="md">
                    <CardHeader>
                        <Heading size="md">Notification Preferences</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="emailNotifications" mb="0">
                                    Email Notifications
                                </FormLabel>
                                <Switch
                                    id="emailNotifications"
                                    isChecked={notificationPrefs.emailNotifications}
                                    onChange={() => handleNotificationChange('emailNotifications')}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="studentEnrollments" mb="0">
                                    Student Enrollments
                                </FormLabel>
                                <Switch
                                    id="studentEnrollments"
                                    isChecked={notificationPrefs.studentEnrollments}
                                    onChange={() => handleNotificationChange('studentEnrollments')}
                                    isDisabled={!notificationPrefs.emailNotifications}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="courseReviews" mb="0">
                                    Course Reviews
                                </FormLabel>
                                <Switch
                                    id="courseReviews"
                                    isChecked={notificationPrefs.courseReviews}
                                    onChange={() => handleNotificationChange('courseReviews')}
                                    isDisabled={!notificationPrefs.emailNotifications}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="paymentNotifications" mb="0">
                                    Payment Notifications
                                </FormLabel>
                                <Switch
                                    id="paymentNotifications"
                                    isChecked={notificationPrefs.paymentNotifications}
                                    onChange={() => handleNotificationChange('paymentNotifications')}
                                    isDisabled={!notificationPrefs.emailNotifications}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="marketingEmails" mb="0">
                                    Marketing Emails
                                </FormLabel>
                                <Switch
                                    id="marketingEmails"
                                    isChecked={notificationPrefs.marketingEmails}
                                    onChange={() => handleNotificationChange('marketingEmails')}
                                    isDisabled={!notificationPrefs.emailNotifications}
                                />
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Privacy Settings */}
                <Card shadow="md">
                    <CardHeader>
                        <Heading size="md">Privacy Settings</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="showProfileToCourseStudents" mb="0">
                                    Show Profile to Course Students
                                </FormLabel>
                                <Switch
                                    id="showProfileToCourseStudents"
                                    isChecked={privacySettings.showProfileToCourseStudents}
                                    onChange={() => handlePrivacyChange('showProfileToCourseStudents')}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="showSocialLinks" mb="0">
                                    Show Social Media Links
                                </FormLabel>
                                <Switch
                                    id="showSocialLinks"
                                    isChecked={privacySettings.showSocialLinks}
                                    onChange={() => handlePrivacyChange('showSocialLinks')}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="allowDirectMessages" mb="0">
                                    Allow Direct Messages
                                </FormLabel>
                                <Switch
                                    id="allowDirectMessages"
                                    isChecked={privacySettings.allowDirectMessages}
                                    onChange={() => handlePrivacyChange('allowDirectMessages')}
                                />
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Display Preferences */}
                <Card shadow="md">
                    <CardHeader>
                        <Heading size="md">Display Preferences</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel>Course Display</FormLabel>
                                <Select
                                    value={displayPrefs.courseDisplay}
                                    onChange={(e) => handleDisplayPrefChange('courseDisplay', e.target.value)}
                                >
                                    <option value="grid">Grid View</option>
                                    <option value="list">List View</option>
                                </Select>
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="themeDarkMode" mb="0">
                                    Dark Mode
                                </FormLabel>
                                <Switch
                                    id="themeDarkMode"
                                    isChecked={displayPrefs.themeDarkMode}
                                    onChange={() => handleDisplayPrefChange('themeDarkMode')}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Language</FormLabel>
                                <Select
                                    value={displayPrefs.language}
                                    onChange={(e) => handleDisplayPrefChange('language', e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="ar">Arabic</option>
                                </Select>
                            </FormControl>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Account Management */}
                <Card shadow="md">
                    <CardHeader>
                        <Heading size="md">Account Management</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={6} align="stretch">
                            <Box>
                                <Heading size="sm" mb={2}>Export Your Data</Heading>
                                <Text fontSize="sm" mb={4}>
                                    Download all your data from CourseHub, including courses, student information, earnings, and profile information.
                                </Text>
                                <Button
                                    leftIcon={<FaDownload />}
                                    onClick={handleExportData}
                                    isLoading={exportMutation.isLoading}
                                    loadingText="Exporting Data"
                                    size="sm"
                                >
                                    Export Data
                                </Button>
                            </Box>

                            <Divider />

                            <Box>
                                <Heading size="sm" mb={2} color="red.500">Delete Account</Heading>
                                <Text fontSize="sm" mb={4}>
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </Text>
                                <Button
                                    colorScheme="red"
                                    leftIcon={<FaTrash />}
                                    onClick={onOpen}
                                    size="sm"
                                >
                                    Delete Account
                                </Button>
                            </Box>
                        </VStack>
                    </CardBody>
                </Card>
            </SimpleGrid>

            {/* Delete Account Confirmation */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Account
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <VStack align="stretch" spacing={4}>
                                <Text>
                                    Are you sure you want to delete your instructor account? This action cannot be undone and will result in the permanent loss of all your data, including:
                                </Text>
                                <Box pl={4}>
                                    <Text>• All your courses and course materials</Text>
                                    <Text>• Student enrollments in your courses</Text>
                                    <Text>• Reviews and ratings</Text>
                                    <Text>• Earnings history and payment information</Text>
                                </Box>
                                <Alert status="warning">
                                    <AlertIcon />
                                    Students who have enrolled in your courses may lose access to course content.
                                </Alert>
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => deleteMutation.mutate()}
                                ml={3}
                                isLoading={deleteMutation.isLoading}
                                loadingText="Deleting"
                            >
                                Delete Account
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
};

export default SettingsPage;