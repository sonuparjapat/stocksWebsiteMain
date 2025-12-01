// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initDB } from './db.js';
import { setupSocket } from './lib/socket.js';
import { getStockQuote, getStockQuotes, searchStocks, getMarketNews } from './lib/stockService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*'
}));
app.use(express.json());

// Initialize DB (create tables if necessary)
(async () => {
  try {
    await initDB();
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('DB init error', err);
    // proceed — initDB should throw on fatal issues
  }
})();

// Basic root route & health
app.get('/', (req, res) => res.send('Backend server running successfully 🚀'));
app.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Example route: get all users
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Example messages route
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
// simple health
app.get('/', (req, res) => res.send({ ok: true }));

// GET /api/ipos -> returns ipos from DB
app.get('/api/ipos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ipos ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET /api/ipos error', err);
    res.status(500).json({ success: false, error: 'DB read error' });
  }
});
app.get('/api/ipos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM ipos WHERE id = $1 LIMIT 1', [id]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'IPO not found' });



    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB read error' });
  }
});
// Stock Routes
app.get('/api/stocks/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });
  const results = await searchStocks(q);
  res.json(results);
});

app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const quote = await getStockQuote(req.params.symbol);
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

app.get('/api/market/status', async (req, res) => {
  // Example: Fetch NIFTY 50
  try {
    const quote = await getStockQuote('^NSEI');
    res.json(quote);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const newsRaw = await getMarketNews();
    // Map to frontend expected format
    const news = newsRaw.map(n => ({
      id: n.uuid || n.link,
      title: n.title,
      summary: n.publisher || '', // Yahoo finance search news doesn't always have summary, use publisher as fallback or empty
      category: n.type || 'Market',
      publishedAt: n.providerPublishTime ? new Date(n.providerPublishTime).toISOString() : new Date().toISOString(),
      imageUrl: n.thumbnail?.resolutions?.[0]?.url || '', // Try to get thumbnail
      link: n.link
    }));
    res.json({ data: news });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed' });
  }
});

// Attach socket handlers (all complex socket logic lives inside lib/socket.js)
setupSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
