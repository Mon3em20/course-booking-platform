import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const RevenueChart = ({ data = [] }) => {
    if (!data || data.length === 0) {
        return (
            <Box height="300px" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.500">No revenue data available</Text>
            </Box>
        );
    }

    return (
        <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3182CE"
                        activeDot={{ r: 8 }}
                        name="Gross Revenue"
                    />
                    <Line
                        type="monotone"
                        dataKey="netRevenue"
                        stroke="#38A169"
                        name="Net Revenue"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default RevenueChart;