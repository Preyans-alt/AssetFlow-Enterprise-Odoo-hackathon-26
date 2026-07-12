import axios from 'axios';
import { User, Department, Category, Asset, Booking, MaintenanceRequest, AuditCycle, AuditResult } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Automatically inject JWT token into requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  signup: async (data: any) => {
    const res = await api.post('/auth/signup', data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get<User[]>('/auth/users');
    return res.data;
  },
  updateUser: async (data: { userId: string; role?: string; status?: string; departmentId?: string | null }) => {
    const res = await api.put('/auth/users/role', data);
    return res.data;
  },
};

export const departmentAPI = {
  getDepartments: async () => {
    const res = await api.get<Department[]>('/departments');
    return res.data;
  },
  createDepartment: async (data: any) => {
    const res = await api.post<Department>('/departments', data);
    return res.data;
  },
  updateDepartment: async (id: string, data: any) => {
    const res = await api.put<Department>(`/departments/${id}`, data);
    return res.data;
  },
};

export const assetAPI = {
  getCategories: async () => {
    const res = await api.get<Category[]>('/assets/categories');
    return res.data;
  },
  createCategory: async (data: { name: string }) => {
    const res = await api.post<Category>('/assets/categories', data);
    return res.data;
  },
  getAssets: async () => {
    const res = await api.get<Asset[]>('/assets');
    return res.data;
  },
  getAssetById: async (id: string) => {
    const res = await api.get<Asset>(`/assets/${id}`);
    return res.data;
  },
  createAsset: async (data: any) => {
    const res = await api.post<Asset>('/assets', data);
    return res.data;
  },
  updateAsset: async (id: string, data: any) => {
    const res = await api.put<Asset>(`/assets/${id}`, data);
    return res.data;
  },
  allocateAsset: async (id: string, data: { assignedToUser?: string | null; assignedToDept?: string | null; expectedReturn?: string | null }) => {
    const res = await api.post<Asset>(`/assets/${id}/allocate`, data);
    return res.data;
  },
  returnAsset: async (id: string, data: { condition?: string }) => {
    const res = await api.post<Asset>(`/assets/${id}/return`, data);
    return res.data;
  },
};

export const bookingAPI = {
  getBookings: async () => {
    const res = await api.get<Booking[]>('/bookings');
    return res.data;
  },
  createBooking: async (data: { assetId: string; startTime: string; endTime: string }) => {
    const res = await api.post<Booking>('/bookings', data);
    return res.data;
  },
  cancelBooking: async (id: string) => {
    const res = await api.post<Booking>(`/bookings/${id}/cancel`);
    return res.data;
  },
};

export const maintenanceAPI = {
  getRequests: async () => {
    const res = await api.get<MaintenanceRequest[]>('/maintenance');
    return res.data;
  },
  createRequest: async (data: { assetId: string; description: string; priority: string }) => {
    const res = await api.post<MaintenanceRequest>('/maintenance', data);
    return res.data;
  },
  updateRequestStatus: async (id: string, data: { status: string; technicianId?: string | null }) => {
    const res = await api.put<MaintenanceRequest>(`/maintenance/${id}/status`, data);
    return res.data;
  },
};

export const auditAPI = {
  getCycles: async () => {
    const res = await api.get<AuditCycle[]>('/audit');
    return res.data;
  },
  createCycle: async (data: { name: string; startDate: string; endDate: string }) => {
    const res = await api.post<AuditCycle>('/audit', data);
    return res.data;
  },
  submitResult: async (data: { auditCycleId: string; assetId: string; status: string; notes?: string }) => {
    const res = await api.post<AuditResult>('/audit/result', data);
    return res.data;
  },
  closeCycle: async (id: string) => {
    const res = await api.post<AuditCycle>(`/audit/${id}/close`);
    return res.data;
  },
};

export const dashboardAPI = {
  getKPIs: async () => {
    const res = await api.get('/dashboard/kpis');
    return res.data;
  },
};

export default api;
