import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    Grid,
    GridItem,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button,
    List,
    ListItem,
    HStack,
    Icon,
    Progress,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Avatar,
    Badge,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    VStack,
} from '@chakra-ui/react';
import {
    FaPlay,
    FaCheck,
    FaLock,
    FaFilePdf,
    FaFileDownload,
    FaChevronRight,
    FaUsers,
    FaComments,
    FaBook,
    FaInfoCircle
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getCourseContent } from '../../api/student';

const CourseContentPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [currentLessonTitle, setCurrentLessonTitle] = useState('');

    // Get course content
    const { data: course, isLoading, error } = useQuery(
        ['courseContent', courseId],
        () => getCourseContent(courseId),
        {
            onSuccess: (data) => {
                // Find the first lesson to display by default
                if (data?.curriculum?.[0]?.lessons?.[0]) {
                    const firstLesson = data.curriculum[0].lessons[0];
                    setCurrentLessonId(firstLesson.id);
                    setCurrentVideoUrl(firstLesson.videoUrl);
                    setCurrentLessonTitle(firstLesson.title);
                }
            },
            onError: () => {
                toast({
                    title: 'Error loading course content',
                    description: 'Please try again later',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Lesson selection handler
    const handleSelectLesson = (lesson) => {
        // Check if lesson is locked
        if (lesson.locked && !course.isInstructor) {
            toast({
                title: 'Lesson locked',
                description: 'This lesson is not available yet',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        setCurrentLessonId(lesson.id);
        setCurrentVideoUrl(lesson.videoUrl);
        setCurrentLessonTitle(lesson.title);

        // Mark lesson as viewed if not already
        if (!lesson.completed && !course.isInstructor) {
            // In a real app, this would call an API to mark the lesson as completed
            console.log(`Marking lesson ${lesson.id} as completed`);
        }
    };

    // Calculate overall course progress
    const calculateProgress = () => {
        if (!course?.curriculum) return 0;

        let totalLessons = 0;
        let completedLessons = 0;

        course.curriculum.forEach(section => {
            section.lessons.forEach(lesson => {
                totalLessons++;
                if (lesson.completed) completedLessons++;
            });
        });

        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    };

    // Download handler
    const handleDownload = (resourceUrl, resourceName) => {
        // In a real app, this would be handled differently
        toast({
            title: 'Downloading...',
            description: `Downloading ${resourceName}`,
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={10} textAlign="center">
                <Spinner size="xl" thickness="4px" color="blue.500" />
                <Text mt={4}>Loading course content...</Text>
            </Container>
        );
    }

    if (error || !course) {
        return (
            <Container maxW="container.xl" py={10}>
                <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Text>Error loading course content. Please try again later.</Text>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={6}>
            {/* Breadcrumb Navigation */}
            <Breadcrumb mb={4} separator={<FaChevronRight color="gray.500" />}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={RouterLink} to="/dashboard/my-courses">My Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">{course.title}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            {/* Course Title and Progress */}
            <Flex
                justify="space-between"
                align="center"
                mb={6}
                direction={{ base: "column", md: "row" }}
                gap={4}
            >
                <Box>
                    <Heading size="lg">{course.title}</Heading>
                    <HStack mt={2}>
                        <Avatar size="sm" name={course.instructor?.name} src={course.instructor?.avatar} />
                        <Text>{course.instructor?.name}</Text>
                    </HStack>
                </Box>

                <VStack align={{ base: "stretch", md: "flex-end" }} w={{ base: "100%", md: "auto" }}>
                    <HStack justify="space-between">
                        <Text>Your Progress</Text>
                        <Text fontWeight="bold">{calculateProgress()}%</Text>
                    </HStack>
                    <Progress
                        value={calculateProgress()}
                        colorScheme="green"
                        size="sm"
                        w={{ base: "100%", md: "200px" }}
                        borderRadius="md"
                    />
                </VStack>
            </Flex>

            {/* Main Content Grid */}
            <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
                {/* Video Player and Content */}
                <GridItem>
                    <Box mb={6} bg="black" borderRadius="md" overflow="hidden">
                        {currentVideoUrl ? (
                            <Box aspectRatio={16/9}>
                                <iframe
                                    src={currentVideoUrl}
                                    title={currentLessonTitle}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </Box>
                        ) : (
                            <Flex
                                justify="center"
                                align="center"
                                bg="gray.800"
                                color="white"
                                h="400px"
                                direction="column"
                            >
                                <Icon as={FaPlay} w={12} h={12} mb={4} />
                                <Text>Select a lesson to start learning</Text>
                            </Flex>
                        )}
                    </Box>

                    <Box mb={6}>
                        <Heading size="md" mb={2}>{currentLessonTitle || 'Course Content'}</Heading>
                        {currentLessonId && (
                            <Text color="gray.600">
                                {course.curriculum.flatMap(section => section.lessons)
                                    .find(lesson => lesson.id === currentLessonId)?.description || ''}
                            </Text>
                        )}
                    </Box>

                    {/* Tabs for additional content */}
                    <Tabs colorScheme="blue" variant="enclosed" mb={6}>
                        <TabList>
                            <Tab><Icon as={FaInfoCircle} mr={2} /> Overview</Tab>
                            <Tab><Icon as={FaFileDownload} mr={2} /> Resources</Tab>
                            <Tab><Icon as={FaComments} mr={2} /> Discussion</Tab>
                            <Tab><Icon as={FaUsers} mr={2} /> Students</Tab>
                        </TabList>

                        <TabPanels>
                            {/* Overview Tab */}
                            <TabPanel>
                                <Box mb={6}>
                                    <Heading size="sm" mb={2}>About This Course</Heading>
                                    <Text>{course.description}</Text>
                                </Box>

                                <Box mb={6}>
                                    <Heading size="sm" mb={2}>Learning Outcomes</Heading>
                                    <List spacing={2}>
                                        {course.learningOutcomes?.map((outcome, index) => (
                                            <ListItem key={index} display="flex" alignItems="flex-start">
                                                <Icon as={FaCheck} color="green.500" mt={1} mr={2} />
                                                <Text>{outcome}</Text>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>

                                <Box mb={6}>
                                    <Heading size="sm" mb={2}>Prerequisites</Heading>
                                    <List spacing={2}>
                                        {course.prerequisites?.map((prereq, index) => (
                                            <ListItem key={index} display="flex" alignItems="flex-start">
                                                <Icon as={FaBook} color="blue.500" mt={1} mr={2} />
                                                <Text>{prereq}</Text>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </TabPanel>

                            {/* Resources Tab */}
                            <TabPanel>
                                <List spacing={4}>
                                    {course.resources?.map((resource, index) => (
                                        <ListItem
                                            key={index}
                                            p={4}
                                            borderWidth="1px"
                                            borderRadius="md"
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <HStack>
                                                <Icon
                                                    as={resource.type === 'pdf' ? FaFilePdf : FaFileDownload}
                                                    color={resource.type === 'pdf' ? 'red.500' : 'blue.500'}
                                                    boxSize={5}
                                                />
                                                <Box>
                                                    <Text fontWeight="medium">{resource.name}</Text>
                                                    <Text fontSize="sm" color="gray.500">{resource.size}</Text>
                                                </Box>
                                            </HStack>
                                            <Button
                                                size="sm"
                                                leftIcon={<FaFileDownload />}
                                                onClick={() => handleDownload(resource.url, resource.name)}
                                            >
                                                Download
                                            </Button>
                                        </ListItem>
                                    ))}

                                    {!course.resources?.length && (
                                        <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                                            <Text>No resources available for this course yet.</Text>
                                        </Box>
                                    )}
                                </List>
                            </TabPanel>

                            {/* Discussion Tab */}
                            <TabPanel>
                                {/* This would be a more complex component in a real app */}
                                <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                                    <Text mb={4}>Join the course discussion forum to ask questions and share insights.</Text>
                                    <Button colorScheme="blue">Go to Discussion Forum</Button>
                                </Box>
                            </TabPanel>

                            {/* Students Tab */}
                            <TabPanel>
                                {/* This would show other enrolled students */}
                                <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
                                    <Text mb={2}>
                                        <strong>{course.enrolledCount}</strong> students enrolled in this course
                                    </Text>
                                    <Text>Connect with fellow students to enhance your learning experience.</Text>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </GridItem>

                {/* Course Curriculum */}
                <GridItem>
                    <Box
                        borderWidth="1px"
                        borderRadius="md"
                        overflow="hidden"
                        position="sticky"
                        top="80px"
                    >
                        <Box bg="gray.100" p={4}>
                            <Heading size="md">Course Curriculum</Heading>
                        </Box>

                        <Accordion allowMultiple defaultIndex={[0]} overflowY="auto" maxH="70vh">
                            {course.curriculum?.map((section, sectionIndex) => (
                                <AccordionItem key={sectionIndex} borderTop="none">
                                    <AccordionButton py={3} bg="gray.50">
                                        <Box flex="1" textAlign="left" fontWeight="semibold">
                                            {section.title}
                                        </Box>
                                        <Text fontSize="sm" color="gray.500" mr={2}>
                                            {section.lessons.length} lessons
                                        </Text>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel p={0}>
                                        <List>
                                            {section.lessons.map((lesson, lessonIndex) => (
                                                <ListItem
                                                    key={lessonIndex}
                                                    p={3}
                                                    borderTopWidth="1px"
                                                    bg={currentLessonId === lesson.id ? "blue.50" : "white"}
                                                    cursor="pointer"
                                                    transition="all 0.2s"
                                                    _hover={{ bg: currentLessonId === lesson.id ? "blue.50" : "gray.50" }}
                                                    onClick={() => handleSelectLesson(lesson)}
                                                >
                                                    <Flex align="center" justify="space-between">
                                                        <HStack flex="1">
                                                            <Icon
                                                                as={lesson.completed ? FaCheck : lesson.locked ? FaLock : FaPlay}
                                                                color={
                                                                    lesson.completed ? "green.500" :
                                                                        lesson.locked ? "gray.400" :
                                                                            currentLessonId === lesson.id ? "blue.500" : "gray.500"
                                                                }
                                                                boxSize={4}
                                                            />
                                                            <Box>
                                                                <Text
                                                                    fontWeight={currentLessonId === lesson.id ? "medium" : "normal"}
                                                                    color={lesson.locked ? "gray.500" : "inherit"}
                                                                >
                                                                    {lesson.title}
                                                                </Text>
                                                                <Text fontSize="xs" color="gray.500">
                                                                    {lesson.duration} minutes
                                                                </Text>
                                                            </Box>
                                                        </HStack>

                                                        {lesson.completed && (
                                                            <Badge colorScheme="green" variant="subtle">
                                                                Completed
                                                            </Badge>
                                                        )}

                                                        {lesson.locked && (
                                                            <Badge colorScheme="gray">
                                                                Locked
                                                            </Badge>
                                                        )}
                                                    </Flex>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Box>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default CourseContentPage;