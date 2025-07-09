import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

let socket: Socket;

export const initializeSocket = (userId: string) => {
  // If socket already exists, disconnect it first
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
  });

  // Add detailed logging
  socket.on('connect', () => {
    console.log('Socket connected successfully');
    console.log('Socket ID:', socket.id);
    socket.emit("joinUserRoom", userId);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('orderUpdate', (updatedOrder) => {
    console.log('Received order update:', updatedOrder);
  });

  return socket;
};

export const joinOrderRoom = (orderId: string) => {
  if (socket) {
    console.log(`Joining order room: order_${orderId}`);
    socket.emit("joinOrderRoom", orderId);
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized!");
  }
  return socket;
};