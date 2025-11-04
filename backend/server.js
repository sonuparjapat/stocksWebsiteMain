// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initDB } from './db.js';
import { ensureDefaultUser } from './utility/utility.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// 🧩 Initialize DB (create tables if not exist)
await initDB();
// await ensureDefaultUser()
// 🧠 Basic route
app.get('/', (req, res) => {
  res.send('Backend server running successfully 🚀');
});

// 🧩 Example route: get all users
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 🔥 WebSocket setup
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  // Listen for a new message from frontend
  socket.on('send_message', async (data) => {
    try {
      const { user_id, content } = data;
      const result = await pool.query(
        'INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *',
        [user_id, content]
      );

      const newMessage = result.rows[0];

      // Broadcast to all clients
      io.emit('new_message', newMessage);
      console.log('💬 Broadcast new message:', newMessage);
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});
// 🧠 Route: Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT messages.*, users.name 
      FROM messages 
      LEFT JOIN users ON users.id = messages.user_id 
      ORDER BY messages.created_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));