import api from './axios.js';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const changePassword = (data) => api.patch('/auth/change-password', data);
