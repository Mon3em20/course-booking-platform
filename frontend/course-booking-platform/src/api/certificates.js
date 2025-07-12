import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get certificate by ID
export const getCertificateById = async (certificateId) => {
    try {
        const response = await axios.get(`${API_URL}/certificates/${certificateId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Verify a certificate
export const verifyCertificate = async (certificateNumber) => {
    try {
        const response = await axios.get(`${API_URL}/certificates/verify/${certificateNumber}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Download certificate as PDF
export const downloadCertificatePdf = async (certificateId) => {
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

// Share certificate via email
export const shareCertificateViaEmail = async ({ certificateId, recipientEmail, message }) => {
    try {
        const response = await axios.post(
            `${API_URL}/certificates/${certificateId}/share`,
            { recipientEmail, message },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};