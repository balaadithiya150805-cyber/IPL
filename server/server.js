import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import { setupAuctionSockets } from './sockets/auctionEvents.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend Vite development & production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Setup Real-time Auction Socket Handlers
setupAuctionSockets(io);

// REST API Endpoints
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'IPL Mock Auction Engine', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start HTTP/WebSocket Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`
🏏 ===============================================
🏆 IPL MOCK AUCTION SERVER RUNNING
🚀 Port: ${PORT}
⚡ WebSocket: Socket.io Enabled
🏏 Health: http://localhost:${PORT}/health
===============================================
    `);
  });
});
