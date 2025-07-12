import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

const UserStatsChart = ({ data }) => {
    if (!data || !data.length) {
        return (
            <Box height="300px" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.500">No user data available</Text>
            </Box>
        );
    }

    // Colors for different user roles
    const COLORS = ['#4299E1', '#9F7AEA', '#38A169'];

    return (
        <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} users`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default UserStatsChart;