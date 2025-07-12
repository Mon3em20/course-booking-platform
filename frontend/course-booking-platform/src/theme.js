import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    fonts: {
        heading: 'Poppins, sans-serif',
        body: 'Inter, sans-serif',
    },
    colors: {
        blue: {
            50: '#e6f0ff',
            100: '#b9d4ff',
            200: '#8cb9ff',
            300: '#5f9eff',
            400: '#4361ee', // Primary color
            500: '#2c4cdb',
            600: '#203aab',
            700: '#15297c',
            800: '#0a184d',
            900: '#03071e',
        },
        purple: {
            400: '#3a0ca3', // Secondary color
        },
        cyan: {
            400: '#4cc9f0', // Accent color
        },
        pink: {
            400: '#f72585', // Warning color
        },
        green: {
            400: '#4ade80', // Success color
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'normal',
                borderRadius: 'md',
            },
            variants: {
                solid: {
                    bg: 'blue.400',
                    color: 'white',
                    _hover: {
                        bg: 'blue.500',
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'lg',
                    boxShadow: 'md',
                },
            },
        },
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800',
            },
        },
    },
});

export default theme;