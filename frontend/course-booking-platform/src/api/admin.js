import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};
export const getAdminDashboard = async (timeRange = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/admin/dashboard`, {
            headers: getAuthHeader(),
            params: { timeRange }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// User Management
export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/users`, userData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const toggleUserStatus = async (userId) => {
    try {
        const response = await axios.put(`${API_URL}/admin/users/${userId}/toggle-status`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Course Management
export const getAllCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/courses`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const approveCourse = async (courseId) => {
    try {
        const response = await axios.put(`${API_URL}/admin/courses/${courseId}/approve`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const rejectCourse = async (courseId, reason) => {
    try {
        const response = await axios.put(`${API_URL}/admin/courses/${courseId}/reject`, { reason }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/courses/${courseId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Booking Management
export const getAllBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/bookings`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    try {
        const response = await axios.put(`${API_URL}/admin/bookings/${bookingId}/status`, { status }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const refundBooking = async (bookingId, reason) => {
    try {
        const response = await axios.post(`${API_URL}/admin/bookings/${bookingId}/refund`, { reason }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteBooking = async (bookingId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/bookings/${bookingId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const exportBookingsData = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/bookings/export`, {
            headers: getAuthHeader(),
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Reports
export const getRevenueReport = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/admin/reports/revenue`, {
            headers: getAuthHeader(),
            params: { period },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEnrollmentReport = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/admin/reports/enrollment`, {
            headers: getAuthHeader(),
            params: { period },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getInstructorPerformanceReport = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/admin/reports/instructors`, {
            headers: getAuthHeader(),
            params: { period },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getCoursePerformanceReport = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}/admin/reports/courses`, {
            headers: getAuthHeader(),
            params: { period },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const exportReportData = async (type, period) => {
    try {
        const response = await axios.get(`${API_URL}/admin/reports/${type}/export`, {
            headers: getAuthHeader(),
            params: { period },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// System Settings
export const getSystemSettings = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/settings`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateGeneralSettings = async (settings) => {
    try {
        const response = await axios.put(`${API_URL}/admin/settings/general`, settings, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateEmailSettings = async (settings) => {
    try {
        const response = await axios.put(`${API_URL}/admin/settings/email`, settings, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updatePaymentSettings = async (settings) => {
    try {
        const response = await axios.put(`${API_URL}/admin/settings/payment`, settings, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateSecuritySettings = async (settings) => {
    try {
        const response = await axios.put(`${API_URL}/admin/settings/security`, settings, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const testEmailSettings = async () => {
    try {
        const response = await axios.post(`${API_URL}/admin/settings/email/test`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const testPaymentSettings = async () => {
    try {
        const response = await axios.post(`${API_URL}/admin/settings/payment/test`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Categories
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/categories`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/categories`, categoryData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const removeCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/categories/${categoryId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// System Maintenance
export const backupSystem = async () => {
    try {
        const response = await axios.post(`${API_URL}/admin/system/backup`, {}, {
            headers: getAuthHeader(),
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const restoreSystem = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/system/restore`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getMaintenanceLogs = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/system/logs`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};