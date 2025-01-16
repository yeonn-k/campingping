import { io } from 'socket.io-client';

// const token = localStorage.getItem('token');

export const socket = io(
  'wss://kdt-react-node-1-team03.elicecoding.com/chats',
  {
    withCredentials: true,
    // extraHeaders: {
    //   Authorization: `Bearer ${token}`,
    // },
  }
);
