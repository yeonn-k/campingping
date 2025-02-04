import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

export interface ConsoleError {
  status: number;
  data: unknown;
}

export const successInterceptor = (response: AxiosResponse) => {
  return response;
};

export const errorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    console.warn('❗️Unauthorized: Redirecting to login');
    toast.error('❗️로그인을 확인해주세요');
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
