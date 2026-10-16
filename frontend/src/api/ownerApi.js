import api from './axios.js';

export const getOwnerDashboard = () => api.get('/owner/dashboard');
