import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize axios instance with default config
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add token to Authorization header for all requests if token exists
    api.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Handle unauthorized errors (401)
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                // Token expired or invalid
                logout();
            }
            return Promise.reject(error);
        }
    );

    // Load user data from token on initial load
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
            } catch (err) {
                console.error('Error loading user profile:', err);
                // If token is invalid, clear it
                localStorage.removeItem('token');
                setToken(null);
                setError(err.response?.data?.message || 'Error loading user profile');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Register a new user
    const register = async (name, email, password, role) => {
        try {
            const response = await api.post('/users', { name, email, password, role });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { token: newToken, user: userData } = response.data;

            // Save token to localStorage and state
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            setError(null);

            return userData;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            const response = await api.put('/users/profile', userData);
            setUser(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Profile update failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Reset password request
    const forgotPassword = async (email) => {
        try {
            const response = await api.post('/users/forgot-password', { email });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Password reset request failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Reset password with token
    const resetPassword = async (token, password) => {
        try {
            const response = await api.post(`/users/reset-password/${token}`, { password });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Password reset failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    // Change password
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await api.put('/users/change-password', {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Password change failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        changePassword,
        api,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};