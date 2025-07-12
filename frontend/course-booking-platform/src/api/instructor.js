import axios from 'axios';
import { API_URL } from '../config';
import { getAuthHeader } from '../utils/auth';

// Get instructor profile
export const getInstructorProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/instructors/profile`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update instructor profile
export const updateInstructorProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}/instructors/profile`, profileData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get instructor courses
export const getInstructorCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/instructors/courses`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get course details
export const getCourseDetails = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/instructors/courses/${courseId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Create a new course
export const createCourse = async (courseData) => {
    try {
        const response = await axios.post(
            `${API_URL}/instructors/courses`,
            courseData,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
    try {
        const response = await axios.put(
            `${API_URL}/instructors/courses/${courseId}`,
            courseData,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete a course
export const deleteCourse = async (courseId) => {
    try {
        const response = await axios.delete(`${API_URL}/instructors/courses/${courseId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get course sessions
export const getCourseSessions = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/instructors/courses/${courseId}/sessions`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Create a session
export const createSession = async (courseId, sessionData) => {
    try {
        const response = await axios.post(`${API_URL}/instructors/courses/${courseId}/sessions`, sessionData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update a session
export const updateSession = async (courseId, sessionId, sessionData) => {
    try {
        const response = await axios.put(`${API_URL}/instructors/courses/${courseId}/sessions/${sessionId}`, sessionData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete a session
export const deleteSession = async (courseId, sessionId) => {
    try {
        const response = await axios.delete(`${API_URL}/instructors/courses/${courseId}/sessions/${sessionId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get course students
export const getCourseStudents = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/instructors/courses/${courseId}/students`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Remove student from course
export const removeStudentFromCourse = async (courseId, studentId) => {
    try {
        const response = await axios.delete(`${API_URL}/instructors/courses/${courseId}/students/${studentId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Add student to course
export const addStudentToCourse = async (courseId, studentEmail) => {
    try {
        const response = await axios.post(`${API_URL}/instructors/courses/${courseId}/students`, { email: studentEmail }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get instructor bookings
export const getInstructorBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/instructors/bookings`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await axios.put(`${API_URL}/instructors/bookings/${bookingId}/status`, { status }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Download booking invoice
export const downloadBookingInvoice = async (bookingId) => {
    try {
        const response = await axios.get(`${API_URL}/instructors/bookings/${bookingId}/invoice`, {
            headers: getAuthHeader(),
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update instructor preferences
export const updateInstructorPreferences = async (preferencesData) => {
    try {
        const response = await axios.put(`${API_URL}/instructors/preferences`, preferencesData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update payment information
export const updatePaymentInfo = async (paymentInfo) => {
    try {
        const response = await axios.put(`${API_URL}/instructors/payment-info`, paymentInfo, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Export instructor data
export const exportInstructorData = async () => {
    try {
        const response = await axios.get(`${API_URL}/instructors/export-data`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get instructor analytics
export const getInstructorAnalytics = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/instructors/analytics`, {
            headers: getAuthHeader(),
            params: { period },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get instructor earnings
export const getInstructorEarnings = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/instructors/earnings`, {
            headers: getAuthHeader(),
            params: { period },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }

};
export const getCourseAnalytics = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/instructors/courses/${courseId}/analytics`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const updateCourseStatus = async (courseId, isActive) => {
    try {
        const response = await axios.patch(
            `${API_URL}/instructors/courses/${courseId}/status`,
            { isActive },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getInstructorDashboard = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/instructors/dashboard`, {
            headers: getAuthHeader(),
            params: { period }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const changePassword = async (passwordData) => {
    try {
        const response = await axios.put(
            `${API_URL}/instructors/change-password`,
            passwordData,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const deleteAccount = async (data = {}) => {
    try {
        const response = await axios.delete(
            `${API_URL}/instructors/account`,
            {
                headers: getAuthHeader(),
                data // Send data in request body for DELETE
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getCourse = async (courseId) => {
    try {
        const response = await axios.get(
            `${API_URL}/instructors/courses/${courseId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};