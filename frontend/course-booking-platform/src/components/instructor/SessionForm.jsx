import React, { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input, Textarea,
    Button, FormErrorMessage, VStack
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SessionForm = ({ isOpen, onClose, onAdd, onUpdate, session = null, sessionIndex = null }) => {
    const isEditMode = Boolean(session);

    const formik = useFormik({
        initialValues: {
            title: session?.title || '',
            description: session?.description || '',
            date: session?.date ? new Date(session.date).toISOString().split('T')[0] : '',
            startTime: session?.startTime || '',
            endTime: session?.endTime || '',
            location: session?.location || 'online',
            meetingUrl: session?.meetingUrl || '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            date: Yup.date().required('Date is required'),
            startTime: Yup.string().required('Start time is required'),
            endTime: Yup.string()
                .required('End time is required')
                .test('is-greater', 'End time must be after start time', function (value) {
                    const { startTime } = this.parent;
                    return !startTime || !value || value > startTime;
                }),
            meetingUrl: Yup.string().when('location', {
                is: 'online',
                then: Yup.string().url('Must be a valid URL').required('Meeting URL is required for online sessions'),
                otherwise: Yup.string().url('Must be a valid URL').notRequired(),
            }),
        }),
        onSubmit: (values) => {
            if (isEditMode) {
                onUpdate(sessionIndex, values);
            } else {
                onAdd(values);
            }
            onClose();
            formik.resetForm();
        },
        enableReinitialize: true,
    });

    // Update form values when session changes
    useEffect(() => {
        if (session) {
            formik.setValues({
                title: session.title || '',
                description: session.description || '',
                date: session.date ? new Date(session.date).toISOString().split('T')[0] : '',
                startTime: session.startTime || '',
                endTime: session.endTime || '',
                location: session.location || 'online',
                meetingUrl: session.meetingUrl || '',
            });
        }
    }, [session]);

    // Reset form on close
    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEditMode ? 'Edit Session' : 'Add New Session'}</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={formik.handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl
                                isInvalid={formik.touched.title && formik.errors.title}
                            >
                                <FormLabel>Session Title</FormLabel>
                                <Input
                                    name="title"
                                    {...formik.getFieldProps('title')}
                                />
                                <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={formik.touched.description && formik.errors.description}
                            >
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    name="description"
                                    rows={3}
                                    {...formik.getFieldProps('description')}
                                />
                                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={formik.touched.date && formik.errors.date}
                            >
                                <FormLabel>Date</FormLabel>
                                <Input
                                    type="date"
                                    name="date"
                                    {...formik.getFieldProps('date')}
                                />
                                <FormErrorMessage>{formik.errors.date}</FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={formik.touched.startTime && formik.errors.startTime}
                            >
                                <FormLabel>Start Time</FormLabel>
                                <Input
                                    type="time"
                                    name="startTime"
                                    {...formik.getFieldProps('startTime')}
                                />
                                <FormErrorMessage>{formik.errors.startTime}</FormErrorMessage>
                            </FormControl>

                            <FormControl
                                isInvalid={formik.touched.endTime && formik.errors.endTime}
                            >
                                <FormLabel>End Time</FormLabel>
                                <Input
                                    type="time"
                                    name="endTime"
                                    {...formik.getFieldProps('endTime')}
                                />
                                <FormErrorMessage>{formik.errors.endTime}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Location</FormLabel>
                                <Input
                                    name="location"
                                    {...formik.getFieldProps('location')}
                                    placeholder="Online or physical location"
                                />
                            </FormControl>

                            <FormControl
                                isInvalid={formik.touched.meetingUrl && formik.errors.meetingUrl}
                            >
                                <FormLabel>Meeting URL (for online sessions)</FormLabel>
                                <Input
                                    name="meetingUrl"
                                    {...formik.getFieldProps('meetingUrl')}
                                    placeholder="https://..."
                                />
                                <FormErrorMessage>{formik.errors.meetingUrl}</FormErrorMessage>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            type="submit"
                            isLoading={formik.isSubmitting}
                        >
                            {isEditMode ? 'Update Session' : 'Add Session'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default SessionForm;