import { io } from 'socket.io-client';
import { CHAT_URL } from './config/config';

const token =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export const socket = io(CHAT_URL, {
  // withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
