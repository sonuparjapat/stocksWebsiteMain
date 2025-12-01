// app/api/news/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

const THIRD_PARTY_URL = process.env.THIRD_PARTY_NEWS_API || '';

const fallback = [
  { id: '1', title: 'Fed Signals Potential Rate Cuts in 2024', summary: 'Federal Reserve officials indicate possible interest rate reductions as inflation shows signs of cooling.', category: 'Economy', publishedAt: '2024-01-15T10:30:00Z', imageUrl: '/api/placeholder/400/200' },
  { id: '2', title: 'Tech Stocks Rally on AI Optimism', summary: 'Major technology companies see significant gains as AI adoption accelerates across industries.', category: 'Technology', publishedAt: '2024-01-15T09:15:00Z', imageUrl: '/api/placeholder/400/200' },
  { id: '3', title: 'IPO Market Shows Strong Recovery', summary: 'Initial public offerings gain momentum with successful listings and strong investor demand.', category: 'IPO', publishedAt: '2024-01-14T16:45:00Z', imageUrl: '/api/placeholder/400/200' },
  { id: '4', title: 'Green Energy Stocks Surge', summary: 'Renewable energy companies outperform market as climate initiatives drive investment.', category: 'Energy', publishedAt: '2024-01-14T14:20:00Z', imageUrl: '/api/placeholder/400/200' },
];

export async function GET() {
  if (THIRD_PARTY_URL) {
    try {
      const res = await axios.get(THIRD_PARTY_URL, { timeout: 6000 });
      return NextResponse.json({ data: res.data }, { status: 200 });
    } catch (err) {
      console.error('Third party news fetch failed:', err?.message || err);
    }
  }
  return NextResponse.json({ data: fallback }, { status: 200 });
}