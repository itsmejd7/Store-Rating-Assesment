import api from './axios.js';

export const getStores    = (params) => api.get('/stores', { params });
export const getStoreById = (id)     => api.get(`/stores/${id}`);
