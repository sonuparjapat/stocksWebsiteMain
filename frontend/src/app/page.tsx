// app/(your-route)/page.tsx  OR src/app/page.tsx (client)
'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Star,
  BarChart3,
  Newspaper,
  Users,
  Building2,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import useStockSocket from '@/hooks/useStockSocket';
const LiveMessages = dynamic(() => import('@/components/LiveMessages'), { ssr: false });

// Types
type StockData = { symbol: string; name: string; price: number; change: number; changePercent: number; volume: number; };
type IPOData = { id: string; name: string; issueType: string; openDate: string; closeDate: string; priceBand: string; issueSize: number; status: string; subscription: number; };
type NewsData = { id: string; title: string; summary: string; category: string; publishedAt: string; imageUrl: string; };

// SWR fetcher (returns .data from our Next API)
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Network error');
  return res.json();
}).then(json => json.data);

export default function Home() {
  useStockSocket({ url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081' });
  const { data: stocks, error: stocksError } = useSWR<StockData[]>('/api/stocks', fetcher, { refreshInterval: 5000 });
  const { data: ipos, error: iposError } = useSWR<IPOData[]>('/api/ipos', fetcher, { refreshInterval: 60000 });
  const { data: news, error: newsError } = useSWR<NewsData[]>('/api/news', fetcher, { refreshInterval: 60000 });

  const featuredStocks = stocks ?? [];
  const latestIPOs = ipos ?? [];
  const latestNews = news ?? [];

  const gainers = useMemo(() => featuredStocks.filter(s => s.change > 0).slice(0, 3), [featuredStocks]);
  const losers = useMemo(() => featuredStocks.filter(s => s.change < 0).slice(0, 3), [featuredStocks]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatNumber = (val?: number) => (typeof val === 'number' ? new Intl.NumberFormat('en-IN').format(val) : '');
  const fmtDate = (iso?: string) => iso ? new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso)) : '';

  // Loading states
  const stocksLoading = !stocks && !stocksError;
  const iposLoading = !ipos && !iposError;
  const newsLoading = !news && !newsError;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Real-time Market Data</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Gateway to <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent"> Smart Investing</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Track real-time stock prices, analyze IPOs, and make informed investment decisions with comprehensive market insights.</p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Explore Markets <ArrowRight className="w-4 h-4 ml-2" /></Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">View IPOs <TrendingUp className="w-4 h-4 ml-2" /></Button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <motion.div animate={{ y: [20, -20, 20] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </section>

      <LiveMessages />

      {/* Market Overview */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Overview</h2>
            <p className="text-lg text-muted-foreground">Real-time market trends and top performers</p>
          </motion.div>

          <Tabs value={'gainers'} onValueChange={() => { }} className="max-w-4xl mx-auto">
            {/* NOTE: handle activeTab state if you want tabs controlled */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gainers" className="flex items-center space-x-2"><TrendingUp className="w-4 h-4" /><span>Top Gainers</span></TabsTrigger>
              <TabsTrigger value="losers" className="flex items-center space-x-2"><TrendingDown className="w-4 h-4" /><span>Top Losers</span></TabsTrigger>
            </TabsList>

            <TabsContent value="gainers" className="mt-6">
              <div className="grid gap-4">
                {stocksLoading ? (
                  // simple skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse h-20" />
                  ))
                ) : (
                  gainers.map((stock, idx) => (
                    <motion.div key={stock.symbol} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><BarChart3 className="w-5 h-5 text-green-600" /></div>
                              <div>
                                <h3 className="font-semibold">{stock.symbol}</h3>
                                <p className="text-sm text-muted-foreground">{stock.name}</p>
                                <p className="text-xs text-muted-foreground">Vol: {formatNumber(stock.volume)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{formatCurrency(stock.price)}</p>
                              <div className="flex items-center space-x-1 text-green-600 justify-end"><ArrowUpRight className="w-4 h-4" /><span className="text-sm font-medium">+{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="losers" className="mt-6">
              <div className="grid gap-4">
                {stocksLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (<div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse h-20" />))
                ) : (
                  losers.map((stock, idx) => (
                    <motion.div key={stock.symbol} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><BarChart3 className="w-5 h-5 text-red-600" /></div>
                              <div>
                                <h3 className="font-semibold">{stock.symbol}</h3>
                                <p className="text-sm text-muted-foreground">{stock.name}</p>
                                <p className="text-xs text-muted-foreground">Vol: {formatNumber(stock.volume)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{formatCurrency(stock.price)}</p>
                              <div className="flex items-center space-x-1 text-red-600 justify-end"><ArrowDownRight className="w-4 h-4" /><span className="text-sm font-medium">{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Latest IPOs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest IPOs</h2>
            <p className="text-lg text-muted-foreground">Discover new investment opportunities</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {iposLoading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse h-40" />)
            ) : (
              latestIPOs.map((ipo, index) => (
                <motion.div key={ipo.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={ipo.status === 'Open' ? 'default' : ipo.status === 'Upcoming' ? 'secondary' : 'outline'}>{ipo.status}</Badge>
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{ipo.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Type:</span><span className="font-medium">{ipo.issueType}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Price Band:</span><span className="font-medium">{ipo.priceBand}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Issue Size:</span><span className="font-medium">₹{(ipo.issueSize / 10000000).toFixed(0)}Cr</span></div>
                        {ipo.subscription > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subscription:</span><span className="font-medium">{ipo.subscription.toFixed(2)}x</span></div>
                            <Progress value={Math.min(ipo.subscription * 20, 100)} className="h-2" />
                          </div>
                        )}
                        <Button className="w-full mt-4" size="sm">View Details <ArrowRight className="w-3 h-3 ml-1" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h2>
            <p className="text-lg text-muted-foreground">Stay updated with market insights</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse h-56" />)
            ) : (
              latestNews.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Card className="hover:shadow-lg transition-all hover:scale-105 overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"><Newspaper className="w-12 h-12 text-blue-600" /></div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2"><Badge variant="secondary">{n.category}</Badge><span className="text-xs text-muted-foreground">{fmtDate(n.publishedAt)}</span></div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{n.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{n.summary}</p>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={(n as any).link} target="_blank" rel="noopener noreferrer">Read More <ArrowRight className="w-3 h-3 ml-1" /></a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StockMarket Pro?</h2>
            <p className="text-lg text-muted-foreground">Everything you need for successful investing</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: "Real-time Data", description: "Live stock prices and market updates with WebSocket technology" },
              { icon: TrendingUp, title: "IPO Analysis", description: "Comprehensive IPO tracking with detailed analysis and subscription data" },
              { icon: Users, title: "Community Forum", description: "Connect with fellow investors and share insights" },
              { icon: Star, title: "Expert Reviews", description: "In-depth broker reviews and investment recommendations" },
              { icon: DollarSign, title: "Portfolio Tracking", description: "Monitor your investments and track performance" },
              { icon: MessageSquare, title: "Market News", description: "Latest financial news and market analysis" }
            ].map((feature, idx) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4"><feature.icon className="w-6 h-6 text-white" /></div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}