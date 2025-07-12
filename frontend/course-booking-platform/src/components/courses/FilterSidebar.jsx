import React from 'react';
import {
    Box,
    Heading,
    VStack,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Stack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Divider,
    Button,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Flex,
    Text,
} from '@chakra-ui/react';

const FilterSidebar = ({ filters, onChange }) => {
    const [priceRange, setPriceRange] = React.useState([0, 500]);

    // Categories
    const categories = [
        'Programming',
        'Business',
        'Design',
        'Marketing',
        'Health',
        'Personal Development',
        'Science',
        'Languages',
        'Arts',
    ];

    // Levels
    const levels = ['beginner', 'intermediate', 'advanced', 'all-levels'];

    // Ratings
    const ratings = [4, 3, 2, 1];

    // Languages
    const languages = ['english', 'arabic', 'french', 'spanish', 'german'];

    // Price ranges
    const priceRanges = [
        { label: 'Free', value: 'free' },
        { label: 'Under $25', value: 'under-25' },
        { label: '$25 - $50', value: '25-50' },
        { label: '$50 - $100', value: '50-100' },
        { label: 'Over $100', value: 'over-100' },
    ];

    // Handle filter changes
    const handleCategoryChange = (category) => {
        onChange({ category: category });
    };

    const handleLevelChange = (level) => {
        onChange({ level });
    };

    const handleRatingChange = (rating) => {
        onChange({ rating });
    };

    const handleLanguageChange = (language) => {
        onChange({ language });
    };

    const handlePriceRangeChange = (range) => {
        onChange({ priceRange: range });
    };

    // Handle price slider change
    const handlePriceSliderChange = (newValues) => {
        setPriceRange(newValues);
    };

    const handlePriceSliderChangeEnd = (newValues) => {
        onChange({ minPrice: newValues[0], maxPrice: newValues[1] });
    };

    // Reset filters
    const resetFilters = () => {
        onChange({
            category: '',
            level: '',
            rating: '',
            language: '',
            priceRange: '',
            minPrice: 0,
            maxPrice: 500,
        });
        setPriceRange([0, 500]);
    };

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg="white"
            position="sticky"
            top="80px"
        >
            <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                    <Heading size="md">Filters</Heading>
                    <Button
                        variant="link"
                        colorScheme="blue"
                        size="sm"
                        onClick={resetFilters}
                    >
                        Reset All
                    </Button>
                </Flex>

                <Accordion allowMultiple defaultIndex={[0, 1]}>
                    {/* Categories */}
                    <AccordionItem border="none">
                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                                Categories
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={0}>
                            <RadioGroup value={filters.category || ''} onChange={handleCategoryChange}>
                                <Stack>
                                    <Radio value="">All Categories</Radio>
                                    {categories.map((category) => (
                                        <Radio key={category} value={category}>
                                            {category}
                                        </Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </AccordionPanel>
                    </AccordionItem>

                    <Divider />

                    {/* Price */}
                    <AccordionItem border="none">
                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                                Price
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={0}>
                            <RadioGroup value={filters.priceRange || ''} onChange={handlePriceRangeChange}>
                                <Stack>
                                    <Radio value="">All Prices</Radio>
                                    {priceRanges.map((range) => (
                                        <Radio key={range.value} value={range.value}>
                                            {range.label}
                                        </Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>

                            <Box mt={6}>
                                <Text mb={2}>Custom Price Range</Text>
                                <Flex justify="space-between" mb={2}>
                                    <Text fontSize="sm">${priceRange[0]}</Text>
                                    <Text fontSize="sm">${priceRange[1]}</Text>
                                </Flex>
                                <RangeSlider
                                    min={0}
                                    max={500}
                                    step={5}
                                    value={priceRange}
                                    onChange={handlePriceSliderChange}
                                    onChangeEnd={handlePriceSliderChangeEnd}
                                >
                                    <RangeSliderTrack>
                                        <RangeSliderFilledTrack bg="blue.500" />
                                    </RangeSliderTrack>
                                    <RangeSliderThumb index={0} />
                                    <RangeSliderThumb index={1} />
                                </RangeSlider>
                            </Box>
                        </AccordionPanel>
                    </AccordionItem>

                    <Divider />

                    {/* Level */}
                    <AccordionItem border="none">
                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                                Level
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={0}>
                            <RadioGroup value={filters.level || ''} onChange={handleLevelChange}>
                                <Stack>
                                    <Radio value="">All Levels</Radio>
                                    <Radio value="beginner">Beginner</Radio>
                                    <Radio value="intermediate">Intermediate</Radio>
                                    <Radio value="advanced">Advanced</Radio>
                                    <Radio value="all-levels">All Levels</Radio>
                                </Stack>
                            </RadioGroup>
                        </AccordionPanel>
                    </AccordionItem>

                    <Divider />

                    {/* Rating */}
                    <AccordionItem border="none">
                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                                Rating
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={0}>
                            <RadioGroup value={filters.rating || ''} onChange={handleRatingChange}>
                                <Stack>
                                    <Radio value="">Any Rating</Radio>
                                    {ratings.map((rating) => (
                                        <Radio key={rating} value={rating.toString()}>
                                            {rating}+ Stars
                                        </Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </AccordionPanel>
                    </AccordionItem>

                    <Divider />

                    {/* Language */}
                    <AccordionItem border="none">
                        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                                Language
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} px={0}>
                            <RadioGroup value={filters.language || ''} onChange={handleLanguageChange}>
                                <Stack>
                                    <Radio value="">All Languages</Radio>
                                    {languages.map((language) => (
                                        <Radio key={language} value={language}>
                                            {language.charAt(0).toUpperCase() + language.slice(1)}
                                        </Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </VStack>
        </Box>
    );
};

export default FilterSidebar;