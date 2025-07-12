import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    SimpleGrid,
    Flex,
    Avatar,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Textarea,
    Switch,
    Divider,
    useToast,
    Spinner,
    Card,
    CardHeader,
    CardBody,
    Badge,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { FaEdit, FaCamera, FaLinkedin, FaTwitter, FaGlobe, FaGithub } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getUserProfile, updateUserProfile } from '../../api/user';
import { uploadProfileImage } from '../../api/upload';
import { useAuth } from '../../contexts/AuthContext';
import ActivityFeed from '../../components/shared/ActivityFeed';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const toast = useToast();
    const queryClient = useQueryClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Get user profile data
    const { data, isLoading, error } = useQuery(
        'userProfile',
        getUserProfile,
        {
            onError: () => {
                toast({
                    title: 'Error loading profile',
                    description: 'Failed to load your profile data',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update profile mutation
    const updateMutation = useMutation(
        (profileData) => updateUserProfile(profileData),
        {
            onSuccess: (data) => {
                toast({
                    title: 'Profile updated',
                    description: 'Your profile has been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Update auth context with new user data
                updateProfile(data);

                // Close modal
                onClose();

                // Invalidate queries to refetch data
                queryClient.invalidateQueries('userProfile');
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to update profile',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Image upload mutation
    const imageUploadMutation = useMutation(
        (formData) => uploadProfileImage(formData),
        {
            onSuccess: (data) => {
                toast({
                    title: 'Profile image updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Update auth context with new image
                updateProfile({ ...user, profileImage: data.imageUrl });

                // Invalidate queries to refetch data
                queryClient.invalidateQueries('userProfile');
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to update profile image',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Form validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
        phone: Yup.string(),
        location: Yup.string(),
        linkedin: Yup.string().url('Must be a valid URL'),
        twitter: Yup.string(),
        website: Yup.string().url('Must be a valid URL'),
        github: Yup.string().url('Must be a valid URL'),
    });

    // Form handling
    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            email: data?.email || '',
            bio: data?.bio || '',
            phone: data?.phone || '',
            location: data?.location || '',
            linkedin: data?.socialLinks?.linkedin || '',
            twitter: data?.socialLinks?.twitter || '',
            website: data?.socialLinks?.website || '',
            github: data?.socialLinks?.github || '',
            emailNotifications: data?.preferences?.emailNotifications ?? true,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const profileData = {
                ...values,
                socialLinks: {
                    linkedin: values.linkedin,
                    twitter: values.twitter,
                    website: values.website,
                    github: values.github,
                },
                preferences: {
                    emailNotifications: values.emailNotifications,
                }
            };

            // Remove fields that should be at the top level
            delete profileData.linkedin;
            delete profileData.twitter;
            delete profileData.website;
            delete profileData.github;
            delete profileData.emailNotifications;

            updateMutation.mutate(profileData);
        },
    });

    // Handle image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image upload
    const handleImageUpload = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('profileImage', imageFile);

        imageUploadMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading your profile...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                {/* Profile Overview */}
                <Box>
                    <Card shadow="md" mb={6}>
                        <CardHeader bg="blue.50" pb={0}>
                            <Flex direction="column" align="center">
                                <Box position="relative">
                                    <Avatar
                                        size="2xl"
                                        src={data?.profileImage || 'https://bit.ly/broken-link'}
                                        name={data?.name}
                                        border="4px solid white"
                                    />
                                    <IconButton
                                        aria-label="Change profile picture"
                                        icon={<FaCamera />}
                                        size="sm"
                                        colorScheme="blue"
                                        borderRadius="full"
                                        position="absolute"
                                        bottom={0}
                                        right={0}
                                        onClick={() => document.getElementById('profile-image').click()}
                                    />
                                    <Input
                                        id="profile-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        display="none"
                                    />
                                </Box>

                                {imagePreview && (
                                    <Box mt={4} textAlign="center">
                                        <Text fontWeight="bold" mb={2}>Preview:</Text>
                                        <Avatar
                                            size="lg"
                                            src={imagePreview}
                                            mb={3}
                                        />
                                        <HStack justify="center">
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                onClick={handleImageUpload}
                                                isLoading={imageUploadMutation.isLoading}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </HStack>
                                    </Box>
                                )}
                            </Flex>
                        </CardHeader>
                        <CardBody textAlign="center" pt={6}>
                            <Heading size="md" mb={1}>{data?.name}</Heading>
                            <Text color="gray.600" mb={3}>{data?.email}</Text>

                            <Badge colorScheme="blue" mb={4}>Student</Badge>

                            <Text fontSize="sm" color="gray.600" mb={4}>
                                {data?.bio || 'No bio provided'}
                            </Text>

                            <Button
                                rightIcon={<FaEdit />}
                                size="sm"
                                onClick={onOpen}
                                colorScheme="blue"
                                variant="outline"
                            >
                                Edit Profile
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Contact & Social */}
                    <Card shadow="md" mb={6}>
                        <CardHeader>
                            <Heading size="md">Contact & Social</Heading>
                        </CardHeader>
                        <CardBody>
                            <VStack align="start" spacing={3}>
                                {data?.phone && (
                                    <HStack>
                                        <Text fontWeight="bold" minW="80px">Phone:</Text>
                                        <Text>{data.phone}</Text>
                                    </HStack>
                                )}

                                {data?.location && (
                                    <HStack>
                                        <Text fontWeight="bold" minW="80px">Location:</Text>
                                        <Text>{data.location}</Text>
                                    </HStack>
                                )}

                                <Divider my={2} />

                                {data?.socialLinks?.linkedin && (
                                    <HStack>
                                        <FaLinkedin color="#0077B5" />
                                        <Text as="a" href={data.socialLinks.linkedin} target="_blank" color="blue.500">
                                            LinkedIn Profile
                                        </Text>
                                    </HStack>
                                )}

                                {data?.socialLinks?.twitter && (
                                    <HStack>
                                        <FaTwitter color="#1DA1F2" />
                                        <Text as="a" href={data.socialLinks.twitter} target="_blank" color="blue.500">
                                            Twitter Profile
                                        </Text>
                                    </HStack>
                                )}

                                {data?.socialLinks?.website && (
                                    <HStack>
                                        <FaGlobe color="#4CAF50" />
                                        <Text as="a" href={data.socialLinks.website} target="_blank" color="blue.500">
                                            Personal Website
                                        </Text>
                                    </HStack>
                                )}

                                {data?.socialLinks?.github && (
                                    <HStack>
                                        <FaGithub color="#333" />
                                        <Text as="a" href={data.socialLinks.github} target="_blank" color="blue.500">
                                            GitHub Profile
                                        </Text>
                                    </HStack>
                                )}

                                {!data?.phone && !data?.location && !data?.socialLinks?.linkedin &&
                                    !data?.socialLinks?.twitter && !data?.socialLinks?.website && !data?.socialLinks?.github && (
                                        <Text color="gray.500" textAlign="center" width="100%">
                                            No contact or social information added yet
                                        </Text>
                                    )}
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Education (if available) */}
                    {data?.education && data.education.length > 0 && (
                        <Card shadow="md">
                            <CardHeader>
                                <Heading size="md">Education</Heading>
                            </CardHeader>
                            <CardBody>
                                <VStack align="start" spacing={4}>
                                    {data.education.map((edu, index) => (
                                        <Box key={index} width="100%">
                                            <Text fontWeight="bold">{edu.degree}</Text>
                                            <Text>{edu.institution}</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                {edu.startYear} - {edu.endYear || 'Present'}
                                            </Text>
                                            {index < data.education.length - 1 && <Divider my={2} />}
                                        </Box>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    )}
                </Box>

                {/* Profile Main Content */}
                <Box gridColumn={{ lg: "span 2" }}>
                    {/* Account Statistics */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                        <Card shadow="md" p={4} textAlign="center">
                            <Heading size="lg" color="blue.500">{data?.courseStats?.enrolled || 0}</Heading>
                            <Text fontWeight="medium">Courses Enrolled</Text>
                        </Card>

                        <Card shadow="md" p={4} textAlign="center">
                            <Heading size="lg" color="green.500">{data?.courseStats?.completed || 0}</Heading>
                            <Text fontWeight="medium">Courses Completed</Text>
                        </Card>

                        <Card shadow="md" p={4} textAlign="center">
                            <Heading size="lg" color="purple.500">{data?.certificateCount || 0}</Heading>
                            <Text fontWeight="medium">Certificates Earned</Text>
                        </Card>
                    </SimpleGrid>

                    {/* Recent Activity */}
                    <Card shadow="md" mb={6}>
                        <CardHeader>
                            <Heading size="md">Recent Activity</Heading>
                        </CardHeader>
                        <CardBody>
                            {data?.recentActivity && data.recentActivity.length > 0 ? (
                                <ActivityFeed activities={data.recentActivity} />
                            ) : (
                                <Box textAlign="center" py={6}>
                                    <Text color="gray.500">No recent activity found</Text>
                                </Box>
                            )}
                        </CardBody>
                    </Card>

                    {/* Skills & Interests (if available) */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                        <Card shadow="md">
                            <CardHeader>
                                <Heading size="md">Skills</Heading>
                            </CardHeader>
                            <CardBody>
                                {data?.skills && data.skills.length > 0 ? (
                                    <Flex wrap="wrap" gap={2}>
                                        {data.skills.map((skill, index) => (
                                            <Badge key={index} colorScheme="blue" px={3} py={1} borderRadius="full">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text color="gray.500" textAlign="center">No skills added yet</Text>
                                )}
                            </CardBody>
                        </Card>

                        <Card shadow="md">
                            <CardHeader>
                                <Heading size="md">Interests</Heading>
                            </CardHeader>
                            <CardBody>
                                {data?.interests && data.interests.length > 0 ? (
                                    <Flex wrap="wrap" gap={2}>
                                        {data.interests.map((interest, index) => (
                                            <Badge key={index} colorScheme="purple" px={3} py={1} borderRadius="full">
                                                {interest}
                                            </Badge>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text color="gray.500" textAlign="center">No interests added yet</Text>
                                )}
                            </CardBody>
                        </Card>
                    </SimpleGrid>
                </Box>
            </SimpleGrid>

            {/* Edit Profile Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Profile</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form id="edit-profile-form" onSubmit={formik.handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                <FormControl
                                    id="name"
                                    isInvalid={formik.touched.name && formik.errors.name}
                                >
                                    <FormLabel>Full Name</FormLabel>
                                    <Input {...formik.getFieldProps('name')} />
                                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="email"
                                    isInvalid={formik.touched.email && formik.errors.email}
                                >
                                    <FormLabel>Email Address</FormLabel>
                                    <Input {...formik.getFieldProps('email')} />
                                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                </FormControl>
                            </SimpleGrid>

                            <FormControl
                                id="bio"
                                mb={6}
                                isInvalid={formik.touched.bio && formik.errors.bio}
                            >
                                <FormLabel>Bio</FormLabel>
                                <Textarea
                                    {...formik.getFieldProps('bio')}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                                <FormErrorMessage>{formik.errors.bio}</FormErrorMessage>
                            </FormControl>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                <FormControl
                                    id="phone"
                                    isInvalid={formik.touched.phone && formik.errors.phone}
                                >
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input {...formik.getFieldProps('phone')} />
                                    <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="location"
                                    isInvalid={formik.touched.location && formik.errors.location}
                                >
                                    <FormLabel>Location</FormLabel>
                                    <Input {...formik.getFieldProps('location')} placeholder="City, Country" />
                                    <FormErrorMessage>{formik.errors.location}</FormErrorMessage>
                                </FormControl>
                            </SimpleGrid>

                            <Heading size="sm" mb={4}>Social Links</Heading>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                <FormControl
                                    id="linkedin"
                                    isInvalid={formik.touched.linkedin && formik.errors.linkedin}
                                >
                                    <FormLabel>LinkedIn</FormLabel>
                                    <Input {...formik.getFieldProps('linkedin')} placeholder="https://linkedin.com/in/username" />
                                    <FormErrorMessage>{formik.errors.linkedin}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="twitter"
                                    isInvalid={formik.touched.twitter && formik.errors.twitter}
                                >
                                    <FormLabel>Twitter</FormLabel>
                                    <Input {...formik.getFieldProps('twitter')} placeholder="@username" />
                                    <FormErrorMessage>{formik.errors.twitter}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="website"
                                    isInvalid={formik.touched.website && formik.errors.website}
                                >
                                    <FormLabel>Personal Website</FormLabel>
                                    <Input {...formik.getFieldProps('website')} placeholder="https://yourwebsite.com" />
                                    <FormErrorMessage>{formik.errors.website}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    id="github"
                                    isInvalid={formik.touched.github && formik.errors.github}
                                >
                                    <FormLabel>GitHub</FormLabel>
                                    <Input {...formik.getFieldProps('github')} placeholder="https://github.com/username" />
                                    <FormErrorMessage>{formik.errors.github}</FormErrorMessage>
                                </FormControl>
                            </SimpleGrid>

                            <Heading size="sm" mb={4}>Preferences</Heading>

                            <FormControl display="flex" alignItems="center" mb={6}>
                                <FormLabel htmlFor="emailNotifications" mb={0}>
                                    Email Notifications
                                </FormLabel>
                                <Switch
                                    id="emailNotifications"
                                    isChecked={formik.values.emailNotifications}
                                    onChange={() =>
                                        formik.setFieldValue('emailNotifications', !formik.values.emailNotifications)
                                    }
                                />
                            </FormControl>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            form="edit-profile-form"
                            isLoading={updateMutation.isLoading}
                            loadingText="Saving"
                        >
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default ProfilePage;