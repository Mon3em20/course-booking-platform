import React from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Container,
    VStack,
    Image,
    useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container maxW="container.lg" py={20}>
            <VStack spacing={10} textAlign="center">
                <Box>
                    <Image
                        src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569_960_720.jpg"
                        alt="404 Error"
                        maxWidth="400px"
                        mx="auto"
                        mb={8}
                    />
                </Box>

                <Heading
                    as="h1"
                    size="2xl"
                    bgGradient="linear(to-r, blue.400, blue.600)"
                    backgroundClip="text"
                >
                    404 - Page Not Found
                </Heading>

                <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
                    The page you're looking for doesn't exist or has been moved.
                </Text>

                <Box>
                    <Button
                        as={RouterLink}
                        to="/"
                        colorScheme="blue"
                        size="lg"
                        mr={4}
                    >
                        Go Home
                    </Button>
                    <Button
                        as={RouterLink}
                        to="/courses"
                        variant="outline"
                        size="lg"
                    >
                        Browse Courses
                    </Button>
                </Box>
            </VStack>
        </Container>
    );
};

export default NotFoundPage;