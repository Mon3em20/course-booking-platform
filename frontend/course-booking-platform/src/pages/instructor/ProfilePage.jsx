import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Avatar,
    SimpleGrid,
    VStack,
    HStack,
    Flex,
    Badge,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    IconButton,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormErrorMessage,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Card,
    CardHeader,
    CardBody,
} from '@chakra-ui/react';
import {
    FaCamera,
    FaEdit,
    FaLinkedin,
    FaTwitter,
    FaGlobe,
    FaYoutube,
    FaStar,
    FaUsers,
    FaBook,
    FaGraduationCap,
    FaBriefcase
} from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getInstructorProfile, updateInstructorProfile } from '../../api/instructor';
import { uploadProfileImage } from '../../api/upload';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
    const toast = useToast();
    const { user, updateProfile } = useAuth();
    const queryClient = useQueryClient();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get instructor profile
    const { data, isLoading, error } = useQuery(
        'instructorProfile',
        getInstructorProfile,
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
        (profileData) => updateInstructorProfile(profileData),
        {
            onSuccess: (data) => {
                toast({
                    title: 'Profile updated',
                    description: 'Your profile has been updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                updateProfile(data);
                queryClient.invalidateQueries('instructorProfile');
                onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error updating profile',
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
                updateProfile({ ...user, profileImage: data.imageUrl });
                queryClient.invalidateQueries('instructorProfile');
                setImageFile(null);
                setImagePreview(null);
            },
            onError: (error) => {
                toast({
                    title: 'Error updating profile image',
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
        title: Yup.string().required('Professional title is required'),
        bio: Yup.string().required('Bio is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone: Yup.string(),
        location: Yup.string(),
        linkedin: Yup.string().url('Must be a valid URL'),
        twitter: Yup.string(),
        website: Yup.string().url('Must be a valid URL'),
        youtube: Yup.string().url('Must be a valid URL')
    });

    // Form handling
    const formik = useFormik({
        initialValues: {
            name: data?.name || '',
            title: data?.title || '',
            bio: data?.bio || '',
            email: data?.email || '',
            phone: data?.phone || '',
            location: data?.location || '',
            linkedin: data?.socialLinks?.linkedin || '',
            twitter: data?.socialLinks?.twitter || '',
            website: data?.socialLinks?.website || '',
            youtube: data?.socialLinks?.youtube || '',
            specialization: data?.specialization || [],
            experience: data?.experience || []
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
                    youtube: values.youtube
                }
            };

            // Remove fields that should be at the top level
            delete profileData.linkedin;
            delete profileData.twitter;
            delete profileData.website;
            delete profileData.youtube;

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

    return (
        <Container maxW="container.xl" py={8}>
            {isLoading ? (
                <Box textAlign="center" py={10}>
                    <Spinner size="xl" />
                    <Text mt={4}>Loading profile information...</Text>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                    {/* Left Column - Profile Overview */}
                    <Box>
                        <Card shadow="md" mb={6}>
                            <CardHeader bg="blue.50" pb={0}>
                                <Flex direction="column" align="center">
                                    <Box position="relative">
                                        <Avatar
                                            size="2xl"
                                            src={data?.profileImage || user?.profileImage}
                                            name={data?.name || user?.name}
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
                                <Text color="blue.600" mb={3}>{data?.title}</Text>

                                <Badge colorScheme="purple" mb={4}>Instructor</Badge>

                                <Text fontSize="sm" color="gray.600" mb={4}>
                                    {data?.bio?.substring(0, 150)}{data?.bio?.length > 150 ? '...' : ''}
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
                                    {data?.email && (
                                        <HStack>
                                            <Text fontWeight="bold" minW="80px">Email:</Text>
                                            <Text>{data.email}</Text>
                                        </HStack>
                                    )}

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

                                    {data?.socialLinks?.youtube && (
                                        <HStack>
                                            <FaYoutube color="#FF0000" />
                                            <Text as="a" href={data.socialLinks.youtube} target="_blank" color="blue.500">
                                                YouTube Channel
                                            </Text>
                                        </HStack>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* Specializations */}
                        <Card shadow="md">
                            <CardHeader>
                                <Heading size="md">Specializations</Heading>
                            </CardHeader>
                            <CardBody>
                                <Flex wrap="wrap" gap={2}>
                                    {data?.specialization?.map((item, index) => (
                                        <Badge key={index} colorScheme="blue" px={3} py={1} borderRadius="full">
                                            {item}
                                        </Badge>
                                    ))}
                                    {!data?.specialization?.length && (
                                        <Text color="gray.500">No specializations added</Text>
                                    )}
                                </Flex>
                            </CardBody>
                        </Card>
                    </Box>

                    {/* Main Content Area */}
                    <Box gridColumn={{ lg: "span 2" }}>
                        {/* Statistics */}
                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                            <Stat
                                bg="white"
                                p={5}
                                borderRadius="lg"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="blue.500"
                                textAlign="center"
                            >
                                <StatLabel>Students</StatLabel>
                                <StatNumber>{data?.stats?.totalStudents || 0}</StatNumber>
                                <StatHelpText>
                                    <FaUsers />
                                </StatHelpText>
                            </Stat>

                            <Stat
                                bg="white"
                                p={5}
                                borderRadius="lg"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="green.500"
                                textAlign="center"
                            >
                                <StatLabel>Courses</StatLabel>
                                <StatNumber>{data?.stats?.totalCourses || 0}</StatNumber>
                                <StatHelpText>
                                    <FaBook />
                                </StatHelpText>
                            </Stat>

                            <Stat
                                bg="white"
                                p={5}
                                borderRadius="lg"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="purple.500"
                                textAlign="center"
                            >
                                <StatLabel>Rating</StatLabel>
                                <StatNumber>{data?.stats?.averageRating?.toFixed(1) || '0.0'}</StatNumber>
                                <HStack justify="center">
                                    <FaStar color="#FFD700" />
                                    <StatHelpText mb={0}>
                                        ({data?.stats?.totalReviews || 0} reviews)
                                    </StatHelpText>
                                </HStack>
                            </Stat>

                            <Stat
                                bg="white"
                                p={5}
                                borderRadius="lg"
                                boxShadow="sm"
                                borderLeft="4px solid"
                                borderColor="orange.500"
                                textAlign="center"
                            >
                                <StatLabel>Revenue</StatLabel>
                                <StatNumber>${data?.stats?.totalRevenue?.toFixed(2) || '0.00'}</StatNumber>
                                <StatHelpText>
                                    This month: ${data?.stats?.monthlyRevenue?.toFixed(2) || '0.00'}
                                </StatHelpText>
                            </Stat>
                        </SimpleGrid>

                        {/* Tabs Section */}
                        <Box bg="white" borderRadius="lg" shadow="md" mb={6}>
                            <Tabs colorScheme="blue" isLazy>
                                <TabList px={6} pt={4}>
                                    <Tab>About</Tab>
                                    <Tab>Experience</Tab>
                                    <Tab>Education</Tab>
                                    <Tab>Reviews</Tab>
                                </TabList>

                                <TabPanels p={6}>
                                    {/* About Tab */}
                                    <TabPanel px={0}>
                                        <Box mb={6}>
                                            <Heading size="md" mb={3}>Biography</Heading>
                                            <Text whiteSpace="pre-line">{data?.bio || 'No biography provided'}</Text>
                                        </Box>
                                    </TabPanel>

                                    {/* Experience Tab */}
                                    <TabPanel px={0}>
                                        <Box mb={4}>
                                            <Heading size="md" mb={4}>Professional Experience</Heading>
                                            {data?.experience && data.experience.length > 0 ? (
                                                <VStack align="stretch" spacing={6} divider={<Divider />}>
                                                    {data.experience.map((exp, index) => (
                                                        <Box key={index}>
                                                            <Flex justify="space-between" align="start">
                                                                <Box>
                                                                    <Heading size="sm">{exp.position}</Heading>
                                                                    <Text color="blue.600">{exp.company}</Text>
                                                                </Box>
                                                                <Badge>
                                                                    {exp.startYear} - {exp.endYear || 'Present'}
                                                                </Badge>
                                                            </Flex>
                                                            <Text mt={2}>{exp.description}</Text>
                                                        </Box>
                                                    ))}
                                                </VStack>
                                            ) : (
                                                <Text color="gray.500">No experience information added</Text>
                                            )}
                                        </Box>
                                    </TabPanel>

                                    {/* Education Tab */}
                                    <TabPanel px={0}>
                                        <Box mb={4}>
                                            <Heading size="md" mb={4}>Education</Heading>
                                            {data?.education && data.education.length > 0 ? (
                                                <VStack align="stretch" spacing={6} divider={<Divider />}>
                                                    {data.education.map((edu, index) => (
                                                        <Box key={index}>
                                                            <Flex justify="space-between" align="start">
                                                                <Box>
                                                                    <Heading size="sm">{edu.degree}</Heading>
                                                                    <Text color="blue.600">{edu.institution}</Text>
                                                                </Box>
                                                                <Badge>
                                                                    {edu.startYear} - {edu.endYear || 'Present'}
                                                                </Badge>
                                                            </Flex>
                                                            <Text mt={2}>{edu.description}</Text>
                                                        </Box>
                                                    ))}
                                                </VStack>
                                            ) : (
                                                <Text color="gray.500">No education information added</Text>
                                            )}
                                        </Box>
                                    </TabPanel>

                                    {/* Reviews Tab */}
                                    <TabPanel px={0}>
                                        <Box mb={4}>
                                            <Heading size="md" mb={4}>Student Reviews</Heading>
                                            {data?.reviews && data.reviews.length > 0 ? (
                                                <VStack align="stretch" spacing={6}>
                                                    {data.reviews.map((review, index) => (
                                                        <Box
                                                            key={index}
                                                            p={4}
                                                            borderWidth="1px"
                                                            borderRadius="md"
                                                            position="relative"
                                                        >
                                                            <HStack mb={2}>
                                                                <Avatar size="sm" name={review.studentName} src={review.studentAvatar} />
                                                                <Box>
                                                                    <Text fontWeight="bold">{review.studentName}</Text>
                                                                    <Text fontSize="xs" color="gray.500">
                                                                        {new Date(review.date).toLocaleDateString()}
                                                                    </Text>
                                                                </Box>
                                                            </HStack>

                                                            <HStack mb={3}>
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FaStar key={i} color={i < review.rating ? "#FFD700" : "#CBD5E0"} />
                                                                ))}
                                                                <Text ml={2} fontWeight="medium">
                                                                    {review.course}
                                                                </Text>
                                                            </HStack>

                                                            <Text>{review.comment}</Text>
                                                        </Box>
                                                    ))}
                                                </VStack>
                                            ) : (
                                                <Text color="gray.500">No reviews yet</Text>
                                            )}
                                        </Box>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>

                        {/* Recent Courses */}
                        <Box bg="white" p={6} borderRadius="lg" shadow="md">
                            <Flex justify="space-between" align="center" mb={4}>
                                <Heading size="md">Recent Courses</Heading>
                                <Button size="sm" variant="link" colorScheme="blue">
                                    View All
                                </Button>
                            </Flex>

                            {data?.recentCourses && data.recentCourses.length > 0 ? (
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {data.recentCourses.map((course, index) => (
                                        <Box
                                            key={index}
                                            p={4}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            display="flex"
                                            flexDirection={{ base: "column", sm: "row" }}
                                            gap={4}
                                        >
                                            <Box
                                                width={{ base: "100%", sm: "120px" }}
                                                height={{ base: "120px", sm: "80px" }}
                                                flexShrink={0}
                                            >
                                                <Image
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                    width="100%"
                                                    height="100%"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                            </Box>
                                            <Box>
                                                <Heading size="sm" mb={1}>{course.title}</Heading>
                                                <HStack mb={2}>
                                                    <Badge colorScheme="green">{course.level}</Badge>
                                                    <Text fontSize="sm">{course.students} students</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="gray.500" noOfLines={2}>
                                                    {course.description}
                                                </Text>
                                            </Box>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            ) : (
                                <Text color="gray.500">No courses created yet</Text>
                            )}
                        </Box>
                    </Box>
                </SimpleGrid>
            )}

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
                                    id="title"
                                    isInvalid={formik.touched.title && formik.errors.title}
                                >
                                    <FormLabel>Professional Title</FormLabel>
                                    <Input {...formik.getFieldProps('title')} placeholder="e.g. Web Development Instructor" />
                                    <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                                </FormControl>
                            </SimpleGrid>

                            <FormControl
                                id="bio"
                                mb={6}
                                isInvalid={formik.touched.bio && formik.errors.bio}
                            >
                                <FormLabel>Biography</FormLabel>
                                <Textarea
                                    {...formik.getFieldProps('bio')}
                                    placeholder="Tell students about yourself and your teaching style..."
                                    rows={6}
                                />
                                <FormErrorMessage>{formik.errors.bio}</FormErrorMessage>
                            </FormControl>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                                <FormControl
                                    id="email"
                                    isInvalid={formik.touched.email && formik.errors.email}
                                >
                                    <FormLabel>Email Address</FormLabel>
                                    <Input {...formik.getFieldProps('email')} />
                                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                </FormControl>

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
                                    id="youtube"
                                    isInvalid={formik.touched.youtube && formik.errors.youtube}
                                >
                                    <FormLabel>YouTube Channel</FormLabel>
                                    <Input {...formik.getFieldProps('youtube')} placeholder="https://youtube.com/c/yourchannel" />
                                    <FormErrorMessage>{formik.errors.youtube}</FormErrorMessage>
                                </FormControl>
                            </SimpleGrid>
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