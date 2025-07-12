import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box p={5} borderRadius="md" bg="red.50" color="red.800" my={4}>
                    <Heading size="md" mb={2}>
                        Something went wrong
                    </Heading>
                    <Text mb={4}>
                        {this.state.error?.message || 'An error occurred while rendering this component.'}
                    </Text>
                    <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => this.setState({ hasError: false, error: null })}
                    >
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;