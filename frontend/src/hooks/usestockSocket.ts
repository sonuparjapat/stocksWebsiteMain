// src/hooks/useStockSocket.ts
import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

type WSMessage = { type: string; data: any };

export default function useStockSocket({ url = (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081') } = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    let mounted = true;

    function connect() {
      if (!mounted) return;
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('[WS] connected to', url);
          reconnectAttemptRef.current = 0;
        };

        ws.onmessage = (event) => {
          try {
            const msg: WSMessage = JSON.parse(event.data);
            if (!msg || !msg.type) return;

            // For full-array ticks, update SWR key '/api/stocks'
            if (msg.type === 'stocks.snapshot' || msg.type === 'stocks.tick') {
              // Replace SWR cache for '/api/stocks' with incoming array
              mutate('/api/stocks', msg.data, false); // false -> do not revalidate
            }

            // If you later use delta updates, handle them here
          } catch (err) {
            console.error('[WS] parse error', err);
          }
        };

        ws.onclose = () => {
          console.log('[WS] closed');
          if (shouldReconnectRef.current) scheduleReconnect();
        };

        ws.onerror = (err) => {
          console.warn('[WS] error', err);
          // close and attempt reconnect
          try { ws.close(); } catch (e) {}
        };
      } catch (e) {
        scheduleReconnect();
      }
    }

    function scheduleReconnect() {
      reconnectAttemptRef.current = Math.min(30, (reconnectAttemptRef.current || 0) + 1);
      const delay = 500 * reconnectAttemptRef.current; // 500ms, 1000ms, 1500ms...
      console.log(`[WS] reconnecting in ${delay}ms`);
      setTimeout(() => connect(), delay);
    }

    connect();

    return () => {
      mounted = false;
      shouldReconnectRef.current = false;
      try { wsRef.current?.close(); } catch (e) {}
      wsRef.current = null;
    };
  }, [url]);
}
