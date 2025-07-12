export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
};