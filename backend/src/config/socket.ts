import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';

let io: SocketServer;

export const initializeSocket = (server: Server): SocketServer => {
  io = new SocketServer(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.ADMIN_URL || 'http://localhost:5174'
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Add these additional options for better reliability
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    transports: ['websocket', 'polling'], // Enable both transports
    allowEIO3: true, // For backward compatibility
    cookie: {
      name: 'io',
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    }
  });

  // Connection logging and error handling
  io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id} from ${socket.handshake.headers.origin}`);

    // Authentication middleware (optional)
    socket.use((event, next) => {
      try {
        // Add any authentication logic here
        console.log(`Event ${event[0]} from ${socket.id}`);
        next();
      } catch (error) {
        console.error('Socket middleware error:', error);
        next(new Error('Authentication error'));
      }
    });

    // Room management
    socket.on('joinUserRoom', (userId: string) => {
      if (!userId) {
        console.error('No userId provided for joinUserRoom');
        return;
      }
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room (Socket: ${socket.id})`);
    });

    socket.on('joinOrderRoom', (orderId: string) => {
      if (!orderId) {
        console.error('No orderId provided for joinOrderRoom');
        return;
      }
      socket.join(`order_${orderId}`);
      console.log(`Client joined order room: order_${orderId} (Socket: ${socket.id})`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error (${socket.id}):`, error);
    });

    // Disconnection handling
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected (${socket.id}):`, reason);
      // Clean up any room associations if needed
    });

    // Heartbeat monitoring
    socket.on('ping', (cb) => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  });

  // Server-wide error handling
  io.engine.on('connection_error', (err) => {
    console.error('Socket.io connection error:', err);
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initializeSocket first');
  }
  return io;
};

export const emitOrderUpdate = (order: any): void => {
  if (!order?._id || !order?.user) {
    console.error('Invalid order object for emitOrderUpdate:', order);
    return;
  }

  try {
    const io = getIO();
    const orderRoom = `order_${order._id}`;
    const userRoom = `user_${order.user}`;
    
    console.log(`Emitting order update to ${orderRoom} and ${userRoom}`);
    
    // Emit to specific rooms
    io.to(orderRoom).emit('orderUpdate', order);
    io.to(userRoom).emit('orderUpdate', order);
    
    // Optional: Emit to admin room if needed
    // io.to('admin_room').emit('orderUpdate', order);
  } catch (error) {
    console.error('Error emitting order update:', error);
  }
};

// Optional: Add admin-specific functions
export const emitAdminNotification = (message: string): void => {
  try {
    const io = getIO();
    io.to('admin_room').emit('adminNotification', { message, timestamp: new Date() });
  } catch (error) {
    console.error('Error emitting admin notification:', error);
  }
};