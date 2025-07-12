import React, { useState } from 'react';
import {
    FormControl,
    Input,
    Button,
    HStack,
    FormErrorMessage
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

const LearningOutcomeForm = ({ onAdd, placeholder = "What students will learn...", buttonText = "Add Outcome" }) => {
    const [outcome, setOutcome] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!outcome.trim()) {
            setError('This field cannot be empty');
            return;
        }

        onAdd(outcome);
        setOutcome('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <HStack>
                <FormControl isInvalid={!!error}>
                    <Input
                        value={outcome}
                        onChange={(e) => {
                            setOutcome(e.target.value);
                            if (e.target.value.trim()) {
                                setError('');
                            }
                        }}
                        placeholder={placeholder}
                    />
                    <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <Button
                    colorScheme="blue"
                    type="submit"
                    leftIcon={<FaPlus />}
                >
                    {buttonText}
                </Button>
            </HStack>
        </form>
    );
};

export default LearningOutcomeForm;