import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  path: 'wss://kdt-react-node-1-team03.elicecoding.com/api/chats',
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('message', (msg) => {
  console.log('Message from server:', msg);
});

socket.emit('message', 'Hello, Server!');

export default socket;
