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

socket.on('connect_error', (error) => {
  if (socket.active) {
    console.log('active: ', socket.active);
  } else {
    console.log(error.message);
  }
});

socket.on('connect', () => {
  console.log('WebSocket connection established');
  console.log('Socket connected:', socket.connected);
});

socket.on('connect_error', (error) => {
  console.log('Connection Error:', error.message);
});

socket.emit('message', 'Hello, server!');

// let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

// export const getSocket = () => {
//   if (!socket) {
//     socket = io('wss://kdt-react-node-1-team03.elicecoding.com/chats', {
//       withCredentials: true,
//       extraHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // 연결 오류 처리
//     socket.on('connect_error', (error) => {
//       console.log('Connection Error:', error.message);
//     });

//     // 연결 성공 시 처리
//     socket.on('connect', () => {
//       console.log('WebSocket connection established');
//       console.log('Socket connected:', socket?.connected);
//     });

//     // 서버로 메시지 전송 (예시)
//     socket.emit('message', 'Hello, server!');
//   }

//   return socket;
// };
