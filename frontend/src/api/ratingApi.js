import api from './axios.js';

export const createRating = (data)       => api.post('/ratings', data);
export const updateRating = (id, data)   => api.put(`/ratings/${id}`, data);
