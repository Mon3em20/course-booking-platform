import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const CourseStatsChart = ({ data }) => {
    if (!data || !data.length) {
        return (
            <Box height="300px" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.500">No course data available</Text>
            </Box>
        );
    }

    return (
        <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" name="Students Enrolled" fill="#4299E1" />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#38A169" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CourseStatsChart;