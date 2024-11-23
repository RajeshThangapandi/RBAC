import { useState } from 'react';
import axios from 'axios';

const useApi = (baseUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = axios.create({
    baseURL: 'http://localhost:9000', // This is where your JSON Server should be running
    headers: { 'Content-Type': 'application/json' },
  });
  

  const fetchData = async (endpoint) => {
    setLoading(true);
    try {
      const response = await api.get(`${baseUrl}${endpoint}`);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (endpoint, payload) => {
    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, payload);
      setData(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const updateData = async (endpoint, payload) => {
    try {
      const response = await axios.put(`${baseUrl}${endpoint}`, payload);
      setData(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const deleteData = async (endpoint) => {
    try {
      await axios.delete(`${baseUrl}${endpoint}`);
      setData(null);
    } catch (err) {
      setError(err);
    }
  };

  return { data, loading, error, fetchData, postData, updateData, deleteData };
};

export default useApi;
