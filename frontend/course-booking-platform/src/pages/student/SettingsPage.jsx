import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    SimpleGrid,
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Alert,
    AlertIcon,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    IconButton,
    Card,
    CardHeader,
    CardBody,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaTrash, FaDownload } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { changePassword, deleteAccount, updateUserPreferences, exportUserData } from '../../api/user';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const deleteAlertRef = React.useRef();

    // Password change mutation
    const passwordMutation = useMutation(
        (passwordData) => changePassword(passwordData),
        {
            onSuccess: () => {
                toast({
                    title: 'Password changed',
                    description: 'Your password has been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                formik.resetForm();
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
                    description: error.message || 'Failed to delete your account',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
            }
        }
    );

    // Update preferences mutation
    const preferencesMutation = useMutation(
        (preferences) => updateUserPreferences(preferences),
        {
            onSuccess: () => {
                toast({
                    title: 'Preferences updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Error updating preferences',
                    description: error.message || 'Failed to update preferences',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Export data mutation
    const exportMutation = useMutation(
        exportUserData,
        {
            onSuccess: (data) => {
                // Create a download link for the exported data
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'my-coursehub-data.json';
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

    // Password change form
    const formik = useFormik({
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

    // Notification preferences
    const [notificationPreferences, setNotificationPreferences] = useState({
        emailNotifications: user?.preferences?.emailNotifications || true,
        courseUpdates: user?.preferences?.courseUpdates || true,
        promotionalEmails: user?.preferences?.promotionalEmails || false,
        sessionReminders: user?.preferences?.sessionReminders || true,
        newMessages: user?.preferences?.newMessages || true,
    });

    // Privacy preferences
    const [privacyPreferences, setPrivacyPreferences] = useState({
        showEnrolledCourses: user?.preferences?.showEnrolledCourses || true,
        showCompletedCertificates: user?.preferences?.showCompletedCertificates || true,
        shareActivityWithInstructors: user?.preferences?.shareActivityWithInstructors || true,
        allowProfileInSearch: user?.preferences?.allowProfileInSearch || true,
    });

    // Handle notification preferences change
    const handleNotificationChange = (name) => {
        const updatedPreferences = {
            ...notificationPreferences,
            [name]: !notificationPreferences[name]
        };

        setNotificationPreferences(updatedPreferences);
        preferencesMutation.mutate({
            type: 'notifications',
            preferences: updatedPreferences
        });
    };

    // Handle privacy preferences change
    const handlePrivacyChange = (name) => {
        const updatedPreferences = {
            ...privacyPreferences,
            [name]: !privacyPreferences[name]
        };

        setPrivacyPreferences(updatedPreferences);
        preferencesMutation.mutate({
            type: 'privacy',
            preferences: updatedPreferences
        });
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
                        <form onSubmit={formik.handleSubmit}>
                            <VStack spacing={4} align="stretch">
                                <FormControl
                                    id="currentPassword"
                                    isInvalid={formik.touched.currentPassword && formik.errors.currentPassword}
                                >
                                    <FormLabel>Current Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            {...formik.getFieldProps('currentPassword')}
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
                                    <FormErrorMessage>{formik.errors.currentPassword}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="newPassword"
                                    isInvalid={formik.touched.newPassword && formik.errors.newPassword}
                                >
                                    <FormLabel>New Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showNewPassword ? 'text' : 'password'}
                                            {...formik.getFieldProps('newPassword')}
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
                                    <FormErrorMessage>{formik.errors.newPassword}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="confirmPassword"
                                    isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                >
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...formik.getFieldProps('confirmPassword')}
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

                {/* Notification Settings */}
                <Card shadow="md">
                    <CardHeader>
                        <Heading size="md">Notification Settings</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="emailNotifications" mb="0">
                                    Email Notifications
                                </FormLabel>
                                <Switch
                                    id="emailNotifications"
                                    isChecked={notificationPreferences.emailNotifications}
                                    onChange={() => handleNotificationChange('emailNotifications')}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="courseUpdates" mb="0">
                                    Course Updates
                                </FormLabel>
                                <Switch
                                    id="courseUpdates"
                                    isChecked={notificationPreferences.courseUpdates}
                                    onChange={() => handleNotificationChange('courseUpdates')}
                                    isDisabled={!notificationPreferences.emailNotifications}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="promotionalEmails" mb="0">
                                    Promotional Emails
                                </FormLabel>
                                <Switch
                                    id="promotionalEmails"
                                    isChecked={notificationPreferences.promotionalEmails}
                                    onChange={() => handleNotificationChange('promotionalEmails')}
                                    isDisabled={!notificationPreferences.emailNotifications}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="sessionReminders" mb="0">
                                    Session Reminders
                                </FormLabel>
                                <Switch
                                    id="sessionReminders"
                                    isChecked={notificationPreferences.sessionReminders}
                                    onChange={() => handleNotificationChange('sessionReminders')}
                                    isDisabled={!notificationPreferences.emailNotifications}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="newMessages" mb="0">
                                    New Messages
                                </FormLabel>
                                <Switch
                                    id="newMessages"
                                    isChecked={notificationPreferences.newMessages}
                                    onChange={() => handleNotificationChange('newMessages')}
                                    isDisabled={!notificationPreferences.emailNotifications}
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
                                <FormLabel htmlFor="showEnrolledCourses" mb="0">
                                    Show Enrolled Courses to Others
                                </FormLabel>
                                <Switch
                                    id="showEnrolledCourses"
                                    isChecked={privacyPreferences.showEnrolledCourses}
                                    onChange={() => handlePrivacyChange('showEnrolledCourses')}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="showCompletedCertificates" mb="0">
                                    Show Completed Certificates Publicly
                                </FormLabel>
                                <Switch
                                    id="showCompletedCertificates"
                                    isChecked={privacyPreferences.showCompletedCertificates}
                                    onChange={() => handlePrivacyChange('showCompletedCertificates')}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="shareActivityWithInstructors" mb="0">
                                    Share Learning Activity with Instructors
                                </FormLabel>
                                <Switch
                                    id="shareActivityWithInstructors"
                                    isChecked={privacyPreferences.shareActivityWithInstructors}
                                    onChange={() => handlePrivacyChange('shareActivityWithInstructors')}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel htmlFor="allowProfileInSearch" mb="0">
                                    Allow Profile to Appear in Searches
                                </FormLabel>
                                <Switch
                                    id="allowProfileInSearch"
                                    isChecked={privacyPreferences.allowProfileInSearch}
                                    onChange={() => handlePrivacyChange('allowProfileInSearch')}
                                />
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
                                    Download all your personal data from CourseHub, including course progress, certificates, and profile information.
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

            {/* Delete Account Confirmation Dialog */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={deleteAlertRef}
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
                                    Are you sure you want to delete your account? This action cannot be undone and will result in the permanent loss of all your data, including:
                                </Text>
                                <Box pl={4}>
                                    <Text>• Course progress and completion status</Text>
                                    <Text>• Earned certificates</Text>
                                    <Text>• Payment history and receipts</Text>
                                    <Text>• Profile information and preferences</Text>
                                </Box>
                                <Alert status="warning">
                                    <AlertIcon />
                                    You will lose access to all courses you've purchased.
                                </Alert>
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={deleteAlertRef} onClick={onClose}>
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