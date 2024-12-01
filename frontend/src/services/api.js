import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://127.0.0.1:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Add request interceptor for multipart form data
API.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

// API endpoints
export const apiService = {
  // Test API connection
  getStatus: () => API.get('/status/'),
  
  // Clusters
  getClusters: () => API.get('/clusters/'),
  createCluster: (data) => API.post('/clusters/', data),
  updateCluster: (id, data) => API.put(`/clusters/${id}/`, data),
  deleteCluster: (id) => API.delete(`/clusters/${id}/`),
  toggleCluster: (id) => API.post(`/clusters/${id}/toggle_status/`),
  
  // Staff
  getStaff: () => API.get('/staff/'),
  createStaff: (data) => API.post('/staff/', data),
  updateStaff: (id, data) => API.put(`/staff/${id}/`, data),
  deleteStaff: (id) => API.delete(`/staff/${id}/`),
  toggleStaffStatus: (id) => API.post(`/staff/${id}/toggle_status/`),
  
  // Departments
  getDepartments: () => API.get('/departments/'),
  createDepartment: (data) => API.post('/departments/', data),
  updateDepartment: (id, data) => API.put(`/departments/${id}/`, data),
  deleteDepartment: (id) => API.delete(`/departments/${id}/`),
  
  // Students
  getStudents: () => API.get('/students/'),
  createStudent: (data) => API.post('/students/', data),
  updateStudent: (id, data) => API.put(`/students/${id}/`, data),
  deleteStudent: (id) => API.delete(`/students/${id}/`),
  uploadStudents: (data) => API.post('/students/bulk-upload/', data),
  downloadTemplate: () => API.get('/students/template/', { responseType: 'blob' }),
  sendCredentials: (id) => API.post(`/students/${id}/send-credentials/`),
  toggleClubChange: (id) => API.post(`/students/${id}/toggle-club-change/`),
  resetStudentPassword: (id) => API.post(`/students/${id}/reset-password/`),
  generateStudentPassword: (id) => API.post(`/students/${id}/generate-password/`),
  updateStudentCredentials: (id, data) => API.put(`/students/${id}/credentials/`, data),
  
  // Clubs
  getClubs: () => API.get('/clubs/'),
  createClub: (data) => API.post('/clubs/', data),
  updateClub: (id, data) => API.put(`/clubs/${id}/`, data),
  deleteClub: (id) => API.delete(`/clubs/${id}/`),
  toggleClubStatus: (id) => API.post(`/clubs/${id}/toggle-status/`),
};

export default API;
