const axios = require('axios');

/**
 * Get Zoom JWT token
 * @returns {string} JWT token
 */
const getZoomToken = async () => {
    try {
        const response = await axios.post(
            'https://zoom.us/oauth/token',
            null,
            {
                params: {
                    grant_type: 'account_credentials',
                    account_id: process.env.ZOOM_ACCOUNT_ID
                },
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Zoom token:', error.response?.data || error.message);
        throw new Error('Failed to get Zoom authorization token');
    }
};

/**
 * Create a Zoom meeting
 * @param {Object} meetingData - Meeting data
 * @returns {Object} Meeting details
 */
const createZoomMeeting = async (meetingData) => {
    try {
        const token = await getZoomToken();

        const response = await axios.post(
            `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings`,
            {
                topic: meetingData.topic,
                type: 2, // Scheduled meeting
                start_time: meetingData.start_time,
                duration: meetingData.duration,
                timezone: process.env.ZOOM_TIMEZONE || 'UTC',
                agenda: meetingData.agenda,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    waiting_room: true,
                    auto_recording: 'cloud'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating Zoom meeting:', error.response?.data || error.message);
        throw new Error('Failed to create Zoom meeting');
    }
};

/**
 * Update a Zoom meeting
 * @param {string} meetingId - Meeting ID
 * @param {Object} meetingData - Updated meeting data
 * @returns {Object} Updated meeting details
 */
const updateZoomMeeting = async (meetingId, meetingData) => {
    try {
        const token = await getZoomToken();

        const response = await axios.patch(
            `https://api.zoom.us/v2/meetings/${meetingId}`,
            {
                topic: meetingData.topic,
                start_time: meetingData.start_time,
                duration: meetingData.duration,
                agenda: meetingData.agenda
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating Zoom meeting:', error.response?.data || error.message);
        throw new Error('Failed to update Zoom meeting');
    }
};

/**
 * Delete a Zoom meeting
 * @param {string} meetingId - Meeting ID
 */
const deleteZoomMeeting = async (meetingId) => {
    try {
        const token = await getZoomToken();

        await axios.delete(
            `https://api.zoom.us/v2/meetings/${meetingId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return true;
    } catch (error) {
        console.error('Error deleting Zoom meeting:', error.response?.data || error.message);
        throw new Error('Failed to delete Zoom meeting');
    }
};

/**
 * Get Zoom meeting recordings
 * @param {string} meetingId - Meeting ID
 * @returns {Object} Recording details
 */
const getZoomRecordings = async (meetingId) => {
    try {
        const token = await getZoomToken();

        const response = await axios.get(
            `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error getting Zoom recordings:', error.response?.data || error.message);
        throw new Error('Failed to get Zoom recordings');
    }
};

module.exports = {
    createZoomMeeting,
    updateZoomMeeting,
    deleteZoomMeeting,
    getZoomRecordings
};