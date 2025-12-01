// ws-server/server.js
// WebSocket server that broadcasts real stock ticks periodically.
// Run: node server.js

const WebSocket = require('ws');
const yahooFinance = require('yahoo-finance2').default; // Use require for CJS

const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8081;
const TICK_INTERVAL_MS = process.env.WS_TICK_MS ? Number(process.env.WS_TICK_MS) : 10000; // 10s default

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`[ws-server] listening on ws://localhost:${PORT}`);
});

// Seeded stocks (Indian Market)
let stocks = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 0, change: 0, changePercent: 0, volume: 0 },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 0, change: 0, changePercent: 0, volume: 0 },
  { symbol: 'INFY.NS', name: 'Infosys', price: 0, change: 0, changePercent: 0, volume: 0 },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 0, change: 0, changePercent: 0, volume: 0 },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 0, change: 0, changePercent: 0, volume: 0 },
];

async function updateStocks() {
  try {
    const symbols = stocks.map(s => s.symbol);
    // Fetch one by one or use Promise.all
    const quotes = await Promise.all(symbols.map(s => yahooFinance.quote(s).catch(e => null)));

    stocks = stocks.map((s, i) => {
      const q = quotes[i];
      if (!q) return s;
      return {
        ...s,
        price: q.regularMarketPrice,
        change: q.regularMarketChange,
        changePercent: q.regularMarketChangePercent,
        volume: q.regularMarketVolume
      };
    });

    broadcast({ type: 'stocks.tick', data: stocks });
  } catch (err) {
    console.error('Error updating stocks:', err);
  }
}

function broadcast(obj) {
  const raw = JSON.stringify(obj);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(raw);
    }
  });
}

wss.on('connection', ws => {
  console.log('[ws-server] client connected');
  // send initial snapshot
  ws.send(JSON.stringify({ type: 'stocks.snapshot', data: stocks }));

  ws.on('close', () => {
    console.log('[ws-server] client disconnected');
  });

  ws.on('error', (err) => {
    console.warn('[ws-server] client error', err?.message || err);
  });
});

// Tick loop
updateStocks(); // Initial fetch
setInterval(() => {
  updateStocks();
}, TICK_INTERVAL_MS);