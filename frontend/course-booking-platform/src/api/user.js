import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user profile
export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/profile`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const response = await axios.put(`${API_URL}/users/profile`, profileData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Change password
export const changePassword = async ({ currentPassword, newPassword }) => {
    try {
        const response = await axios.put(
            `${API_URL}/users/change-password`,
            { currentPassword, newPassword },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete account
export const deleteAccount = async () => {
    try {
        const response = await axios.delete(`${API_URL}/users/account`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update user preferences
export const updateUserPreferences = async ({ type, preferences }) => {
    try {
        const response = await axios.put(
            `${API_URL}/users/preferences`,
            { type, preferences },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Export user data
export const exportUserData = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/export-data`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get user activity
export const getUserActivity = async (limit = 10) => {
    try {
        const response = await axios.get(`${API_URL}/users/activity`, {
            headers: getAuthHeader(),
            params: { limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update notification settings
export const updateNotificationSettings = async (settings) => {
    try {
        const response = await axios.put(
            `${API_URL}/users/notifications/settings`,
            settings,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};