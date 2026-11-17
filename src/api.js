/**
 * API Module
 * ==========
 * Handles all API communications with the backend server
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

function reportError(error) {
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(', ');
  return detail || error.message || 'The farm record service could not complete this request.';
}

async function request(action) {
  try {
    const response = await action();
    return response.data;
  } catch (error) {
    console.error('Krishi Rakshak API request failed:', error);
    throw new Error(reportError(error));
  }
}

export const getCrops = () => request(() => api.get('/api/crops'));
export const createCrop = (crop) => request(() => api.post('/api/crops', crop));
export const updateCrop = (id, crop) => request(() => api.put(`/api/crops/${id}`, crop));
export const deleteCrop = (id) => request(() => api.delete(`/api/crops/${id}`));
const withImageUrls = (records) => records.map((record) => ({
  ...record,
  image_url: record.image_url ? `${API_BASE_URL}${record.image_url}` : null,
}));
export const getObservations = async () => withImageUrls(await request(() => api.get('/api/observations')));
export const createObservation = async (cropId, data) => {
  const record = await request(() => api.post(`/api/crops/${cropId}/observations`, data));
  return withImageUrls([record])[0];
};
export const getWeather = (location) => request(() => api.get('/api/weather', { params: { location } }));

export const getDashboardData = async () => {
  return request(() => api.get('/api/dashboard-data'));
};

export const getStatistics = (period = null) => request(() => api.get('/api/statistics', { params: period ? { period } : {} }));
export const getAlerts = () => request(() => api.get('/api/alerts'));
export const getOutbreaks = () => request(() => api.get('/api/outbreaks'));
export const getRegionData = () => request(() => api.get('/api/regions'));
export const syncDiagnoses = (deviceId, diagnoses) => request(() => api.post('/api/sync', { device_id: deviceId, diagnoses }));
export const getDiagnoses = (skip = 0, limit = 100) => request(() => api.get('/api/diagnoses', { params: { skip, limit } }));
export const healthCheck = () => request(() => api.get('/health'));

export default api;
