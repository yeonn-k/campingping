import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

export const socket = io(
  'wss://kdt-react-node-1-team03.elicecoding.com/chats',
  {
    // withCredentials: true,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }
);

// socket.on('connect_error', (error) => {
//   if (socket.active) {
//     console.log('active: ', socket.active);
//   } else {
//     console.log(error.message);
//   }
// });

// socket.on('connect', () => {
//   console.log('WebSocket connection established');
//   console.log('Socket connected:', socket.connected);
// });

// socket.on('connect_error', (error) => {
//   console.log('Connection Error:', error.message);
// });
