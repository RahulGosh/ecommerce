// src/utils/adminSocket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

let adminSocket: Socket;

export const initializeAdminSocket = () => {
  // Disconnect existing socket if any
  if (adminSocket) {
    adminSocket.disconnect();
  }

  adminSocket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    transports: ["websocket"],
    query: { isAdmin: "true" }
  });

  // Connection logging
  adminSocket.on('connect', () => {
    console.log('Admin socket connected');
  });

  adminSocket.on('connect_error', (error) => {
    console.error('Admin socket connection error:', error);
  });

  return adminSocket;
};

export const joinAdminOrderRoom = (orderId: string) => {
  if (adminSocket) {
    adminSocket.emit("joinOrderRoom", orderId);
  }
};

export const getAdminSocket = () => {
  if (!adminSocket) {
    throw new Error("Admin socket not initialized!");
  }
  return adminSocket;
};