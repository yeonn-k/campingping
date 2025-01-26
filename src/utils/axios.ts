import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { errorInterceptor, successInterceptor } from './interceptors';
import { API_URL } from '@/config/config';

const token =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const headers: Record<string, string> = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*',
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: API_URL,
  responseType: 'json',
  withCredentials: true,
  headers,
};

export const api: AxiosInstance = axios.create(axiosRequestConfig);

api.interceptors.response.use(successInterceptor, errorInterceptor);

export { axios };
