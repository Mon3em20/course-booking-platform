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
    FormHelperText,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Select,
    Textarea,
    Switch,
    Badge,
    Flex,
    Icon,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider,
    Card,
    CardHeader,
    CardBody,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Alert,
    AlertIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Tag,
    TagLabel,
    TagCloseButton,
    useColorModeValue,
    Spinner,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FaGlobe,
    FaEnvelope,
    FaCreditCard,
    FaShieldAlt,
    FaRegFileAlt,
    FaPlus,
    FaPercentage,
    FaRegLifeRing,
    FaBell,
    FaFileUpload,
    FaDatabase,
    FaTimes,
    FaCheck,
    FaDollarSign,
} from 'react-icons/fa';
import {
    getSystemSettings,
    updateGeneralSettings,
    updateEmailSettings,
    updatePaymentSettings,
    updateSecuritySettings,
    testEmailSettings,
    testPaymentSettings,
    getCategories,
    addCategory,
    removeCategory,
    backupSystem,
    restoreSystem,
    getMaintenanceLogs,
} from '../../api/admin';

const SystemSettingsPage = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const categoryModal = useDisclosure();
    const backupModal = useDisclosure();
    const restoreModal = useDisclosure();
    const [categoryName, setCategoryName] = useState('');
    const [categoryIcon, setCategoryIcon] = useState('');
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [backupFile, setBackupFile] = useState(null);

    // Get system settings
    const {
        data: settings,
        isLoading,
        error
    } = useQuery(
        'systemSettings',
        getSystemSettings,
        {
            onError: () => {
                toast({
                    title: 'Error loading settings',
                    description: 'Failed to load system settings',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Get categories
    const {
        data: categories,
        isLoading: categoriesLoading
    } = useQuery(
        'categories',
        getCategories,
        {
            onError: () => {
                toast({
                    title: 'Error loading categories',
                    description: 'Failed to load course categories',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Get maintenance logs
    const {
        data: maintenanceLogs,
        isLoading: logsLoading
    } = useQuery(
        'maintenanceLogs',
        getMaintenanceLogs,
        {
            onError: () => {
                toast({
                    title: 'Error loading logs',
                    description: 'Failed to load maintenance logs',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update general settings mutation
    const updateGeneralMutation = useMutation(
        updateGeneralSettings,
        {
            onSuccess: () => {
                toast({
                    title: 'Settings updated',
                    description: 'General settings have been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('systemSettings');
            },
            onError: (error) => {
                toast({
                    title: 'Error updating settings',
                    description: error.message || 'Failed to update general settings',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update email settings mutation
    const updateEmailMutation = useMutation(
        updateEmailSettings,
        {
            onSuccess: () => {
                toast({
                    title: 'Email settings updated',
                    description: 'Email settings have been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('systemSettings');
            },
            onError: (error) => {
                toast({
                    title: 'Error updating email settings',
                    description: error.message || 'Failed to update email settings',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update payment settings mutation
    const updatePaymentMutation = useMutation(
        updatePaymentSettings,
        {
            onSuccess: () => {
                toast({
                    title: 'Payment settings updated',
                    description: 'Payment settings have been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('systemSettings');
            },
            onError: (error) => {
                toast({
                    title: 'Error updating payment settings',
                    description: error.message || 'Failed to update payment settings',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update security settings mutation
    const updateSecurityMutation = useMutation(
        updateSecuritySettings,
        {
            onSuccess: () => {
                toast({
                    title: 'Security settings updated',
                    description: 'Security settings have been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('systemSettings');
            },
            onError: (error) => {
                toast({
                    title: 'Error updating security settings',
                    description: error.message || 'Failed to update security settings',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Test email settings mutation
    const testEmailMutation = useMutation(
        testEmailSettings,
        {
            onSuccess: () => {
                toast({
                    title: 'Email test successful',
                    description: 'Test email has been sent successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Email test failed',
                    description: error.message || 'Failed to send test email',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Test payment settings mutation
    const testPaymentMutation = useMutation(
        testPaymentSettings,
        {
            onSuccess: () => {
                toast({
                    title: 'Payment test successful',
                    description: 'Payment integration test was successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Payment test failed',
                    description: error.message || 'Failed to test payment integration',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Add category mutation
    const addCategoryMutation = useMutation(
        addCategory,
        {
            onSuccess: () => {
                toast({
                    title: 'Category added',
                    description: 'New category has been added successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setCategoryName('');
                setCategoryIcon('');
                categoryModal.onClose();
                queryClient.invalidateQueries('categories');
            },
            onError: (error) => {
                toast({
                    title: 'Error adding category',
                    description: error.message || 'Failed to add new category',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Remove category mutation
    const removeCategoryMutation = useMutation(
        removeCategory,
        {
            onSuccess: () => {
                toast({
                    title: 'Category removed',
                    description: 'Category has been removed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                queryClient.invalidateQueries('categories');
            },
            onError: (error) => {
                toast({
                    title: 'Error removing category',
                    description: error.message || 'Failed to remove category',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Backup system mutation
    const backupMutation = useMutation(
        backupSystem,
        {
            onSuccess: (data) => {
                // Create download link
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `system_backup_${new Date().toISOString().split('T')[0]}.zip`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);

                toast({
                    title: 'Backup created',
                    description: 'System backup has been created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                backupModal.onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Backup failed',
                    description: error.message || 'Failed to create system backup',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Restore system mutation
    const restoreMutation = useMutation(
        (file) => {
            const formData = new FormData();
            formData.append('backup', file);
            return restoreSystem(formData);
        },
        {
            onSuccess: () => {
                toast({
                    title: 'System restored',
                    description: 'System has been restored successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setBackupFile(null);
                restoreModal.onClose();
                queryClient.invalidateQueries();
            },
            onError: (error) => {
                toast({
                    title: 'Restore failed',
                    description: error.message || 'Failed to restore system',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Handle general settings form submit
    const handleGeneralSettingsSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            siteName: formData.get('siteName'),
            siteDescription: formData.get('siteDescription'),
            siteUrl: formData.get('siteUrl'),
            adminEmail: formData.get('adminEmail'),
            maintenanceMode: isMaintenanceMode,
            maintenanceMessage: formData.get('maintenanceMessage'),
            defaultLanguage: formData.get('defaultLanguage'),
            defaultCurrency: formData.get('defaultCurrency'),
        };
        updateGeneralMutation.mutate(data);
    };

    // Handle email settings form submit
    const handleEmailSettingsSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            smtpHost: formData.get('smtpHost'),
            smtpPort: formData.get('smtpPort'),
            smtpUser: formData.get('smtpUser'),
            smtpPassword: formData.get('smtpPassword'),
            smtpSecure: formData.get('smtpSecure') === 'true',
            emailFromName: formData.get('emailFromName'),
            emailFromAddress: formData.get('emailFromAddress'),
            emailReplyToAddress: formData.get('emailReplyToAddress'),
        };
        updateEmailMutation.mutate(data);
    };

    // Handle payment settings form submit
    const handlePaymentSettingsSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            stripePublicKey: formData.get('stripePublicKey'),
            stripeSecretKey: formData.get('stripeSecretKey'),
            paypalClientId: formData.get('paypalClientId'),
            paypalClientSecret: formData.get('paypalClientSecret'),
            instructorCommissionRate: formData.get('instructorCommissionRate'),
            transactionFee: formData.get('transactionFee'),
            enableStripe: formData.get('enableStripe') === 'on',
            enablePaypal: formData.get('enablePaypal') === 'on',
        };
        updatePaymentMutation.mutate(data);
    };

    // Handle security settings form submit
    const handleSecuritySettingsSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            requireEmailVerification: formData.get('requireEmailVerification') === 'on',
            allowUserRegistration: formData.get('allowUserRegistration') === 'on',
            recaptchaEnabled: formData.get('recaptchaEnabled') === 'on',
            recaptchaSiteKey: formData.get('recaptchaSiteKey'),
            recaptchaSecretKey: formData.get('recaptchaSecretKey'),
            loginThrottling: formData.get('loginThrottling') === 'on',
            maxLoginAttempts: formData.get('maxLoginAttempts'),
            passwordMinLength: formData.get('passwordMinLength'),
            passwordRequireSpecialChars: formData.get('passwordRequireSpecialChars') === 'on',
            sessionTimeout: formData.get('sessionTimeout'),
        };
        updateSecurityMutation.mutate(data);
    };

    // Handle add category
    const handleAddCategory = () => {
        if (!categoryName.trim()) return;

        addCategoryMutation.mutate({
            name: categoryName,
            icon: categoryIcon,
        });
    };

    // Handle remove category
    const handleRemoveCategory = (categoryId) => {
        removeCategoryMutation.mutate(categoryId);
    };

    // Handle backup
    const handleBackup = () => {
        backupMutation.mutate();
    };

    // Handle restore
    const handleRestore = () => {
        if (!backupFile) return;
        restoreMutation.mutate(backupFile);
    };

    // Handle file upload for restore
    const handleFileUpload = (e) => {
        if (e.target.files[0]) {
            setBackupFile(e.target.files[0]);
        }
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading system settings...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg" mb={2}>System Settings</Heading>
                <Text color="gray.600">Configure and manage system-wide settings for the platform</Text>
            </Box>

            {error ? (
                <Alert status="error" borderRadius="md" mb={6}>
                    <AlertIcon />
                    <Text>Error loading settings. Please try again later.</Text>
                </Alert>
            ) : (
                <Tabs colorScheme="blue" isLazy>
                    <TabList overflowX="auto" whiteSpace="nowrap">
                        <Tab><Icon as={FaGlobe} mr={2} />General</Tab>
                        <Tab><Icon as={FaEnvelope} mr={2} />Email</Tab>
                        <Tab><Icon as={FaCreditCard} mr={2} />Payments</Tab>
                        <Tab><Icon as={FaShield} mr={2} />Security</Tab>
                        <Tab><Icon as={FaRegFileAlt} mr={2} />Categories</Tab>
                        <Tab><Icon as={FaDatabase} mr={2} />System</Tab>
                    </TabList>

                    <TabPanels>
                        {/* General Settings Tab */}
                        <TabPanel px={0}>
                            <Card shadow="md" mb={6}>
                                <CardHeader>
                                    <Heading size="md">General Settings</Heading>
                                </CardHeader>
                                <CardBody>
                                    <form onSubmit={handleGeneralSettingsSubmit}>
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                            <FormControl>
                                                <FormLabel>Site Name</FormLabel>
                                                <Input
                                                    name="siteName"
                                                    defaultValue={settings?.general?.siteName || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Admin Email</FormLabel>
                                                <Input
                                                    name="adminEmail"
                                                    type="email"
                                                    defaultValue={settings?.general?.adminEmail || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Site URL</FormLabel>
                                                <Input
                                                    name="siteUrl"
                                                    defaultValue={settings?.general?.siteUrl || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Default Language</FormLabel>
                                                <Select
                                                    name="defaultLanguage"
                                                    defaultValue={settings?.general?.defaultLanguage || 'en'}
                                                >
                                                    <option value="en">English</option>
                                                    <option value="es">Spanish</option>
                                                    <option value="fr">French</option>
                                                    <option value="de">German</option>
                                                    <option value="ar">Arabic</option>
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Default Currency</FormLabel>
                                                <Select
                                                    name="defaultCurrency"
                                                    defaultValue={settings?.general?.defaultCurrency || 'USD'}
                                                >
                                                    <option value="USD">US Dollar (USD)</option>
                                                    <option value="EUR">Euro (EUR)</option>
                                                    <option value="GBP">British Pound (GBP)</option>
                                                    <option value="JPY">Japanese Yen (JPY)</option>
                                                    <option value="CAD">Canadian Dollar (CAD)</option>
                                                    <option value="AUD">Australian Dollar (AUD)</option>
                                                </Select>
                                            </FormControl>
                                        </SimpleGrid>

                                        <FormControl mb={6}>
                                            <FormLabel>Site Description</FormLabel>
                                            <Textarea
                                                name="siteDescription"
                                                defaultValue={settings?.general?.siteDescription || ''}
                                                rows={3}
                                            />
                                        </FormControl>

                                        <FormControl display="flex" alignItems="center" mb={4}>
                                            <FormLabel htmlFor="maintenance-mode" mb="0">
                                                Maintenance Mode
                                            </FormLabel>
                                            <Switch
                                                id="maintenance-mode"
                                                isChecked={isMaintenanceMode || settings?.general?.maintenanceMode}
                                                onChange={() => setIsMaintenanceMode(!isMaintenanceMode)}
                                                colorScheme="red"
                                            />
                                        </FormControl>

                                        {(isMaintenanceMode || settings?.general?.maintenanceMode) && (
                                            <FormControl mb={6}>
                                                <FormLabel>Maintenance Message</FormLabel>
                                                <Textarea
                                                    name="maintenanceMessage"
                                                    defaultValue={settings?.general?.maintenanceMessage || 'The site is currently under maintenance. Please check back later.'}
                                                    rows={2}
                                                />
                                            </FormControl>
                                        )}

                                        <Button
                                            colorScheme="blue"
                                            type="submit"
                                            isLoading={updateGeneralMutation.isLoading}
                                            loadingText="Saving"
                                        >
                                            Save General Settings
                                        </Button>
                                    </form>
                                </CardBody>
                            </Card>
                        </TabPanel>

                        {/* Email Settings Tab */}
                        <TabPanel px={0}>
                            <Card shadow="md" mb={6}>
                                <CardHeader>
                                    <Heading size="md">Email Configuration</Heading>
                                </CardHeader>
                                <CardBody>
                                    <form onSubmit={handleEmailSettingsSubmit}>
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                            <FormControl>
                                                <FormLabel>SMTP Host</FormLabel>
                                                <Input
                                                    name="smtpHost"
                                                    defaultValue={settings?.email?.smtpHost || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>SMTP Port</FormLabel>
                                                <Input
                                                    name="smtpPort"
                                                    type="number"
                                                    defaultValue={settings?.email?.smtpPort || '587'}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>SMTP Username</FormLabel>
                                                <Input
                                                    name="smtpUser"
                                                    defaultValue={settings?.email?.smtpUser || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>SMTP Password</FormLabel>
                                                <Input
                                                    name="smtpPassword"
                                                    type="password"
                                                    defaultValue={settings?.email?.smtpPassword || ''}
                                                    placeholder="••••••••••"
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>SMTP Security</FormLabel>
                                                <Select
                                                    name="smtpSecure"
                                                    defaultValue={settings?.email?.smtpSecure?.toString() || 'true'}
                                                >
                                                    <option value="true">SSL/TLS</option>
                                                    <option value="false">None</option>
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>From Name</FormLabel>
                                                <Input
                                                    name="emailFromName"
                                                    defaultValue={settings?.email?.emailFromName || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>From Email Address</FormLabel>
                                                <Input
                                                    name="emailFromAddress"
                                                    type="email"
                                                    defaultValue={settings?.email?.emailFromAddress || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Reply-To Email Address</FormLabel>
                                                <Input
                                                    name="emailReplyToAddress"
                                                    type="email"
                                                    defaultValue={settings?.email?.emailReplyToAddress || ''}
                                                />
                                            </FormControl>
                                        </SimpleGrid>

                                        <HStack spacing={4}>
                                            <Button
                                                colorScheme="blue"
                                                type="submit"
                                                isLoading={updateEmailMutation.isLoading}
                                                loadingText="Saving"
                                            >
                                                Save Email Settings
                                            </Button>

                                            <Button
                                                variant="outline"
                                                colorScheme="green"
                                                onClick={() => testEmailMutation.mutate()}
                                                isLoading={testEmailMutation.isLoading}
                                                loadingText="Sending"
                                            >
                                                Test Email Configuration
                                            </Button>
                                        </HStack>
                                    </form>
                                </CardBody>
                            </Card>

                            <Card shadow="md">
                                <CardHeader>
                                    <Heading size="md">Email Templates</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Accordion allowToggle>
                                        {[
                                            { id: 'welcome', name: 'Welcome Email', subject: 'Welcome to CourseHub!' },
                                            { id: 'resetPassword', name: 'Password Reset', subject: 'Reset Your Password' },
                                            { id: 'courseEnrollment', name: 'Course Enrollment', subject: 'You\'ve enrolled in a course' },
                                            { id: 'courseCompletion', name: 'Course Completion', subject: 'Congratulations on completing your course!' },
                                        ].map((template) => (
                                            <AccordionItem key={template.id}>
                                                <h2>
                                                    <AccordionButton>
                                                        <Box flex="1" textAlign="left">
                                                            {template.name}
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <FormControl mb={4}>
                                                        <FormLabel>Subject</FormLabel>
                                                        <Input defaultValue={template.subject} />
                                                    </FormControl>

                                                    <FormControl mb={4}>
                                                        <FormLabel>Email Body</FormLabel>
                                                        <Textarea rows={6} defaultValue={`Dear {{name}},

This is a template for the ${template.name.toLowerCase()} email.

Best regards,
The CourseHub Team`} />
                                                        <FormHelperText>
                                                            You can use variables like {{name}}, {{course}}, {{link}} etc.
                                                        </FormHelperText>
                                                    </FormControl>

                                                    <Button colorScheme="blue" size="sm">
                                                        Save Template
                                                    </Button>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardBody>
                            </Card>
                        </TabPanel>

                        {/* Payment Settings Tab */}
                        <TabPanel px={0}>
                            <Card shadow="md" mb={6}>
                                <CardHeader>
                                    <Heading size="md">Payment Gateways</Heading>
                                </CardHeader>
                                <CardBody>
                                    <form onSubmit={handlePaymentSettingsSubmit}>
                                        <FormControl display="flex" alignItems="center" mb={4}>
                                            <FormLabel htmlFor="enable-stripe" mb="0">
                                                Enable Stripe
                                            </FormLabel>
                                            <Switch
                                                id="enable-stripe"
                                                name="enableStripe"
                                                defaultChecked={settings?.payment?.enableStripe}
                                            />
                                        </FormControl>

                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                            <FormControl>
                                                <FormLabel>Stripe Public Key</FormLabel>
                                                <Input
                                                    name="stripePublicKey"
                                                    defaultValue={settings?.payment?.stripePublicKey || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Stripe Secret Key</FormLabel>
                                                <Input
                                                    name="stripeSecretKey"
                                                    type="password"
                                                    defaultValue={settings?.payment?.stripeSecretKey || ''}
                                                    placeholder="••••••••••"
                                                />
                                            </FormControl>
                                        </SimpleGrid>

                                        <Divider my={6} />

                                        <FormControl display="flex" alignItems="center" mb={4}>
                                            <FormLabel htmlFor="enable-paypal" mb="0">
                                                Enable PayPal
                                            </FormLabel>
                                            <Switch
                                                id="enable-paypal"
                                                name="enablePaypal"
                                                defaultChecked={settings?.payment?.enablePaypal}
                                            />
                                        </FormControl>

                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                            <FormControl>
                                                <FormLabel>PayPal Client ID</FormLabel>
                                                <Input
                                                    name="paypalClientId"
                                                    defaultValue={settings?.payment?.paypalClientId || ''}
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>PayPal Client Secret</FormLabel>
                                                <Input
                                                    name="paypalClientSecret"
                                                    type="password"
                                                    defaultValue={settings?.payment?.paypalClientSecret || ''}
                                                    placeholder="••••••••••"
                                                />
                                            </FormControl>
                                        </SimpleGrid>

                                        <Divider my={6} />

                                        <Heading size="sm" mb={4}>Commission & Fees</Heading>

                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                            <FormControl>
                                                <FormLabel>Instructor Commission Rate (%)</FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        name="instructorCommissionRate"
                                                        type="number"
                                                        defaultValue={settings?.payment?.instructorCommissionRate || '70'}
                                                        min="0"
                                                        max="100"
                                                        step="1"
                                                    />
                                                    <InputRightElement pointerEvents="none">
                                                        <Icon as={FaPercentage} color="gray.500" />
                                                    </InputRightElement>
                                                </InputGroup>
                                                <FormHelperText>
                                                    Percentage of course price that goes to the instructor
                                                </FormHelperText>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Transaction Fee</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none">
                                                        <Icon as={FaDollarSign} color="gray.500" />
                                                    </InputLeftElement>
                                                    <Input
                                                        name="transactionFee"
                                                        type="number"
                                                        defaultValue={settings?.payment?.transactionFee || '0.30'}
                                                        step="0.01"
                                                        min="0"
                                                    />
                                                </InputGroup>
                                                <FormHelperText>
                                                    Fixed fee applied to each transaction
                                                </FormHelperText>
                                            </FormControl>
                                        </SimpleGrid>

                                        <HStack spacing={4}>
                                            <Button
                                                colorScheme="blue"
                                                type="submit"
                                                isLoading={updatePaymentMutation.isLoading}
                                                loadingText="Saving"
                                            >
                                                Save Payment Settings
                                            </Button>

                                            <Button
                                                variant="outline"
                                                colorScheme="green"
                                                onClick={() => testPaymentMutation.mutate()}
                                                isLoading={testPaymentMutation.isLoading}
                                                loadingText="Testing"
                                            >
                                                Test Payment Integration
                                            </Button>
                                        </HStack>
                                    </form>
                                </CardBody>
                            </Card>
                        </TabPanel>

                        {/* Security Settings Tab */}
                        <TabPanel px={0}>
                            <Card shadow="md">
                                <CardHeader>
                                    <Heading size="md">Security Settings</Heading>
                                </CardHeader>
                                <CardBody>
                                    <form onSubmit={handleSecuritySettingsSubmit}>
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                            <Box>
                                                <Heading size="sm" mb={4}>Authentication</Heading>

                                                <FormControl display="flex" alignItems="center" mb={4}>
                                                    <Switch
                                                        id="requireEmailVerification"
                                                        name="requireEmailVerification"
                                                        defaultChecked={settings?.security?.requireEmailVerification}
                                                        mr={3}
                                                    />
                                                    <FormLabel htmlFor="requireEmailVerification" mb="0">
                                                        Require Email Verification
                                                    </FormLabel>
                                                </FormControl>

                                                <FormControl display="flex" alignItems="center" mb={4}>
                                                    <Switch
                                                        id="allowUserRegistration"
                                                        name="allowUserRegistration"
                                                        defaultChecked={settings?.security?.allowUserRegistration !== false}
                                                        mr={3}
                                                    />
                                                    <FormLabel htmlFor="allowUserRegistration" mb="0">
                                                        Allow User Registration
                                                    </FormLabel>
                                                </FormControl>

                                                <FormControl mb={4}>
                                                    <FormLabel>Password Minimum Length</FormLabel>
                                                    <Input
                                                        name="passwordMinLength"
                                                        type="number"
                                                        min="6"
                                                        max="32"
                                                        defaultValue={settings?.security?.passwordMinLength || '8'}
                                                    />
                                                </FormControl>

                                                <FormControl display="flex" alignItems="center" mb={4}>
                                                    <Switch
                                                        id="passwordRequireSpecialChars"
                                                        name="passwordRequireSpecialChars"
                                                        defaultChecked={settings?.security?.passwordRequireSpecialChars}
                                                        mr={3}
                                                    />
                                                    <FormLabel htmlFor="passwordRequireSpecialChars" mb="0">
                                                        Require Special Characters in Password
                                                    </FormLabel>
                                                </FormControl>

                                                <FormControl mb={4}>
                                                    <FormLabel>Session Timeout (minutes)</FormLabel>
                                                    <Input
                                                        name="sessionTimeout"
                                                        type="number"
                                                        min="5"
                                                        defaultValue={settings?.security?.sessionTimeout || '60'}
                                                    />
                                                    <FormHelperText>
                                                        Time of inactivity before user is logged out
                                                    </FormHelperText>
                                                </FormControl>
                                            </Box>

                                            <Box>
                                                <Heading size="sm" mb={4}>Protection</Heading>

                                                <FormControl display="flex" alignItems="center" mb={4}>
                                                    <Switch
                                                        id="loginThrottling"
                                                        name="loginThrottling"
                                                        defaultChecked={settings?.security?.loginThrottling}
                                                        mr={3}
                                                    />
                                                    <FormLabel htmlFor="loginThrottling" mb="0">
                                                        Enable Login Throttling
                                                    </FormLabel>
                                                </FormControl>

                                                <FormControl mb={6}>
                                                    <FormLabel>Max Login Attempts</FormLabel>
                                                    <Input
                                                        name="maxLoginAttempts"
                                                        type="number"
                                                        min="3"
                                                        max="10"
                                                        defaultValue={settings?.security?.maxLoginAttempts || '5'}
                                                    />
                                                </FormControl>

                                                <FormControl display="flex" alignItems="center" mb={4}>
                                                    <Switch
                                                        id="recaptchaEnabled"
                                                        name="recaptchaEnabled"
                                                        defaultChecked={settings?.security?.recaptchaEnabled}
                                                        mr={3}
                                                    />
                                                    <FormLabel htmlFor="recaptchaEnabled" mb="0">
                                                        Enable reCAPTCHA
                                                    </FormLabel>
                                                </FormControl>

                                                <FormControl mb={4}>
                                                    <FormLabel>reCAPTCHA Site Key</FormLabel>
                                                    <Input
                                                        name="recaptchaSiteKey"
                                                        defaultValue={settings?.security?.recaptchaSiteKey || ''}
                                                    />
                                                </FormControl>

                                                <FormControl mb={4}>
                                                    <FormLabel>reCAPTCHA Secret Key</FormLabel>
                                                    <Input
                                                        name="recaptchaSecretKey"
                                                        type="password"
                                                        defaultValue={settings?.security?.recaptchaSecretKey || ''}
                                                        placeholder="••••••••••"
                                                    />
                                                </FormControl>
                                            </Box>
                                        </SimpleGrid>

                                        <Button
                                            colorScheme="blue"
                                            type="submit"
                                            isLoading={updateSecurityMutation.isLoading}
                                            loadingText="Saving"
                                        >
                                            Save Security Settings
                                        </Button>
                                    </form>
                                </CardBody>
                            </Card>
                        </TabPanel>

                        {/* Categories Tab */}
                        <TabPanel px={0}>
                            <Card shadow="md">
                                <CardHeader>
                                    <Flex justify="space-between" align="center">
                                        <Heading size="md">Course Categories</Heading>
                                        <Button
                                            size="sm"
                                            colorScheme="blue"
                                            leftIcon={<FaPlus />}
                                            onClick={categoryModal.onOpen}
                                        >
                                            Add Category
                                        </Button>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    {categoriesLoading ? (
                                        <Box textAlign="center" py={6}>
                                            <Spinner size="md" color="blue.500" />
                                            <Text mt={2}>Loading categories...</Text>
                                        </Box>
                                    ) : categories?.length === 0 ? (
                                        <Box textAlign="center" py={6}>
                                            <Text mb={4}>No categories found.</Text>
                                            <Button
                                                leftIcon={<FaPlus />}
                                                colorScheme="blue"
                                                onClick={categoryModal.onOpen}
                                            >
                                                Add Your First Category
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Flex wrap="wrap" gap={3}>
                                            {categories?.map(category => (
                                                <Tag
                                                    key={category._id}
                                                    size="lg"
                                                    borderRadius="full"
                                                    variant="solid"
                                                    colorScheme="blue"
                                                    mb={2}
                                                >
                                                    <TagLabel>{category.name}</TagLabel>
                                                    <TagCloseButton
                                                        onClick={() => handleRemoveCategory(category._id)}
                                                    />
                                                </Tag>
                                            ))}
                                        </Flex>
                                    )}
                                </CardBody>
                            </Card>
                        </TabPanel>

                        {/* System Tab */}
                        <TabPanel px={0}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                <Card shadow="md">
                                    <CardHeader>
                                        <Heading size="md">System Backup & Restore</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Text mb={6}>
                                            Create backups of your system data or restore from a previous backup.
                                        </Text>
                                        <HStack>
                                            <Button
                                                colorScheme="blue"
                                                leftIcon={<FaFileUpload />}
                                                onClick={backupModal.onOpen}
                                            >
                                                Create Backup
                                            </Button>
                                            <Button
                                                variant="outline"
                                                leftIcon={<FaFileUpload />}
                                                onClick={restoreModal.onOpen}
                                            >
                                                Restore System
                                            </Button>
                                        </HStack>
                                    </CardBody>
                                </Card>

                                <Card shadow="md">
                                    <CardHeader>
                                        <Heading size="md">System Health</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <SimpleGrid columns={2} spacing={4} mb={4}>
                                            <Box>
                                                <Text fontWeight="bold">System Version:</Text>
                                                <Text>{settings?.system?.version || '1.0.0'}</Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">Last Backup:</Text>
                                                <Text>
                                                    {settings?.system?.lastBackup ?
                                                        new Date(settings.system.lastBackup).toLocaleString() :
                                                        'Never'}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">Database Status:</Text>
                                                <Badge colorScheme="green">Connected</Badge>
                                            </Box>
                                            <Box>
                                                <Text fontWeight="bold">File Storage:</Text>
                                                <Badge colorScheme="green">OK</Badge>
                                            </Box>
                                        </SimpleGrid>
                                        <Button colorScheme="blue" size="sm">
                                            Run System Diagnostics
                                        </Button>
                                    </CardBody>
                                </Card>
                            </SimpleGrid>

                            <Card shadow="md">
                                <CardHeader>
                                    <Heading size="md">Maintenance Logs</Heading>
                                </CardHeader>
                                <CardBody>
                                    {logsLoading ? (
                                        <Box textAlign="center" py={6}>
                                            <Spinner size="md" color="blue.500" />
                                            <Text mt={2}>Loading logs...</Text>
                                        </Box>
                                    ) : maintenanceLogs?.length === 0 ? (
                                        <Box textAlign="center" py={6}>
                                            <Text>No maintenance logs found.</Text>
                                        </Box>
                                    ) : (
                                        <Box overflowX="auto">
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Date</Th>
                                                        <Th>Action</Th>
                                                        <Th>User</Th>
                                                        <Th>Status</Th>
                                                        <Th>Details</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {maintenanceLogs?.map((log, index) => (
                                                        <Tr key={index}>
                                                            <Td>{new Date(log.timestamp).toLocaleString()}</Td>
                                                            <Td>{log.action}</Td>
                                                            <Td>{log.user}</Td>
                                                            <Td>
                                                                <Badge colorScheme={log.status === 'success' ? 'green' : 'red'}>
                                                                    {log.status}
                                                                </Badge>
                                                            </Td>
                                                            <Td>{log.details}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    )}
                                </CardBody>
                            </Card>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            )}

            {/* Add Category Modal */}
            <Modal isOpen={categoryModal.isOpen} onClose={categoryModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Category</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Category Name</FormLabel>
                            <Input
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="e.g. Programming, Business, Design"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Icon (optional)</FormLabel>
                            <Input
                                value={categoryIcon}
                                onChange={(e) => setCategoryIcon(e.target.value)}
                                placeholder="e.g. FaCode, FaBriefcase, FaPaintBrush"
                            />
                            <FormHelperText>
                                Enter an icon name from react-icons/fa
                            </FormHelperText>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={categoryModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleAddCategory}
                            isLoading={addCategoryMutation.isLoading}
                            loadingText="Adding"
                            isDisabled={!categoryName.trim()}
                        >
                            Add Category
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Backup Modal */}
            <Modal isOpen={backupModal.isOpen} onClose={backupModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create System Backup</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text mb={4}>
                            This will create a complete backup of your system data, including:
                        </Text>
                        <VStack align="start" spacing={2} mb={4} pl={4}>
                            <Text>• User accounts and profiles</Text>
                            <Text>• Courses and content</Text>
                            <Text>• Enrollments and progress data</Text>
                            <Text>• System settings and configurations</Text>
                        </VStack>
                        <Text mb={4}>
                            The backup will be downloaded to your computer as a zip file.
                        </Text>
                        <Alert status="info">
                            <AlertIcon />
                            <Text fontSize="sm">
                                This process may take a few minutes depending on the size of your data.
                            </Text>
                        </Alert>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={backupModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleBackup}
                            isLoading={backupMutation.isLoading}
                            loadingText="Creating Backup"
                        >
                            Create Backup
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Restore Modal */}
            <Modal isOpen={restoreModal.isOpen} onClose={restoreModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Restore System</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Alert status="warning" mb={4}>
                            <AlertIcon />
                            <Text fontSize="sm">
                                Warning: Restoring from a backup will replace all current data. This action cannot be undone.
                            </Text>
                        </Alert>

                        <FormControl mb={4}>
                            <FormLabel>Upload Backup File</FormLabel>
                            <Input
                                type="file"
                                accept=".zip"
                                onChange={handleFileUpload}
                            />
                        </FormControl>

                        {backupFile && (
                            <Alert status="info">
                                <AlertIcon />
                                <Text fontSize="sm">
                                    Selected file: {backupFile.name} ({(backupFile.size / (1024 * 1024)).toFixed(2)} MB)
                                </Text>
                            </Alert>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={restoreModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleRestore}
                            isLoading={restoreMutation.isLoading}
                            loadingText="Restoring"
                            isDisabled={!backupFile}
                        >
                            Restore System
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default SystemSettingsPage;