// app/api/stocks/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const THIRD_PARTY_URL = process.env.THIRD_PARTY_STOCKS_API || ''; // optional

const fallback = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35, volume: 52340000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.52, change: -15.23, changePercent: -0.53, volume: 1234000 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 5.67, changePercent: 1.52, volume: 28940000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3456.78, change: 12.45, changePercent: 0.36, volume: 4567000 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56, change: -3.21, changePercent: -1.35, volume: 89010000 },
  { symbol: 'META', name: 'Meta Platforms', price: 487.23, change: 8.9, changePercent: 1.86, volume: 23450000 },
];

export async function GET() {
  // If you have a third-party provider URL (set in env), proxy it server-side
  if (THIRD_PARTY_URL) {
    try {
      const res = await axios.get(THIRD_PARTY_URL, { timeout: 5000 });
      // Expect provider to return array or { data: ... } — adapt as needed
      return NextResponse.json({ data: res.data }, { status: 200 });
    } catch (err) {
      // Log server-side (Vercel console / server logs)
      console.error('Third party stocks fetch failed:', err?.message || err);
      // fallback to seeded data below
    }
  }

  return NextResponse.json({ data: fallback }, { status: 200 });
}