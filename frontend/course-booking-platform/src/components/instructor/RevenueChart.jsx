import React from 'react';
import {
    Box,
    Text,
    Flex,
    Select,
    useColorModeValue
} from '@chakra-ui/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const RevenueChart = ({
                          data = [],
                          period = 'month',
                          onPeriodChange = () => {},
                          chartType = 'line'
                      }) => {
    const chartBg = useColorModeValue('white', 'gray.800');
    const tooltipBg = useColorModeValue('white', 'gray.700');
    const tooltipBorder = useColorModeValue('gray.200', 'gray.600');

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    bg={tooltipBg}
                    p={2}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={tooltipBorder}
                    boxShadow="md"
                >
                    <Text fontWeight="bold">{label}</Text>
                    <Text color="blue.500">
                        Revenue: ${payload[0].value.toFixed(2)}
                    </Text>
                    <Text color="green.500">
                        Earnings: ${payload[1].value.toFixed(2)}
                    </Text>
                </Box>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <Box height="300px" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.500">No revenue data available for this period</Text>
            </Box>
        );
    }

    return (
        <Box
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            bg={chartBg}
            h="100%"
        >
            <Flex justify="space-between" mb={4} align="center">
                <Text fontWeight="medium" fontSize="md">Revenue Overview</Text>
                <Select
                    value={period}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    size="sm"
                    width="120px"
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                </Select>
            </Flex>

            <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                        <LineChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 5,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('gray.200', 'gray.700')} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickMargin={10}
                                stroke={useColorModeValue('gray.500', 'gray.400')}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                                stroke={useColorModeValue('gray.500', 'gray.400')}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3182CE"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 6 }}
                                name="Total Revenue"
                            />
                            <Line
                                type="monotone"
                                dataKey="earnings"
                                stroke="#38A169"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 6 }}
                                name="Your Earnings"
                            />
                        </LineChart>
                    ) : (
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 5,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('gray.200', 'gray.700')} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickMargin={10}
                                stroke={useColorModeValue('gray.500', 'gray.400')}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                                stroke={useColorModeValue('gray.500', 'gray.400')}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="revenue"
                                fill="#3182CE"
                                name="Total Revenue"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="earnings"
                                fill="#38A169"
                                name="Your Earnings"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default RevenueChart;