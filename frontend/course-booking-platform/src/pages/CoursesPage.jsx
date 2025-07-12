import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Text,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Select,
    HStack,
    VStack,
    Icon,
    Badge,
    Spinner,
    Alert,
    AlertIcon,
    useToast,
    Divider,
    useBreakpointValue,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { fetchCourses } from '../api/courses';
import CourseCard from '../components/courses/CourseCard';
import FilterSidebar from '../components/courses/FilterSidebar';

const CoursesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get initial filters from URL query params
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || '';
    const initialSearch = queryParams.get('search') || '';

    // State for filters and search
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [searchInputValue, setSearchInputValue] = useState(initialSearch);
    const [filters, setFilters] = useState({
        category: initialCategory,
        level: queryParams.get('level') || '',
        rating: queryParams.get('rating') || '',
        language: queryParams.get('language') || '',
        priceRange: queryParams.get('priceRange') || '',
        sortBy: queryParams.get('sortBy') || 'popular',
        minPrice: queryParams.get('minPrice') || '',
        maxPrice: queryParams.get('maxPrice') || '',
    });

    // Fetch courses
    const { data, isLoading, error, refetch } = useQuery(
        ['courses', searchQuery, filters],
        () => fetchCourses({
            search: searchQuery,
            ...filters,
        }),
        {
            onError: () => {
                toast({
                    title: 'Error loading courses',
                    description: 'Failed to load courses. Please try again later.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    );

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchQuery) params.set('search', searchQuery);
        if (filters.category) params.set('category', filters.category);
        if (filters.level) params.set('level', filters.level);
        if (filters.rating) params.set('rating', filters.rating);
        if (filters.language) params.set('language', filters.language);
        if (filters.priceRange) params.set('priceRange', filters.priceRange);
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

        navigate({ search: params.toString() });
    }, [searchQuery, filters, navigate]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInputValue);
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        if (isMobile) onClose();
    };

    // Handle sort change
    const handleSortChange = (e) => {
        setFilters(prev => ({ ...prev, sortBy: e.target.value }));
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSearchInputValue('');
        setFilters({
            category: '',
            level: '',
            rating: '',
            language: '',
            priceRange: '',
            sortBy: 'popular',
            minPrice: '',
            maxPrice: '',
        });
    };

    // Check if any filter is active
    const isFilterActive = () => {
        return (
            searchQuery ||
            filters.category ||
            filters.level ||
            filters.rating ||
            filters.language ||
            filters.priceRange ||
            filters.minPrice ||
            filters.maxPrice
        );
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <Container maxW="container.xl" py={8}>
                {/* Page Header */}
                <Box mb={6}>
                    <Heading size="xl" mb={2}>Browse Courses</Heading>
                    <Text color="gray.600">Find the perfect course to enhance your skills</Text>
                </Box>

                {/* Search and Filter Controls */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    mb={6}
                    gap={4}
                    align={{ md: "center" }}
                    justify="space-between"
                >
                    <form onSubmit={handleSearch} style={{ width: '100%' }}>
                        <InputGroup maxW={{ md: "400px" }}>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FaSearch} color="gray.400" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search courses..."
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                                bg="white"
                            />
                        </InputGroup>
                    </form>

                    <HStack>
                        <Select
                            value={filters.sortBy}
                            onChange={handleSortChange}
                            bg="white"
                            width={{ base: "full", md: "auto" }}
                        >
                            <option value="popular">Most Popular</option>
                            <option value="newest">Newest</option>
                            <option value="highest_rated">Highest Rated</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </Select>

                        {isMobile && (
                            <Button
                                leftIcon={<Icon as={FaFilter} />}
                                onClick={onOpen}
                                colorScheme="blue"
                                variant="outline"
                            >
                                Filters
                            </Button>
                        )}
                    </HStack>
                </Flex>

                {/* Active Filters Display */}
                {isFilterActive() && (
                    <Flex
                        wrap="wrap"
                        gap={2}
                        mb={6}
                        align="center"
                        bg="blue.50"
                        p={3}
                        borderRadius="md"
                    >
                        <Text fontWeight="medium" mr={2}>Active Filters:</Text>

                        {searchQuery && (
                            <Badge
                                borderRadius="full"
                                px={3}
                                py={1}
                                colorScheme="blue"
                                display="flex"
                                alignItems="center"
                            >
                                Search: {searchQuery}
                                <Icon
                                    as={FaTimes}
                                    ml={2}
                                    boxSize={3}
                                    cursor="pointer"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchInputValue('');
                                    }}
                                />
                            </Badge>
                        )}

                        {filters.category && (
                            <Badge
                                borderRadius="full"
                                px={3}
                                py={1}
                                colorScheme="green"
                                display="flex"
                                alignItems="center"
                            >
                                {filters.category}
                                <Icon
                                    as={FaTimes}
                                    ml={2}
                                    boxSize={3}
                                    cursor="pointer"
                                    onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                                />
                            </Badge>
                        )}

                        {filters.level && (
                            <Badge
                                borderRadius="full"
                                px={3}
                                py={1}
                                colorScheme="purple"
                                display="flex"
                                alignItems="center"
                            >
                                Level: {filters.level.charAt(0).toUpperCase() + filters.level.slice(1)}
                                <Icon
                                    as={FaTimes}
                                    ml={2}
                                    boxSize={3}
                                    cursor="pointer"
                                    onClick={() => setFilters(prev => ({ ...prev, level: '' }))}
                                />
                            </Badge>
                        )}

                        {filters.priceRange && (
                            <Badge
                                borderRadius="full"
                                px={3}
                                py={1}
                                colorScheme="orange"
                                display="flex"
                                alignItems="center"
                            >
                                Price: {filters.priceRange.replace('-', ' to $').replace('under', 'Under $').replace('over', 'Over $')}
                                <Icon
                                    as={FaTimes}
                                    ml={2}
                                    boxSize={3}
                                    cursor="pointer"
                                    onClick={() => setFilters(prev => ({ ...prev, priceRange: '' }))}
                                />
                            </Badge>
                        )}

                        <Button
                            variant="link"
                            colorScheme="blue"
                            size="sm"
                            onClick={clearFilters}
                            ml="auto"
                        >
                            Clear All
                        </Button>
                    </Flex>
                )}

                <Flex>
                    {/* Filter Sidebar - Desktop */}
                    {!isMobile && (
                        <Box width="250px" mr={8} flexShrink={0}>
                            <FilterSidebar
                                filters={filters}
                                onChange={handleFilterChange}
                            />
                        </Box>
                    )}

                    {/* Main Content */}
                    <Box flex="1">
                        {isLoading ? (
                            <Box textAlign="center" py={10}>
                                <Spinner size="xl" thickness="4px" color="blue.500" />
                                <Text mt={4}>Loading courses...</Text>
                            </Box>
                        ) : error ? (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                <Text>Error loading courses. Please try again later.</Text>
                            </Alert>
                        ) : data?.courses?.length === 0 ? (
                            <Box textAlign="center" py={10} bg="white" borderRadius="lg">
                                <Heading size="md" mb={4}>No courses found</Heading>
                                <Text mb={6}>Try adjusting your filters or search criteria.</Text>
                                <Button colorScheme="blue" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </Box>
                        ) : (
                            <VStack align="stretch" spacing={6}>
                                <Flex justify="space-between" align="center">
                                    <Text fontWeight="medium">
                                        Showing {data?.courses?.length} of {data?.totalCourses || data?.courses?.length} courses
                                    </Text>
                                </Flex>

                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    {data?.courses?.map(course => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                                </SimpleGrid>

                                {/* Pagination can be added here */}
                            </VStack>
                        )}
                    </Box>
                </Flex>
            </Container>

            {/* Filter Drawer - Mobile */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Filter Courses</DrawerHeader>
                    <DrawerBody p={4}>
                        <FilterSidebar
                            filters={filters}
                            onChange={handleFilterChange}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default CoursesPage;