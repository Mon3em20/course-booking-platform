import React from 'react';
import { Box, Text, HStack, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const Logo = ({ color = 'blue.500', size = 'md' }) => {
    const fontSizes = {
        sm: 'lg',
        md: 'xl',
        lg: '2xl',
    };

    const iconSizes = {
        sm: 5,
        md: 6,
        lg: 7,
    };

    return (
        <Box as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <HStack spacing={2}>
                <Icon as={FaGraduationCap} w={iconSizes[size]} h={iconSizes[size]} color={color} />
                <Text
                    fontWeight="bold"
                    fontSize={fontSizes[size]}
                    letterSpacing="tight"
                    color={color}
                >
                    CourseHub
                </Text>
            </HStack>
        </Box>
    );
};

export default Logo;