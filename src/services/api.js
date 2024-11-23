import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000', // Mocked local API for testing
  headers: { 'Content-Type': 'application/json' },
});

export const getUsers = () => api.get('/users');
export const createUser = (user) => api.post('/users', user);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getRoles = () => api.get('/roles');
export const createRole = (role) => api.post('/roles', role);
export const updateRole = (id, role) => api.put(`/roles/${id}`, role);
export const deleteRole = (id) => api.delete(`/roles/${id}`);
