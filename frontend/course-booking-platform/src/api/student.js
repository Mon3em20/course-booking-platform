import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get student dashboard data
export const getStudentDashboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/student`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get student's enrolled courses
export const getEnrolledCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get student's course content
export const getCourseContent = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}/content`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get student's bookings
export const getStudentBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.put(
            `${API_URL}/bookings/${bookingId}/cancel`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get student's certificates
export const getStudentCertificates = async () => {
    try {
        const response = await axios.get(`${API_URL}/certificates/student`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Download certificate
export const downloadCertificate = async (certificateId) => {
    try {
        const response = await axios.get(`${API_URL}/certificates/${certificateId}/download`, {
            headers: getAuthHeader(),
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get student notifications
export const getNotifications = async () => {
    try {
        const response = await axios.get(`${API_URL}/notifications`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.put(
            `${API_URL}/notifications/${notificationId}/read`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axios.put(
            `${API_URL}/notifications/read-all`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};