import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';

export interface ConsoleError {
  status: number;
  data: unknown;
}

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
};

export const successInterceptor = (response: AxiosResponse) => {
  return response;
};

export const errorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    console.warn('❗️Unauthorized: Redirecting to login');
    window.location.href = '/sign-in';
  } else {
    if (error.response) {
      console.error({
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('❌ No response: ', error.request);
    } else {
      console.error('❌Error message: ', error.message);
    }
    return Promise.reject(error);
  }
};
