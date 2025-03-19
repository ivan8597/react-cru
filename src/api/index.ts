import axios from 'axios';

const API_HOST = 'https://test.v5.pryaniky.com';

const api = axios.create({
  baseURL: `${API_HOST}/ru/data/v3/testmethods/docs`,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth'] = token;
  }
  return config;
});

export interface Document {
  id: string;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

export interface LoginResponseData {
  error_code?: number;
  error_text?: string;
  token?: string;
  data?: {
    token?: string;
  } | null;
}

export const login = (username: string, password: string) =>
  api.post<LoginResponseData>('/login', JSON.stringify({ username, password }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });


export const getDocuments = () =>
  api.get<{ data: Document[] }>('/userdocs/get');

export const createDocument = (data: Omit<Document, 'id'>) =>
  api.post<{ data: Document }>('/userdocs/create', data);

export const updateDocument = (id: string, data: Omit<Document, 'id'>) =>
  api.post<{ data: Document }>(`/userdocs/set/${id}`, data);

export const deleteDocument = (id: string) =>
  api.post(`/userdocs/delete/${id}`, {});