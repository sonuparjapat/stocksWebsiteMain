// backend/lib/socket.js
import { getStockBySymbol, query, getNewsArticles, create } from '../db.js';

/**
 * setupSocket(io)
 * - Attaches socket handlers to io
 * - Exposes io.broadcastNewsUpdate and io.broadcastForumUpdate helpers
 *
 * Note:
 * - Requires backend/db.js to export: query, getStockBySymbol, getNewsArticles, create
 * - Simulator runs only when NODE_ENV !== 'production'
 */
export const setupSocket = (io) => {
  // Map of socketId -> Set of subscription keys (e.g., 'stock:AAPL', 'forum:123', 'ticker')
  const clients = new Map();

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);
    clients.set(socket.id, new Set());

    // HELPER: safe emit wrapper
    const safeEmit = (ev, payload) => {
      try { socket.emit(ev, payload); } catch (e) { console.error('Emit error', e); }
    };

    // -------- Subscriptions --------
    socket.on('subscribe-stock', (symbol) => {
      if (!symbol) return;
      const subscriptions = clients.get(socket.id);
      subscriptions?.add(`stock:${symbol}`);
      socket.join(`stock:${symbol}`);
      console.log(`Client ${socket.id} subscribed to stock: ${symbol}`);
    });

    socket.on('unsubscribe-stock', (symbol) => {
      const subscriptions = clients.get(socket.id);
      subscriptions?.delete(`stock:${symbol}`);
      socket.leave(`stock:${symbol}`);
      console.log(`Client ${socket.id} unsubscribed from stock: ${symbol}`);
    });

    socket.on('subscribe-forum', (threadId) => {
      if (!threadId) return;
      const subscriptions = clients.get(socket.id);
      subscriptions?.add(`forum:${threadId}`);
      socket.join(`forum:${threadId}`);
      console.log(`Client ${socket.id} subscribed to forum: ${threadId}`);
    });

    socket.on('unsubscribe-forum', (threadId) => {
      const subscriptions = clients.get(socket.id);
      subscriptions?.delete(`forum:${threadId}`);
      socket.leave(`forum:${threadId}`);
      console.log(`Client ${socket.id} unsubscribed from forum: ${threadId}`);
    });

    socket.on('subscribe-ticker', () => {
      const subscriptions = clients.get(socket.id);
      subscriptions?.add('ticker');
      socket.join('ticker');
      console.log(`Client ${socket.id} subscribed to live ticker`);
    });

    socket.on('unsubscribe-ticker', () => {
      const subscriptions = clients.get(socket.id);
      subscriptions?.delete('ticker');
      socket.leave('ticker');
      console.log(`Client ${socket.id} unsubscribed from live ticker`);
    });

    // -------- Forum message (requires auth in prod) --------
    socket.on('forum-message', async (data) => {
      try {
        // Basic validation
        if (!data || !data.threadId || !data.userId || !data.content) {
          safeEmit('error', { message: 'Invalid forum message payload' });
          return;
        }

        // TODO: Replace with actual auth check (JWT) in production
        // Save message to DB (create helper returns inserted row)
        const reply = await create('forum_replies', {
          thread_id: data.threadId,
          user_id: data.userId,
          content: data.content,
          parent_reply_id: null,
        });

        // Update thread reply_count and last_reply_at
        await query(
          `UPDATE forum_threads SET reply_count = reply_count + 1, last_reply_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [data.threadId]
        );

        // Broadcast to all clients subscribed to this thread
        const payload = {
          ...reply,
          username: data.username || null,
          timestamp: new Date().toISOString(),
        };
        io.to(`forum:${data.threadId}`).emit('forum-reply', payload);

        console.log(`Forum message posted in thread ${data.threadId}`);
      } catch (err) {
        console.error('Error saving forum message:', err);
        safeEmit('error', { message: 'Failed to post message' });
      }
    });

    // -------- One-off stock request (immediate) --------
    socket.on('request-stock-update', async (symbol) => {
      if (!symbol) {
        safeEmit('error', { message: 'Symbol required' });
        return;
      }
      try {
        const stock = await getStockBySymbol(symbol);
        if (!stock) {
          safeEmit('error', { message: 'Stock not found' });
          return;
        }
        const prevClose = stock.previous_close || stock.current_price || 1;
        const change = parseFloat((stock.current_price - prevClose).toFixed(2));
        const changePercent = prevClose === 0 ? 0 : parseFloat(((change / prevClose) * 100).toFixed(2));
        const update = {
          symbol: stock.symbol,
          price: parseFloat(stock.current_price),
          change,
          changePercent,
          volume: stock.volume,
          timestamp: new Date().toISOString(),
        };
        safeEmit('stock-update', update);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        safeEmit('error', { message: 'Failed to fetch stock data' });
      }
    });

    // -------- Latest news --------
    socket.on('request-latest-news', async () => {
      try {
        const news = await getNewsArticles({ limit: 5 });
        safeEmit('latest-news', news);
      } catch (err) {
        console.error('Error fetching news:', err);
        safeEmit('error', { message: 'Failed to fetch news' });
      }
    });

    // -------- Send/receive simple chat messages (example) --------
    socket.on('send_message', async (data) => {
      try {
        if (!data || !data.user_id || !data.content) {
          safeEmit('error', { message: 'Invalid message payload' });
          return;
        }
        const result = await create('messages', {
          user_id: data.user_id,
          content: data.content,
        });
        io.emit('new_message', result);
        console.log('💬 Broadcast new message:', result);
      } catch (err) {
        console.error('Error saving chat message:', err);
        safeEmit('error', { message: 'Failed to send message' });
      }
    });

    // -------- Disconnect cleanup --------
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
      clients.delete(socket.id);
    });

    // Welcome
    safeEmit('connected', { message: 'Connected to Stock Market WebSocket', timestamp: new Date().toISOString() });
  });

  // -------- Stock simulator (dev only) --------
  const simulateStockUpdates = async () => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    // interval in ms
    const INTERVAL = parseInt(process.env.SIMULATOR_INTERVAL_MS || '5000', 10);

    setInterval(async () => {
      for (const symbol of symbols) {
        try {
          // check if anybody is listening for this symbol or ticker
          const stockRoom = io.of('/').adapter.rooms.get(`stock:${symbol}`);
          const tickerRoom = io.of('/').adapter.rooms.get('ticker');
          const hasStockSubs = stockRoom && stockRoom.size > 0;
          const hasTickerSubs = tickerRoom && tickerRoom.size > 0;

          // Skip updates when nobody is listening
          if (!hasStockSubs && !hasTickerSubs) continue;

          const stock = await getStockBySymbol(symbol);
          if (!stock) continue;

          // small random change
          const change = parseFloat(((Math.random() - 0.5) * 2).toFixed(2));
          const newPrice = parseFloat((Number(stock.current_price) + change).toFixed(2));
          const prevClose = stock.previous_close || stock.current_price || 1;
          const changePercent = prevClose === 0 ? 0 : parseFloat((( (newPrice - prevClose) / prevClose) * 100).toFixed(2));
          const newVolume = Number(stock.volume || 0) + Math.floor(Math.random() * 1000);

          const update = {
            symbol: stock.symbol,
            price: newPrice,
            change: change,
            changePercent,
            volume: newVolume,
            timestamp: new Date().toISOString(),
          };

          // Update DB (only if listeners exist)
          await query(
            `UPDATE stocks SET current_price = $1, volume = $2, last_updated = CURRENT_TIMESTAMP WHERE symbol = $3`,
            [update.price, update.volume, symbol]
          );

          // Broadcast
          io.to(`stock:${symbol}`).emit('stock-update', update);
          io.to('ticker').emit('ticker-update', update);
        } catch (err) {
          console.error('Error simulating stock update:', err);
        }
      }
    }, INTERVAL);
  };

  if (process.env.NODE_ENV !== 'production') {
    simulateStockUpdates();
  }

  // Broadcast helpers
  const broadcastNewsUpdate = (news) => {
    io.emit('news-update', news);
  };

  const broadcastForumUpdate = (threadId, update) => {
    io.to(`forum:${threadId}`).emit('forum-update', update);
  };

  // Attach helpers to io for external use
  io.broadcastNewsUpdate = broadcastNewsUpdate;
  io.broadcastForumUpdate = broadcastForumUpdate;

  // Return anything if needed
  return { broadcastNewsUpdate, broadcastForumUpdate };
};
