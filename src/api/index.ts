import axios from 'axios';
import { Document, DocumentFormData } from '../types/documents';

const API_HOST = 'https://test.v5.pryaniky.com';

const api = axios.create({
  baseURL: `${API_HOST}/ru/data/v3/testmethods/docs`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['x-auth'] = token;
  }
  return config;
});

export interface LoginResponseData {
  error_code?: number;
  error_text?: string;
  data?: {
    token: string;
  };
}

export interface ApiResponse<T> {
  error_code: number;
  data: T;
}

export const login = (username: string, password: string) =>
  api.post<LoginResponseData>('/login', { 
    username: username.trim(), 
    password 
  });

export const getDocuments = () =>
  api.get<ApiResponse<Document[]>>('/userdocs/get');

export const createDocument = (data: DocumentFormData) =>
  api.post<ApiResponse<Document>>('/userdocs/create', {
    ...data,
    companySigDate: new Date(data.companySigDate).toISOString(),
    employeeSigDate: new Date(data.employeeSigDate).toISOString()
  });

export const updateDocument = (id: string, data: DocumentFormData) =>
  api.post<ApiResponse<Document>>(`/userdocs/set/${id}`, {
    ...data,
    companySigDate: new Date(data.companySigDate).toISOString(),
    employeeSigDate: new Date(data.employeeSigDate).toISOString()
  });

export const deleteDocument = (id: string) =>
  api.post<ApiResponse<null>>(`/userdocs/delete/${id}`);