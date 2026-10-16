import api from './axios.js';

export const getDashboard      = ()       => api.get('/admin/dashboard');
export const getUsers          = (params) => api.get('/admin/users', { params });
export const createUser        = (data)   => api.post('/admin/users', data);
export const getUserById       = (id)     => api.get(`/admin/users/${id}`);
export const getAdminStores    = (params) => api.get('/admin/stores', { params });
export const createStore       = (data)   => api.post('/admin/stores', data);
export const getAdminStoreById = (id)     => api.get(`/admin/stores/${id}`);
