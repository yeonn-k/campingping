import { BASE_URL } from '@/config/config';
import axios from 'axios';
import { cookies } from 'next/headers';

const serverApiClient = axios.create({
  baseURL: BASE_URL,
});

serverApiClient.interceptors.request.use(
  async (config) => {
    const cookieStore = cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default serverApiClient;
