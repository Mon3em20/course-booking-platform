import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box, Container, Heading, Button, FormControl, FormLabel,
    Input, Textarea, Select, NumberInput, NumberInputField,
    FormErrorMessage, VStack, HStack, useToast, Spinner,
    Alert, AlertIcon, Grid, GridItem, SimpleGrid, Text,
    Tabs, TabList, Tab, TabPanels, TabPanel, Divider,
    IconButton, Flex, Tag, TagLabel, TagCloseButton,
    useDisclosure, Checkbox, Image
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaPlus, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import { getCourse, createCourse, updateCourse } from '../../api/instructor';
import { uploadCourseImage, uploadCourseMaterial } from '../../api/upload';
import SessionForm from '../../components/instructor/SessionForm';
import MaterialUploadModal from '../../components/instructor/MaterialUploadModal';
import LearningOutcomeForm from '../../components/instructor/LearningOutcomeForm';

const CourseFormPage = () => {
    const [materialModalOpen, setMaterialModalOpen] = useState(false);

    const { courseId } = useParams();
    const isEditMode = Boolean(courseId);
    const navigate = useNavigate();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [outcomes, setOutcomes] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Fetch course data if in edit mode
    const { data: courseData, isLoading: isCourseLoading, error: courseError } = useQuery(
        ['course', courseId],
        () => getCourse(courseId),
        {
            enabled: isEditMode,
            onSuccess: (data) => {
                formik.setValues({
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price || 0,
                    category: data.category || '',
                    duration: data.duration || 1,
                    capacity: data.capacity || 10,
                    level: data.level || 'beginner',
                    language: data.language || 'english',
                    startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
                    endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
                    isActive: data.isActive || false,
                });

                setOutcomes(data.learningOutcomes || []);
                setRequirements(data.requirements || []);
                setSessions(data.sessions || []);

                if (data.imageUrl) {
                    setImagePreview(data.imageUrl);
                }
            }
        }
    );

    // Form validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
        category: Yup.string().required('Category is required'),
        duration: Yup.number().min(1, 'Duration must be at least 1 hour').required('Duration is required'),
        capacity: Yup.number().min(1, 'Capacity must be at least 1').required('Capacity is required'),
        level: Yup.string().required('Level is required'),
        language: Yup.string().required('Language is required'),
        startDate: Yup.date().required('Start date is required'),
        endDate: Yup.date().min(
            Yup.ref('startDate'),
            'End date cannot be before start date'
        ).required('End date is required'),
    });

    // Create/Update course mutation
    const courseMutation = useMutation(
        isEditMode ? updateCourse : createCourse,
        {
            onSuccess: (data) => {
                const message = isEditMode ? 'Course updated successfully' : 'Course created successfully';
                toast({
                    title: message,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

                queryClient.invalidateQueries('instructorCourses');

                if (!isEditMode) {
                    navigate(`/instructor/courses/edit/${data._id}`);
                }
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message || (isEditMode ? 'Failed to update course' : 'Failed to create course'),
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    // Image upload mutation
    const imageUploadMutation = useMutation(uploadCourseImage, {
        onSuccess: (data) => {
            toast({
                title: 'Image uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            return data.imageUrl;
        },
        onError: () => {
            toast({
                title: 'Failed to upload image',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return null;
        }
    });

    // Form handling
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: 0,
            category: '',
            duration: 1,
            capacity: 10,
            level: 'beginner',
            language: 'english',
            startDate: '',
            endDate: '',
            isActive: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            let imageUrl = courseData?.imageUrl;

            if (imageFile) {
                const formData = new FormData();
                formData.append('courseImage', imageFile);

                try {
                    const response = await imageUploadMutation.mutateAsync(formData);
                    imageUrl = response.imageUrl;
                } catch (error) {
                    // Image upload failed, but we'll continue with course creation/update
                    console.error('Image upload failed:', error);
                }
            }

            const courseData = {
                ...values,
                learningOutcomes: outcomes,
                requirements,
                sessions,
                imageUrl,
            };

            if (isEditMode) {
                courseMutation.mutate({ courseId, courseData });
            } else {
                courseMutation.mutate(courseData);
            }
        },
    });

    // Handle image selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);

            // Preview image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle adding/removing learning outcomes
    const handleAddOutcome = (outcome) => {
        setOutcomes([...outcomes, outcome]);
    };

    const handleRemoveOutcome = (index) => {
        setOutcomes(outcomes.filter((_, i) => i !== index));
    };

    // Handle adding/removing requirements
    const handleAddRequirement = (requirement) => {
        setRequirements([...requirements, requirement]);
    };

    const handleRemoveRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    // Handle adding/removing sessions
    const handleAddSession = (session) => {
        setSessions([...sessions, session]);
    };

    const handleUpdateSession = (index, updatedSession) => {
        const updatedSessions = [...sessions];
        updatedSessions[index] = updatedSession;
        setSessions(updatedSessions);
    };

    const handleRemoveSession = (index) => {
        setSessions(sessions.filter((_, i) => i !== index));
    };

    if (isEditMode && isCourseLoading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading course data...</Text>
            </Box>
        );
    }

    if (isEditMode && courseError) {
        return (
            <Alert status="error" variant="subtle">
                <AlertIcon />
                Failed to load course data. Please try again.
            </Alert>
        );
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Box mb={6}>
                <Heading size="lg">{isEditMode ? 'Edit Course' : 'Create New Course'}</Heading>
                <Text color="gray.600">
                    {isEditMode ? 'Update your course information' : 'Fill in the details to create a new course'}
                </Text>
            </Box>

            <form onSubmit={formik.handleSubmit}>
                <Tabs colorScheme="blue" isLazy>
                    <TabList>
                        <Tab>Basic Information</Tab>
                        <Tab>Course Content</Tab>
                        <Tab>Schedule & Sessions</Tab>
                        <Tab>Materials & Media</Tab>
                    </TabList>

                    <TabPanels>
                        {/* Basic Information Tab */}
                        <TabPanel>
                            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
                                <GridItem>
                                    <VStack spacing={4} align="stretch">
                                        <FormControl
                                            id="title"
                                            isInvalid={formik.touched.title && formik.errors.title}
                                        >
                                            <FormLabel>Course Title</FormLabel>
                                            <Input
                                                name="title"
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl
                                            id="description"
                                            isInvalid={formik.touched.description && formik.errors.description}
                                        >
                                            <FormLabel>Description</FormLabel>
                                            <Textarea
                                                name="description"
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                rows={6}
                                            />
                                            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                                        </FormControl>

                                        <SimpleGrid columns={2} spacing={4}>
                                            <FormControl
                                                id="category"
                                                isInvalid={formik.touched.category && formik.errors.category}
                                            >
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    name="category"
                                                    value={formik.values.category}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                >
                                                    <option value="">Select a category</option>
                                                    <option value="Programming">Programming</option>
                                                    <option value="Business">Business</option>
                                                    <option value="Design">Design</option>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Health">Health</option>
                                                    <option value="Personal Development">Personal Development</option>
                                                    <option value="Science">Science</option>
                                                    <option value="Languages">Languages</option>
                                                    <option value="Arts">Arts</option>
                                                    <option value="Other">Other</option>
                                                </Select>
                                                <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl
                                                id="price"
                                                isInvalid={formik.touched.price && formik.errors.price}
                                            >
                                                <FormLabel>Price ($)</FormLabel>
                                                <NumberInput
                                                    min={0}
                                                    precision={2}
                                                    value={formik.values.price}
                                                    onChange={(value) => formik.setFieldValue('price', value)}
                                                >
                                                    <NumberInputField
                                                        name="price"
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </NumberInput>
                                                <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
                                            </FormControl>
                                        </SimpleGrid>

                                        <SimpleGrid columns={2} spacing={4}>
                                            <FormControl
                                                id="level"
                                                isInvalid={formik.touched.level && formik.errors.level}
                                            >
                                                <FormLabel>Level</FormLabel>
                                                <Select
                                                    name="level"
                                                    value={formik.values.level}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                >
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                    <option value="all-levels">All Levels</option>
                                                </Select>
                                                <FormErrorMessage>{formik.errors.level}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl
                                                id="language"
                                                isInvalid={formik.touched.language && formik.errors.language}
                                            >
                                                <FormLabel>Language</FormLabel>
                                                <Select
                                                    name="language"
                                                    value={formik.values.language}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                >
                                                    <option value="english">English</option>
                                                    <option value="arabic">Arabic</option>
                                                    <option value="french">French</option>
                                                    <option value="spanish">Spanish</option>
                                                    <option value="german">German</option>
                                                    <option value="chinese">Chinese</option>
                                                    <option value="japanese">Japanese</option>
                                                    <option value="other">Other</option>
                                                </Select>
                                                <FormErrorMessage>{formik.errors.language}</FormErrorMessage>
                                            </FormControl>
                                        </SimpleGrid>

                                        <SimpleGrid columns={2} spacing={4}>
                                            <FormControl
                                                id="duration"
                                                isInvalid={formik.touched.duration && formik.errors.duration}
                                            >
                                                <FormLabel>Duration (hours)</FormLabel>
                                                <NumberInput
                                                    min={1}
                                                    value={formik.values.duration}
                                                    onChange={(value) => formik.setFieldValue('duration', value)}
                                                >
                                                    <NumberInputField
                                                        name="duration"
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </NumberInput>
                                                <FormErrorMessage>{formik.errors.duration}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl
                                                id="capacity"
                                                isInvalid={formik.touched.capacity && formik.errors.capacity}
                                            >
                                                <FormLabel>Capacity</FormLabel>
                                                <NumberInput
                                                    min={1}
                                                    value={formik.values.capacity}
                                                    onChange={(value) => formik.setFieldValue('capacity', value)}
                                                >
                                                    <NumberInputField
                                                        name="capacity"
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </NumberInput>
                                                <FormErrorMessage>{formik.errors.capacity}</FormErrorMessage>
                                            </FormControl>
                                        </SimpleGrid>

                                        <SimpleGrid columns={2} spacing={4}>
                                            <FormControl
                                                id="startDate"
                                                isInvalid={formik.touched.startDate && formik.errors.startDate}
                                            >
                                                <FormLabel>Start Date</FormLabel>
                                                <Input
                                                    type="date"
                                                    name="startDate"
                                                    value={formik.values.startDate}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                <FormErrorMessage>{formik.errors.startDate}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl
                                                id="endDate"
                                                isInvalid={formik.touched.endDate && formik.errors.endDate}
                                            >
                                                <FormLabel>End Date</FormLabel>
                                                <Input
                                                    type="date"
                                                    name="endDate"
                                                    value={formik.values.endDate}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                <FormErrorMessage>{formik.errors.endDate}</FormErrorMessage>
                                            </FormControl>
                                        </SimpleGrid>

                                        <FormControl id="isActive">
                                            <Checkbox
                                                name="isActive"
                                                isChecked={formik.values.isActive}
                                                onChange={formik.handleChange}
                                            >
                                                Make course active and available for enrollment
                                            </Checkbox>
                                        </FormControl>
                                    </VStack>
                                </GridItem>

                                <GridItem>
                                    <FormControl mb={4}>
                                        <FormLabel>Course Image</FormLabel>
                                        <Box
                                            borderWidth="1px"
                                            borderRadius="md"
                                            p={2}
                                            position="relative"
                                            textAlign="center"
                                        >
                                            {imagePreview ? (
                                                <Box position="relative">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Course preview"
                                                        maxH="200px"
                                                        mx="auto"
                                                        borderRadius="md"
                                                    />
                                                    <Button
                                                        position="absolute"
                                                        bottom="2"
                                                        right="2"
                                                        size="sm"
                                                        colorScheme="red"
                                                        onClick={() => {
                                                            setImageFile(null);
                                                            setImagePreview(null);
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Box
                                                    py={10}
                                                    bg="gray.50"
                                                    borderRadius="md"
                                                    cursor="pointer"
                                                    onClick={() => document.getElementById('course-image').click()}
                                                >
                                                    <FaImage size={40} style={{ margin: '0 auto' }} color="#CBD5E0" />
                                                    <Text mt={2} color="gray.500">Click to upload image</Text>
                                                </Box>
                                            )}
                                            <Input
                                                id="course-image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                display="none"
                                            />
                                        </Box>
                                        <Text fontSize="sm" color="gray.500" mt={2}>
                                            Recommended size: 1280x720 pixels (16:9 aspect ratio)
                                        </Text>
                                    </FormControl>

                                    <Box
                                        mt={6}
                                        p={4}
                                        bg="blue.50"
                                        borderRadius="md"
                                        borderLeft="4px solid"
                                        borderColor="blue.500"
                                    >
                                        <Heading size="sm" mb={2}>Tips for creating a great course</Heading>
                                        <Text fontSize="sm">
                                            <ul style={{ paddingLeft: '20px' }}>
                                                <li>Write a clear and descriptive title</li>
                                                <li>Provide detailed course description</li>
                                                <li>Set appropriate difficulty level</li>
                                                <li>Add comprehensive learning outcomes</li>
                                                <li>Include engaging visuals and materials</li>
                                                <li>Organize your sessions logically</li>
                                            </ul>
                                        </Text>
                                    </Box>
                                </GridItem>
                            </Grid>
                        </TabPanel>

                        {/* Course Content Tab */}
                        <TabPanel>
                            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
                                {/* Learning Outcomes */}
                                <GridItem>
                                    <Box borderWidth="1px" borderRadius="md" p={4} mb={6}>
                                        <Heading size="md" mb={4}>Learning Outcomes</Heading>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            Specify what students will learn from this course
                                        </Text>

                                        <LearningOutcomeForm onAdd={handleAddOutcome} />

                                        <Divider my={4} />

                                        {outcomes.length === 0 ? (
                                            <Text color="gray.500" textAlign="center" py={4}>
                                                No learning outcomes added yet
                                            </Text>
                                        ) : (
                                            <VStack align="stretch" spacing={2}>
                                                {outcomes.map((outcome, index) => (
                                                    <Flex
                                                        key={index}
                                                        justify="space-between"
                                                        p={2}
                                                        borderWidth="1px"
                                                        borderRadius="md"
                                                        align="center"
                                                    >
                                                        <Text>{outcome}</Text>
                                                        <IconButton
                                                            icon={<FaTrash />}
                                                            size="sm"
                                                            aria-label="Delete outcome"
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            onClick={() => handleRemoveOutcome(index)}
                                                        />
                                                    </Flex>
                                                ))}
                                            </VStack>
                                        )}
                                    </Box>
                                </GridItem>

                                {/* Course Requirements */}
                                <GridItem>
                                    <Box borderWidth="1px" borderRadius="md" p={4}>
                                        <Heading size="md" mb={4}>Course Requirements</Heading>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            Specify any prerequisites or requirements for this course
                                        </Text>

                                        <LearningOutcomeForm
                                            onAdd={handleAddRequirement}
                                            placeholder="Enter a requirement"
                                            buttonText="Add Requirement"
                                        />

                                        <Divider my={4} />

                                        {requirements.length === 0 ? (
                                            <Text color="gray.500" textAlign="center" py={4}>
                                                No requirements added yet
                                            </Text>
                                        ) : (
                                            <VStack align="stretch" spacing={2}>
                                                {requirements.map((requirement, index) => (
                                                    <Flex
                                                        key={index}
                                                        justify="space-between"
                                                        p={2}
                                                        borderWidth="1px"
                                                        borderRadius="md"
                                                        align="center"
                                                    >
                                                        <Text>{requirement}</Text>
                                                        <IconButton
                                                            icon={<FaTrash />}
                                                            size="sm"
                                                            aria-label="Delete requirement"
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            onClick={() => handleRemoveRequirement(index)}
                                                        />
                                                    </Flex>
                                                ))}
                                            </VStack>
                                        )}
                                    </Box>
                                </GridItem>
                            </Grid>
                        </TabPanel>

                        {/* Schedule & Sessions Tab */}
                        <TabPanel>
                            <Box mb={6}>
                                <Flex justify="space-between" align="center" mb={4}>
                                    <Heading size="md">Course Sessions</Heading>
                                    <Button
                                        colorScheme="blue"
                                        leftIcon={<FaPlus />}
                                        onClick={() => onOpen()}
                                    >
                                        Add Session
                                    </Button>
                                </Flex>

                                {sessions.length === 0 ? (
                                    <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
                                        <Text mb={4}>No sessions added yet</Text>
                                        <Button
                                            colorScheme="blue"
                                            onClick={() => onOpen()}
                                        >
                                            Add Your First Session
                                        </Button>
                                    </Box>
                                ) : (
                                    <VStack align="stretch" spacing={4}>
                                        {sessions.map((session, index) => (
                                            <Box
                                                key={index}
                                                p={4}
                                                borderWidth="1px"
                                                borderRadius="md"
                                                position="relative"
                                            >
                                                <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }} gap={4}>
                                                    <Box>
                                                        <Heading size="sm">{session.title}</Heading>
                                                        <Text mt={1} fontSize="sm" color="gray.600">
                                                            {session.description}
                                                        </Text>
                                                    </Box>

                                                    <Box>
                                                        <Text fontSize="sm" fontWeight="bold">Date & Time</Text>
                                                        <Text fontSize="sm">
                                                            {new Date(session.date).toLocaleDateString()} | {session.startTime} - {session.endTime}
                                                        </Text>
                                                    </Box>

                                                    <Flex justify="flex-end">
                                                        <Button
                                                            size="sm"
                                                            mr={2}
                                                            onClick={() => {
                                                                onOpen();
                                                                // Set session for editing
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            onClick={() => handleRemoveSession(index)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Flex>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </VStack>
                                )}
                            </Box>

                            {/* Session Modal */}
                            <SessionForm
                                isOpen={isOpen}
                                onClose={onClose}
                                onAdd={handleAddSession}
                                onUpdate={handleUpdateSession}
                            />
                        </TabPanel>

                        {/* Materials & Media Tab */}
                        <TabPanel>
                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                                <GridItem>
                                    <Box borderWidth="1px" borderRadius="md" p={4} mb={6}>
                                        <Heading size="md" mb={4}>Course Materials</Heading>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            Upload PDFs, presentations, and other course materials
                                        </Text>

                                        <Button
                                            leftIcon={<FaUpload />}
                                            onClick={() => setMaterialModalOpen(true)}
                                            mb={4}
                                            w="full"
                                        >
                                            Upload Material
                                        </Button>

                                        <Text fontSize="sm" color="gray.500">
                                            Allowed file types: PDF, PPT, DOCX, ZIP (Max size: 50MB)
                                        </Text>
                                    </Box>
                                </GridItem>

                                <GridItem>
                                    <Box borderWidth="1px" borderRadius="md" p={4}>
                                        <Heading size="md" mb={4}>Video Content</Heading>
                                        <Text fontSize="sm" color="gray.600" mb={4}>
                                            Add video content or preview for your course
                                        </Text>

                                        <FormControl mb={4}>
                                            <FormLabel>Video Preview URL</FormLabel>
                                            <Input placeholder="https://www.youtube.com/watch?v=..." />
                                            <Text fontSize="xs" color="gray.500" mt={1}>
                                                YouTube, Vimeo, or other video hosting URLs
                                            </Text>
                                        </FormControl>

                                        {/* Video embed preview would go here */}
                                    </Box>
                                </GridItem>
                            </Grid>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                <Divider my={8} />

                <HStack justifyContent="space-between">
                    {isEditMode ? (
                        <Button
                            variant="outline"
                            colorScheme="red"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to discard changes?')) {
                                    navigate('/instructor/courses');
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to discard this course?')) {
                                    navigate('/instructor/courses');
                                }
                            }}
                        >
                            Discard
                        </Button>
                    )}

                    <HStack>
                        {isEditMode && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (window.confirm('Do you want to save as draft?')) {
                                        formik.setFieldValue('isActive', false);
                                        formik.submitForm();
                                    }
                                }}
                            >
                                Save as Draft
                            </Button>
                        )}

                        <Button
                            colorScheme="blue"
                            type="submit"
                            isLoading={formik.isSubmitting || courseMutation.isLoading}
                        >
                            {isEditMode ? 'Update Course' : 'Create Course'}
                        </Button>
                    </HStack>
                </HStack>
            </form>

            {/* Material Upload Modal - Fixed by moving it outside the form */}
            {courseId && (
                <MaterialUploadModal
                    isOpen={materialModalOpen}
                    onClose={() => setMaterialModalOpen(false)}
                    courseId={courseId}
                    onMaterialAdded={(material) => {
                        toast({
                            title: "Material added",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                    }}
                />
            )}
        </Container>
    );
};

export default CourseFormPage;