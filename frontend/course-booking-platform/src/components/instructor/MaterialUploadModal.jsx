import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input, Text,
    Button, FormErrorMessage, VStack, Box,
    Icon, Progress, useToast
} from '@chakra-ui/react';
import { FaUpload, FaFilePdf, FaFileWord, FaFilePowerpoint, FaFile } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { uploadCourseMaterial } from '../../api/upload';

const MaterialUploadModal = ({ isOpen, onClose, courseId, onMaterialAdded }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [materialTitle, setMaterialTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [fileError, setFileError] = useState('');
    const toast = useToast();

    // Upload material mutation
    const uploadMutation = useMutation(
        (formData) => uploadCourseMaterial(courseId, formData),
        {
            onSuccess: (data) => {
                toast({
                    title: 'Material uploaded successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                onMaterialAdded(data);
                handleClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error uploading material',
                    description: error.message || 'Failed to upload material',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                setFileError('File size cannot exceed 50MB');
                setSelectedFile(null);
                return;
            }

            // Validate file type
            const validTypes = ['application/pdf', 'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/zip'];

            if (!validTypes.includes(file.type)) {
                setFileError('Invalid file type. Please upload PDF, PPT, DOCX, or ZIP files');
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setFileError('');

            // Set default title based on filename if empty
            if (!materialTitle) {
                setMaterialTitle(file.name.split('.')[0]);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate inputs
        let isValid = true;

        if (!materialTitle.trim()) {
            setTitleError('Material title is required');
            isValid = false;
        } else {
            setTitleError('');
        }

        if (!selectedFile) {
            setFileError('Please select a file to upload');
            isValid = false;
        }

        if (!isValid) return;

        // Create form data and upload
        const formData = new FormData();
        formData.append('title', materialTitle);
        formData.append('file', selectedFile);

        uploadMutation.mutate(formData);
    };

    const handleClose = () => {
        setSelectedFile(null);
        setMaterialTitle('');
        setTitleError('');
        setFileError('');
        onClose();
    };

    // Get appropriate file icon
    const getFileIcon = (file) => {
        if (!file) return FaFile;

        const fileType = file.type;
        if (fileType.includes('pdf')) return FaFilePdf;
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return FaFilePowerpoint;
        if (fileType.includes('word') || fileType.includes('document')) return FaFileWord;
        return FaFile;
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Upload Course Material</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isInvalid={!!titleError}>
                                <FormLabel>Material Title</FormLabel>
                                <Input
                                    value={materialTitle}
                                    onChange={(e) => setMaterialTitle(e.target.value)}
                                    placeholder="Enter title for this material"
                                />
                                <FormErrorMessage>{titleError}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!fileError}>
                                <FormLabel>Upload File</FormLabel>

                                {selectedFile ? (
                                    <Box
                                        p={4}
                                        borderWidth="1px"
                                        borderRadius="md"
                                        borderStyle="solid"
                                        borderColor="gray.200"
                                    >
                                        <HStack spacing={4}>
                                            <Icon as={getFileIcon(selectedFile)} boxSize={8} color="blue.500" />
                                            <VStack align="start" spacing={0} flex={1}>
                                                <Text fontWeight="medium">{selectedFile.name}</Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                </Text>
                                            </VStack>
                                            <Button
                                                size="sm"
                                                colorScheme="red"
                                                onClick={() => setSelectedFile(null)}
                                            >
                                                Remove
                                            </Button>
                                        </HStack>
                                    </Box>
                                ) : (
                                    <Box
                                        p={10}
                                        borderWidth="2px"
                                        borderRadius="md"
                                        borderStyle="dashed"
                                        borderColor="gray.300"
                                        bg="gray.50"
                                        textAlign="center"
                                        cursor="pointer"
                                        onClick={() => document.getElementById('file-upload').click()}
                                    >
                                        <Icon as={FaUpload} boxSize={10} color="gray.400" />
                                        <Text mt={2} fontWeight="medium">Click to upload file</Text>
                                        <Text fontSize="sm" color="gray.500">PDF, PPT, DOCX, ZIP (Max: 50MB)</Text>
                                    </Box>
                                )}

                                <Input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
                                    display="none"
                                />

                                <FormErrorMessage>{fileError}</FormErrorMessage>
                            </FormControl>

                            {uploadMutation.isLoading && (
                                <Box w="100%">
                                    <Text mb={1}>Uploading...</Text>
                                    <Progress size="sm" isIndeterminate colorScheme="blue" />
                                </Box>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            isLoading={uploadMutation.isLoading}
                            loadingText="Uploading"
                        >
                            Upload Material
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default MaterialUploadModal;