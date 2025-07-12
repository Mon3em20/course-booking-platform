import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Box,
    VStack,
    HStack,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    Input,
    Divider,
    Image,
    useToast,
    Heading,
} from '@chakra-ui/react';
import { FaCreditCard, FaMoneyBillWave, FaPaypal } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const EnrollmentModal = ({
                             isOpen,
                             onClose,
                             onConfirm,
                             course = {},
                             isLoading
                         }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });
    const { user } = useAuth();
    const toast = useToast();

    const handlePayment = () => {
        if (paymentMethod === 'card' && !validateCardDetails()) {
            toast({
                title: 'Incomplete card details',
                description: 'Please fill in all card information',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        onConfirm({ paymentMethod, ...cardDetails });
    };

    const validateCardDetails = () => {
        if (paymentMethod !== 'card') return true;

        return (
            cardDetails.cardNumber.length >= 16 &&
            cardDetails.cardName.length > 0 &&
            cardDetails.expiryDate.length > 0 &&
            cardDetails.cvv.length >= 3
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enroll in Course</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Box mb={6} borderRadius="md" overflow="hidden">
                        <Image
                            src={course.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
                            alt={course.title}
                            w="100%"
                            h="150px"
                            objectFit="cover"
                        />
                    </Box>

                    <Heading size="md" mb={2}>{course.title}</Heading>
                    <Text color="gray.600" mb={4}>{course.instructor?.name}</Text>

                    <HStack justify="space-between" mb={6}>
                        <Text fontWeight="bold">Price:</Text>
                        <Text fontWeight="bold" fontSize="xl">${course.price?.toFixed(2)}</Text>
                    </HStack>

                    <Divider mb={6} />

                    <Box mb={6}>
                        <Text fontWeight="bold" mb={3}>Select Payment Method:</Text>
                        <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                            <VStack align="stretch" spacing={4}>
                                <Radio value="card">
                                    <HStack>
                                        <FaCreditCard />
                                        <Text>Credit/Debit Card</Text>
                                    </HStack>
                                </Radio>

                                <Radio value="paypal">
                                    <HStack>
                                        <FaPaypal />
                                        <Text>PayPal</Text>
                                    </HStack>
                                </Radio>

                                <Radio value="cash">
                                    <HStack>
                                        <FaMoneyBillWave />
                                        <Text>Cash/Bank Transfer</Text>
                                    </HStack>
                                </Radio>
                            </VStack>
                        </RadioGroup>
                    </Box>

                    {paymentMethod === 'card' && (
                        <VStack spacing={4} align="stretch" mb={6}>
                            <FormControl>
                                <FormLabel>Card Number</FormLabel>
                                <Input
                                    placeholder="1234 5678 9012 3456"
                                    value={cardDetails.cardNumber}
                                    onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Cardholder Name</FormLabel>
                                <Input
                                    placeholder="John Doe"
                                    value={cardDetails.cardName}
                                    onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                                />
                            </FormControl>

                            <HStack>
                                <FormControl>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <Input
                                        placeholder="MM/YY"
                                        value={cardDetails.expiryDate}
                                        onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>CVV</FormLabel>
                                    <Input
                                        placeholder="123"
                                        type="password"
                                        maxLength={4}
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                    />
                                </FormControl>
                            </HStack>
                        </VStack>
                    )}

                    {paymentMethod === 'cash' && (
                        <Box p={4} bg="blue.50" borderRadius="md" mb={6}>
                            <Text>
                                Pay via bank transfer or cash. After enrollment, you'll receive
                                payment instructions. Your enrollment will be pending until payment is confirmed.
                            </Text>
                        </Box>
                    )}

                    {paymentMethod === 'paypal' && (
                        <Box p={4} bg="blue.50" borderRadius="md" mb={6}>
                            <Text>
                                You'll be redirected to PayPal to complete your payment securely.
                            </Text>
                        </Box>
                    )}

                    <Box p={4} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm">
                            By enrolling in this course, you agree to our Terms of Service and Refund Policy.
                        </Text>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button variant="outline" mr={3} onClick={onClose} isDisabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handlePayment}
                        isLoading={isLoading}
                        loadingText="Processing"
                    >
                        Confirm Enrollment (${course.price?.toFixed(2)})
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EnrollmentModal;