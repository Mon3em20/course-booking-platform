import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Skeleton } from '@chakra-ui/react';
import CourseCard from '../courses/CourseCard';
import { getCourses } from '../../api/courses';

const FeaturedCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedCourses = async () => {
            try {
                setLoading(true);
                // استدعاء API بشكل صحيح
                const response = await getCourses({ featured: true, limit: 6 });
                setCourses(response.courses || []);
            } catch (error) {
                console.error('Error fetching featured courses:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedCourses();
    }, []);

    // عرض هيكل عظمي أثناء التحميل
    if (loading) {
        return (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Skeleton key={item} height="400px" borderRadius="lg" />
                ))}
            </SimpleGrid>
        );
    }

    // التحقق من وجود دورات للعرض
    if (!courses || courses.length === 0) {
        return <Box>No featured courses available at the moment.</Box>;
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
            ))}
        </SimpleGrid>
    );
};

export default FeaturedCourses;