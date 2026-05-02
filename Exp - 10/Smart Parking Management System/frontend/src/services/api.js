import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) =>
    apiClient.post('/auth/register', data),
  login: (credentials) =>
    apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

// Parking Lot API
export const parkingLotAPI = {
  getLots: (page = 1, limit = 10) =>
    apiClient.get(`/parking/lots?page=${page}&limit=${limit}`),
  getLot: (lotId) => apiClient.get(`/parking/lots/${lotId}`),
  getOccupancy: (lotId) => apiClient.get(`/parking/lots/${lotId}/occupancy`),
  createLot: (data) => apiClient.post('/parking/lots', data),
};

// Parking Slot API
export const parkingSlotAPI = {
  getSlots: (lotId, page = 1, limit = 50) =>
    apiClient.get(`/parking/slots/lot/${lotId}?page=${page}&limit=${limit}`),
  getSlot: (slotId) => apiClient.get(`/parking/slots/${slotId}`),
  addSlot: (lotId, data) => apiClient.post(`/parking/slots/lot/${lotId}`, data),
  removeSlot: (slotId, lotId) => apiClient.delete(`/parking/slots/${slotId}`, { data: { lotId } }),
};

// Booking API
export const bookingAPI = {
  createBooking: (data) => apiClient.post('/bookings/create', data),
  getBooking: (bookingId) => apiClient.get(`/bookings/${bookingId}`),
  getUserBookings: (page = 1, limit = 10) =>
    apiClient.get(`/bookings/user?page=${page}&limit=${limit}`),
  getActiveBooking: () => apiClient.get('/bookings/user/active'),
  cancelBooking: (bookingId, reason) =>
    apiClient.put(`/bookings/${bookingId}/cancel`, { cancellationReason: reason }),
  markEntry: (bookingId) => apiClient.post('/bookings/entry/mark', { bookingId }),
  markExit: (bookingId) => apiClient.post('/bookings/exit/mark', { bookingId }),
  getBookingByCode: (bookingId) => apiClient.get(`/bookings/code/${bookingId}`),
};

// Admin API
export const adminAPI = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: (page = 1, limit = 10) =>
    apiClient.get(`/admin/users?page=${page}&limit=${limit}`),
  getBookings: (page = 1, limit = 10) =>
    apiClient.get(`/admin/bookings?page=${page}&limit=${limit}`),
  getRevenueReport: () => apiClient.get('/admin/revenue'),
  getAuditLogs: (page = 1, limit = 50) =>
    apiClient.get(`/admin/audit-logs?page=${page}&limit=${limit}`),
  blockUser: (userId) => apiClient.put(`/auth/users/${userId}/block`),
  unblockUser: (userId) => apiClient.put(`/auth/users/${userId}/unblock`),
};

export default apiClient;
