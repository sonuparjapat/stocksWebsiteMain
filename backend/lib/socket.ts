import { Server } from 'socket.io';
import { db } from '../lib/db';

interface StockUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface ForumMessage {
  threadId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

interface NewsUpdate {
  id: string;
  title: string;
  category: string;
  timestamp: string;
}

export const setupSocket = (io: Server) => {
  // Store connected clients and their subscriptions
  const clients = new Map<string, Set<string>>();
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Initialize client subscriptions
    clients.set(socket.id, new Set());

    // Stock price subscriptions
    socket.on('subscribe-stock', (symbol: string) => {
      const subscriptions = clients.get(socket.id);
      if (subscriptions) {
        subscriptions.add(`stock:${symbol}`);
        socket.join(`stock:${symbol}`);
        console.log(`Client ${socket.id} subscribed to stock: ${symbol}`);
      }
    });

    socket.on('unsubscribe-stock', (symbol: string) => {
      const subscriptions = clients.get(socket.id);
      if (subscriptions) {
        subscriptions.delete(`stock:${symbol}`);
        socket.leave(`stock:${symbol}`);
        console.log(`Client ${socket.id} unsubscribed from stock: ${symbol}`);
      }
    });

    // Forum thread subscriptions
    socket.on('subscribe-forum', (threadId: string) => {
      const subscriptions = clients.get(socket.id);
      if (subscriptions) {
        subscriptions.add(`forum:${threadId}`);
        socket.join(`forum:${threadId}`);
        console.log(`Client ${socket.id} subscribed to forum: ${threadId}`);
      }
    });

    socket.on('unsubscribe-forum', (threadId: string) => {
      const subscriptions = clients.get(socket.id);
      if (subscriptions) {
        subscriptions.delete(`forum:${threadId}`);
        socket.leave(`forum:${threadId}`);
        console.log(`Client ${socket.id} unsubscribed from forum: ${threadId}`);
      }
    });

    // Live ticker subscription
    socket.on('subscribe-ticker', () => {
      const subscriptions = clients.get(socket.id);
      if (subscriptions) {
        subscriptions.add('ticker');
        socket.join('ticker');
        console.log(`Client ${socket.id} subscribed to live ticker`);
      }
    });

    socket.on('unsubscribe-ticker', () => {
      const subscriptions = clients.get(socket.id);
      if (subscriptions) {
        subscriptions.delete('ticker');
        socket.leave('ticker');
        console.log(`Client ${socket.id} unsubscribed from live ticker`);
      }
    });

    // Forum message handling
    socket.on('forum-message', async (data: ForumMessage) => {
      try {
        // Save message to database
        const reply = await db.create('forum_replies', {
          thread_id: data.threadId,
          user_id: data.userId,
          content: data.content,
          parent_reply_id: null
        });

        // Update thread reply count and last reply time
        await db.query(
          `UPDATE forum_threads 
           SET reply_count = reply_count + 1, 
               last_reply_at = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [data.threadId]
        );

        // Broadcast to all clients subscribed to this thread
        io.to(`forum:${data.threadId}`).emit('forum-reply', {
          ...reply,
          username: data.username,
          timestamp: new Date().toISOString()
        });

        console.log(`Forum message posted in thread ${data.threadId}`);
      } catch (error) {
        console.error('Error saving forum message:', error);
        socket.emit('error', { message: 'Failed to post message' });
      }
    });

    // Stock price updates (simulated - in real app, this would come from external API)
    socket.on('request-stock-update', async (symbol: string) => {
      try {
        const stock = await db.getStockBySymbol(symbol);
        if (stock) {
          const update: StockUpdate = {
            symbol: stock.symbol,
            price: stock.current_price,
            change: stock.current_price - stock.previous_close,
            changePercent: ((stock.current_price - stock.previous_close) / stock.previous_close) * 100,
            volume: stock.volume,
            timestamp: new Date().toISOString()
          };
          socket.emit('stock-update', update);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        socket.emit('error', { message: 'Failed to fetch stock data' });
      }
    });

    // Get latest news
    socket.on('request-latest-news', async () => {
      try {
        const news = await db.getNewsArticles({ limit: 5 });
        socket.emit('latest-news', news);
      } catch (error) {
        console.error('Error fetching news:', error);
        socket.emit('error', { message: 'Failed to fetch news' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clients.delete(socket.id);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to Stock Market WebSocket',
      timestamp: new Date().toISOString()
    });
  });

  // Simulate real-time stock updates (in production, this would come from external APIs)
  const simulateStockUpdates = () => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    
    setInterval(async () => {
      for (const symbol of symbols) {
        try {
          const stock = await db.getStockBySymbol(symbol);
          if (stock) {
            // Simulate small price changes
            const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
            const newPrice = stock.current_price + change;
            
            const update: StockUpdate = {
              symbol: stock.symbol,
              price: parseFloat(newPrice.toFixed(2)),
              change: parseFloat(change.toFixed(2)),
              changePercent: parseFloat(((change / stock.current_price) * 100).toFixed(2)),
              volume: stock.volume + Math.floor(Math.random() * 1000),
              timestamp: new Date().toISOString()
            };

            // Update database
            await db.query(
              `UPDATE stocks 
               SET current_price = $1, 
                   volume = $2,
                   last_updated = CURRENT_TIMESTAMP
               WHERE symbol = $3`,
              [update.price, update.volume, symbol]
            );

            // Broadcast to subscribed clients
            io.to(`stock:${symbol}`).emit('stock-update', update);
            io.to('ticker').emit('ticker-update', update);
          }
        } catch (error) {
          console.error('Error simulating stock update:', error);
        }
      }
    }, 5000); // Update every 5 seconds
  };

  // Start simulation
  simulateStockUpdates();

  // Function to broadcast news updates
  const broadcastNewsUpdate = (news: NewsUpdate) => {
    io.emit('news-update', news);
  };

  // Function to broadcast forum updates
  const broadcastForumUpdate = (threadId: string, update: any) => {
    io.to(`forum:${threadId}`).emit('forum-update', update);
  };

  // Export broadcast functions for external use
  (io as any).broadcastNewsUpdate = broadcastNewsUpdate;
  (io as any).broadcastForumUpdate = broadcastForumUpdate;
};