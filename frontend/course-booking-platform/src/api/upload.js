import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Upload course image
export const uploadCourseImage = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/upload/course-image`, formData, {
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

// Upload course material
export const uploadCourseMaterial = async (courseId, formData) => {
    try {
        const response = await axios.post(`${API_URL}/upload/course-material/${courseId}`, formData, {
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

// Upload profile image
export const uploadProfileImage = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/upload/profile-image`, formData, {
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