import axios from 'axios';
import { API_URL } from '../config';


// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all courses with filters
export const fetchCourses = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/courses`, {
            params,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get course by ID
export const getCourse = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Book a course
export const bookCourse = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/bookings`, bookingData, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get featured courses
export const getFeaturedCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/courses/featured`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get course reviews
export const getCourseReviews = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/reviews/course/${courseId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Add course review
export const addCourseReview = async (courseId, reviewData) => {
    try {
        const response = await axios.post(
            `${API_URL}/courses/${courseId}/reviews`,
            reviewData,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get course sessions
export const getCourseSessions = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/sessions/course/${courseId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const getCourses = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/courses`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error.response?.data || error;
    }
};
export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Search courses
export const searchCourses = async (searchTerm) => {
    try {
        const response = await axios.get(`${API_URL}/courses/search`, {
            params: { query: searchTerm },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get related courses
export const getRelatedCourses = async (courseId, category) => {
    try {
        const response = await axios.get(`${API_URL}/courses/related`, {
            params: { courseId, category },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};