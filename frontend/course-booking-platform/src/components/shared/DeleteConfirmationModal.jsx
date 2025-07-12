import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Text,
    Icon,
    VStack,
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmationModal = ({
                                     isOpen,
                                     onClose,
                                     onConfirm,
                                     title = 'Confirm Delete',
                                     message = 'Are you sure you want to delete this item? This action cannot be undone.',
                                     isLoading = false,
                                 }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack spacing={4} align="center">
                        <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" />
                        <Text>{message}</Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button mr={3} onClick={onClose} isDisabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        loadingText="Deleting..."
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteConfirmationModal;