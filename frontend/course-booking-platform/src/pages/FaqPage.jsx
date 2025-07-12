import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    Button,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Flex,
    Tag,
    Link,
    Divider,
} from '@chakra-ui/react';
import { FaSearch, FaAngleRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const FaqPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // FAQ Categories
    const categories = [
        { id: 'general', name: 'General Questions' },
        { id: 'account', name: 'Account & Profile' },
        { id: 'courses', name: 'Courses & Learning' },
        { id: 'payment', name: 'Payment & Pricing' },
        { id: 'certificates', name: 'Certificates' },
        { id: 'technical', name: 'Technical Support' },
    ];

    // FAQ Data
    const faqData = {
        general: [
            {
                question: 'What is CourseHub?',
                answer: 'CourseHub is an online learning platform that connects students with expert instructors across a wide range of subjects. We offer high-quality courses designed to help you learn new skills, advance your career, or explore personal interests.'
            },
            {
                question: 'How does CourseHub work?',
                answer: 'Students can browse our course catalog, enroll in courses that interest them, and learn at their own pace. Our platform provides access to video lectures, course materials, quizzes, assignments, and certificates of completion. Instructors can create and publish courses, interact with students, and earn revenue from their teaching.'
            },
            {
                question: 'Is CourseHub free to use?',
                answer: 'Creating an account on CourseHub is free. We offer both free and paid courses. Paid courses provide full access to all course materials, instructor support, and a certificate upon completion.'
            },
            {
                question: 'Who can teach on CourseHub?',
                answer: 'Industry professionals, experts, and educators with in-depth knowledge and practical experience in their field can apply to become instructors. We have a quality review process to ensure all courses meet our standards.'
            },
            {
                question: 'How can I contact customer support?',
                answer: 'You can reach our customer support team by visiting the Contact Us page, sending an email to support@coursehub.com, or using the live chat feature during business hours. We aim to respond to all inquiries within 24 hours.'
            }
        ],
        account: [
            {
                question: 'How do I create an account?',
                answer: 'Click on the "Register" button in the top right corner of the homepage. Fill out the registration form with your name, email address, and password. You can choose to sign up as a student or instructor.'
            },
            {
                question: 'How can I reset my password?',
                answer: 'Click on the "Login" button, then select "Forgot Password." Enter the email address associated with your account, and we\'ll send you instructions to reset your password. If you don\'t receive an email, check your spam folder or contact support.'
            },
            {
                question: 'Can I change my username or email address?',
                answer: 'Yes, you can update your profile information by going to the Dashboard > Profile section. You can change your name, profile picture, and other details. Note that changing your email address will require verification of the new email.'
            },
            {
                question: 'How do I delete my account?',
                answer: 'To delete your account, go to Dashboard > Settings > Account Settings. Scroll down to find the "Delete Account" option. Note that account deletion is permanent and will remove all your data, including course progress and certificates.'
            },
            {
                question: 'What happens to my courses if I delete my account?',
                answer: 'If you\'re a student, you will lose access to all courses you\'ve enrolled in. If you\'re an instructor, your courses will be removed from the platform. We recommend contacting support before deleting your account to discuss options.'
            }
        ],
        courses: [
            {
                question: 'How do I enroll in a course?',
                answer: 'Navigate to the course details page and click the "Enroll Now" button. For paid courses, you\'ll be directed to the payment page to complete your purchase. For free courses, you\'ll get immediate access after enrollment.'
            },
            {
                question: 'Can I access course content offline?',
                answer: 'Some course materials may be downloadable for offline use, such as PDFs and worksheets. However, video content generally requires an internet connection to stream. The availability of downloadable content varies by course.'
            },
            {
                question: 'How long do I have access to a course after enrollment?',
                answer: 'Once enrolled, you have lifetime access to the course content, including any future updates the instructor may make. This allows you to learn at your own pace and revisit the material whenever needed.'
            },
            {
                question: 'Are there any deadlines for completing a course?',
                answer: 'Most courses are self-paced, meaning you can complete them on your own schedule. However, some courses may include time-limited elements like scheduled live sessions or cohort-based activities with specific deadlines.'
            },
            {
                question: 'Can I get a refund if I\'m not satisfied with a course?',
                answer: 'Yes, we offer a 30-day money-back guarantee for most courses. If you\'re not satisfied with your purchase, you can request a refund within 30 days of enrollment. Some restrictions may apply for promotional items or bundles.'
            }
        ],
        payment: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for certain regions. All payments are processed securely through our payment providers.'
            },
            {
                question: 'Are there any hidden fees?',
                answer: 'No, the price you see is the price you pay. There are no additional fees or charges. For courses with subscription models, renewal terms will be clearly stated before purchase.'
            },
            {
                question: 'Can I get a refund after purchasing a course?',
                answer: 'Yes, we offer a 30-day money-back guarantee for most courses. If you\'re not satisfied with your purchase, you can request a refund within 30 days of enrollment through your account dashboard or by contacting customer support.'
            },
            {
                question: 'Do you offer any discounts or promotions?',
                answer: 'Yes, we regularly run promotions on select courses. You can subscribe to our newsletter to stay informed about discounts. We also offer special rates for students, educators, and organizations purchasing in bulk.'
            },
            {
                question: 'Is my payment information secure?',
                answer: 'Absolutely. We use industry-standard encryption and secure payment processors to ensure your financial information remains protected. We do not store your full credit card details on our servers.'
            }
        ],
        certificates: [
            {
                question: 'How do I earn a certificate?',
                answer: 'To earn a certificate, you must complete all required course components, including videos, quizzes, assignments, and any other assessments specified by the instructor. Once all requirements are met, you can access and download your certificate from your dashboard.'
            },
            {
                question: 'Are your certificates accredited?',
                answer: 'Our platform provides certificates of completion, which demonstrate that you have finished the course requirements. While these certificates are recognized by many employers, they are not equivalent to university degrees or accredited certifications unless explicitly stated in the course description.'
            },
            {
                question: 'How can I verify a certificate\'s authenticity?',
                answer: 'Each certificate comes with a unique verification code. Anyone can verify the authenticity of a certificate by entering this code on our certificate verification page. This helps ensure the credibility of your achievements when shared with employers or institutions.'
            },
            {
                question: 'Can I add my certificate to LinkedIn?',
                answer: 'Yes, you can add your certificate to your LinkedIn profile. When viewing your certificate, click the "Add to LinkedIn" button, which will guide you through the process of adding it to your profile\'s certifications section.'
            },
            {
                question: 'What if I lose my certificate?',
                answer: 'You can always access and download your certificates from your dashboard under the "Certificates" section. They remain available in your account permanently, so you never have to worry about losing them.'
            }
        ],
        technical: [
            {
                question: 'What are the system requirements for using CourseHub?',
                answer: 'CourseHub works best on up-to-date versions of Chrome, Firefox, Safari, and Edge browsers. We recommend a stable internet connection with at least 5 Mbps download speed for smooth video playback. Our platform is also mobile-responsive for learning on tablets and smartphones.'
            },
            {
                question: 'Why won\'t my videos play properly?',
                answer: 'Video playback issues are often related to internet connection speed or browser compatibility. Try refreshing the page, clearing your browser cache, or switching to a different browser. If using a mobile device, ensure you have a stable WiFi connection. For persistent issues, contact our technical support.'
            },
            {
                question: 'How do I enable cookies for CourseHub?',
                answer: 'CourseHub requires cookies to be enabled for proper functionality. In your browser settings, ensure that cookies are allowed for our domain. The exact steps vary by browser, but generally, you\'ll find this option in the Privacy or Security section of your browser settings.'
            },
            {
                question: 'Can I download course videos for offline viewing?',
                answer: 'By default, course videos are available for streaming only. However, some instructors may choose to make their content available for offline viewing. If this option is available, you\'ll see a download button next to the video player.'
            },
            {
                question: 'The site is loading slowly. What can I do?',
                answer: 'If you experience slow loading times, try clearing your browser cache and cookies, using a different browser, or checking your internet connection speed. If problems persist, it might be due to temporary server issues or high traffic volumes. Please contact support if the problem continues.'
            }
        ]
    };

    // Filter FAQs based on search query
    const filterFAQs = (query) => {
        if (!query) return faqData;

        const filtered = {};

        Object.keys(faqData).forEach(category => {
            filtered[category] = faqData[category].filter(item =>
                item.question.toLowerCase().includes(query.toLowerCase()) ||
                item.answer.toLowerCase().includes(query.toLowerCase())
            );
        });

        return filtered;
    };

    const filteredFAQs = filterFAQs(searchQuery);

    // Get total FAQ count
    const getTotalFAQCount = () => {
        let count = 0;
        Object.values(filteredFAQs).forEach(categoryFAQs => {
            count += categoryFAQs.length;
        });
        return count;
    };

    return (
        <Container maxW="container.xl" py={10}>
            {/* Hero Section */}
            <Box textAlign="center" mb={12}>
                <Heading as="h1" size="2xl" mb={4}>
                    Frequently Asked Questions
                </Heading>
                <Text fontSize="xl" maxW="2xl" mx="auto" color="gray.600">
                    Find answers to common questions about CourseHub, our courses, payment options, and more.
                </Text>

                <Box maxW="xl" mx="auto" mt={8}>
                    <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FaSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            borderRadius="full"
                            boxShadow="sm"
                        />
                    </InputGroup>
                    {searchQuery && (
                        <Text mt={2} textAlign="left" color="gray.600">
                            Found {getTotalFAQCount()} results for "{searchQuery}"
                        </Text>
                    )}
                </Box>
            </Box>

            {/* Main Content */}
            <Tabs isLazy colorScheme="blue" variant="enclosed" mb={10}>
                <TabList mb={4} overflowX="auto" whiteSpace="nowrap" pb={2}>
                    <Tab>All</Tab>
                    {categories.map(category => (
                        <Tab key={category.id}>{category.name}</Tab>
                    ))}
                </TabList>

                <TabPanels>
                    {/* All FAQs Tab */}
                    <TabPanel>
                        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                            {Object.keys(filteredFAQs).map(categoryKey => (
                                <Box key={categoryKey} mb={8}>
                                    <Heading size="md" mb={4} color="blue.600">
                                        {categories.find(cat => cat.id === categoryKey)?.name}
                                    </Heading>
                                    {filteredFAQs[categoryKey].length > 0 ? (
                                        <Accordion allowToggle>
                                            {filteredFAQs[categoryKey].map((item, index) => (
                                                <AccordionItem key={index} borderWidth="1px" mb={3} borderRadius="md">
                                                    <h3>
                                                        <AccordionButton py={3}>
                                                            <Box flex="1" textAlign="left" fontWeight="medium">
                                                                {item.question}
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                    </h3>
                                                    <AccordionPanel pb={4}>
                                                        <Text>{item.answer}</Text>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    ) : (
                                        <Text color="gray.500">No matching FAQs found in this category.</Text>
                                    )}
                                </Box>
                            ))}
                        </SimpleGrid>
                    </TabPanel>

                    {/* Individual Category Tabs */}
                    {categories.map(category => (
                        <TabPanel key={category.id}>
                            <Box>
                                <Heading size="md" mb={6} color="blue.600">
                                    {category.name}
                                </Heading>
                                {filteredFAQs[category.id]?.length > 0 ? (
                                    <Accordion allowToggle>
                                        {filteredFAQs[category.id].map((item, index) => (
                                            <AccordionItem key={index} borderWidth="1px" mb={3} borderRadius="md">
                                                <h3>
                                                    <AccordionButton py={3}>
                                                        <Box flex="1" textAlign="left" fontWeight="medium">
                                                            {item.question}
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h3>
                                                <AccordionPanel pb={4}>
                                                    <Text>{item.answer}</Text>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <Text color="gray.500">No matching FAQs found in this category.</Text>
                                )}
                            </Box>
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>

            {/* Popular Topics */}
            <Box mb={12}>
                <Heading size="lg" mb={6} textAlign="center">
                    Popular Topics
                </Heading>
                <Flex justify="center" wrap="wrap" gap={3}>
                    <Tag size="lg" colorScheme="blue" borderRadius="full" px={4} py={2}>Account Setup</Tag>
                    <Tag size="lg" colorScheme="green" borderRadius="full" px={4} py={2}>Course Access</Tag>
                    <Tag size="lg" colorScheme="purple" borderRadius="full" px={4} py={2}>Payments</Tag>
                    <Tag size="lg" colorScheme="orange" borderRadius="full" px={4} py={2}>Certificates</Tag>
                    <Tag size="lg" colorScheme="cyan" borderRadius="full" px={4} py={2}>Mobile Learning</Tag>
                    <Tag size="lg" colorScheme="pink" borderRadius="full" px={4} py={2}>Technical Issues</Tag>
                </Flex>
            </Box>

            <Divider my={10} />

            {/* Still Need Help Section */}
            <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
                <Heading as="h2" size="lg" mb={4}>
                    Still Have Questions?
                </Heading>
                <Text fontSize="lg" maxW="2xl" mx="auto" mb={6}>
                    Can't find what you're looking for? Our support team is here to help!
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="container.md" mx="auto">
                    <VStack p={6} bg="white" borderRadius="lg" boxShadow="md" spacing={4}>
                        <Heading size="md">Contact Support</Heading>
                        <Text>Reach out to our customer service team for personalized assistance.</Text>
                        <Button
                            as={RouterLink}
                            to="/contact"
                            colorScheme="blue"
                            rightIcon={<FaAngleRight />}
                        >
                            Get in Touch
                        </Button>
                    </VStack>

                    <VStack p={6} bg="white" borderRadius="lg" boxShadow="md" spacing={4}>
                        <Heading size="md">Help Center</Heading>
                        <Text>Browse our extensive knowledge base for detailed guides and tutorials.</Text>
                        <Button
                            as="a"
                            href="#"
                            colorScheme="blue"
                            rightIcon={<FaAngleRight />}
                        >
                            Visit Help Center
                        </Button>
                    </VStack>

                    <VStack p={6} bg="white" borderRadius="lg" boxShadow="md" spacing={4}>
                        <Heading size="md">Live Chat</Heading>
                        <Text>Chat with our support team in real-time during business hours.</Text>
                        <Button
                            colorScheme="blue"
                            rightIcon={<FaAngleRight />}
                        >
                            Start Chat
                        </Button>
                    </VStack>
                </SimpleGrid>
            </Box>
        </Container>
    );
};

export default FaqPage;