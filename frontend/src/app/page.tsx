'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Star, 
  Clock, 
  BarChart3, 
  Newspaper,
  Users,
  Building2,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import LiveMessages from '@/components/LiveMessages';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface IPOData {
  id: string;
  name: string;
  issueType: string;
  openDate: string;
  closeDate: string;
  priceBand: string;
  issueSize: number;
  status: string;
  subscription: number;
}

interface NewsData {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  imageUrl: string;
}

export default function Home() {
  const [featuredStocks, setFeaturedStocks] = useState<StockData[]>([]);
  const [latestIPOs, setLatestIPOs] = useState<IPOData[]>([]);
  const [latestNews, setLatestNews] = useState<NewsData[]>([]);
  const [activeTab, setActiveTab] = useState('gainers');

  useEffect(() => {
    // Mock data for featured stocks
    const mockStocks: StockData[] = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35, volume: 52340000 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.52, change: -15.23, changePercent: -0.53, volume: 1234000 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 5.67, changePercent: 1.52, volume: 28940000 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3456.78, change: 12.45, changePercent: 0.36, volume: 4567000 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56, change: -3.21, changePercent: -1.35, volume: 89010000 },
      { symbol: 'META', name: 'Meta Platforms', price: 487.23, change: 8.90, changePercent: 1.86, volume: 23450000 },
    ];
    setFeaturedStocks(mockStocks);

    // Mock data for latest IPOs
    const mockIPOs: IPOData[] = [
      { id: '1', name: 'TechStart India', issueType: 'Main IPO', openDate: '2024-01-15', closeDate: '2024-01-17', priceBand: '₹215-₹225', issueSize: 1200000000, status: 'Open', subscription: 2.34 },
      { id: '2', name: 'Green Energy Ltd', issueType: 'SME IPO', openDate: '2024-01-18', closeDate: '2024-01-22', priceBand: '₹45-₹48', issueSize: 45000000, status: 'Upcoming', subscription: 0 },
      { id: '3', name: 'HealthCare Plus', issueType: 'Main IPO', openDate: '2024-01-10', closeDate: '2024-01-12', priceBand: '₹320-₹335', issueSize: 800000000, status: 'Closed', subscription: 4.56 },
      { id: '4', name: 'FinTech Solutions', issueType: 'SME IPO', openDate: '2024-01-08', closeDate: '2024-01-10', priceBand: '₹78-₹82', issueSize: 67000000, status: 'Listed', subscription: 3.21 },
    ];
    setLatestIPOs(mockIPOs);

    // Mock data for latest news
    const mockNews: NewsData[] = [
      { id: '1', title: 'Fed Signals Potential Rate Cuts in 2024', summary: 'Federal Reserve officials indicate possible interest rate reductions as inflation shows signs of cooling.', category: 'Economy', publishedAt: '2024-01-15T10:30:00Z', imageUrl: '/api/placeholder/400/200' },
      { id: '2', title: 'Tech Stocks Rally on AI Optimism', summary: 'Major technology companies see significant gains as AI adoption accelerates across industries.', category: 'Technology', publishedAt: '2024-01-15T09:15:00Z', imageUrl: '/api/placeholder/400/200' },
      { id: '3', title: 'IPO Market Shows Strong Recovery', summary: 'Initial public offerings gain momentum with successful listings and strong investor demand.', category: 'IPO', publishedAt: '2024-01-14T16:45:00Z', imageUrl: '/api/placeholder/400/200' },
      { id: '4', title: 'Green Energy Stocks Surge', summary: 'Renewable energy companies outperform market as climate initiatives drive investment.', category: 'Energy', publishedAt: '2024-01-14T14:20:00Z', imageUrl: '/api/placeholder/400/200' },
    ];
    setLatestNews(mockNews);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setFeaturedStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1,
        volume: stock.volume + Math.floor(Math.random() * 100000)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const gainers = featuredStocks.filter(stock => stock.change > 0).slice(0, 3);
  const losers = featuredStocks.filter(stock => stock.change < 0).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Real-time Market Data</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Gateway to
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                {" "}Smart Investing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Track real-time stock prices, analyze IPOs, and make informed investment decisions with comprehensive market insights.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Explore Markets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View IPOs
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        />
      </section>
<LiveMessages/>
      {/* Market Overview */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Overview</h2>
            <p className="text-lg text-muted-foreground">Real-time market trends and top performers</p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gainers" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Top Gainers</span>
              </TabsTrigger>
              <TabsTrigger value="losers" className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4" />
                <span>Top Losers</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gainers" className="mt-6">
              <div className="grid gap-4">
                {gainers.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{stock.symbol}</h3>
                              <p className="text-sm text-muted-foreground">{stock.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">${stock.price.toFixed(2)}</p>
                            <div className="flex items-center space-x-1 text-green-600">
                              <ArrowUpRight className="w-4 h-4" />
                              <span className="text-sm font-medium">+{stock.change.toFixed(2)} (+{stock.changePercent.toFixed(2)}%)</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="losers" className="mt-6">
              <div className="grid gap-4">
                {losers.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{stock.symbol}</h3>
                              <p className="text-sm text-muted-foreground">{stock.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">${stock.price.toFixed(2)}</p>
                            <div className="flex items-center space-x-1 text-red-600">
                              <ArrowDownRight className="w-4 h-4" />
                              <span className="text-sm font-medium">{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Latest IPOs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest IPOs</h2>
            <p className="text-lg text-muted-foreground">Discover new investment opportunities</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestIPOs.map((ipo, index) => (
              <motion.div
                key={ipo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={ipo.status === 'Open' ? 'default' : ipo.status === 'Upcoming' ? 'secondary' : 'outline'}>
                        {ipo.status}
                      </Badge>
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{ipo.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{ipo.issueType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price Band:</span>
                        <span className="font-medium">{ipo.priceBand}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Issue Size:</span>
                        <span className="font-medium">₹{(ipo.issueSize / 10000000).toFixed(0)}Cr</span>
                      </div>
                      {ipo.subscription > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subscription:</span>
                            <span className="font-medium">{ipo.subscription.toFixed(2)}x</span>
                          </div>
                          <Progress value={Math.min(ipo.subscription * 20, 100)} className="h-2" />
                        </div>
                      )}
                      <Button className="w-full mt-4" size="sm">
                        View Details
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h2>
            <p className="text-lg text-muted-foreground">Stay updated with market insights</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all hover:scale-105 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-blue-600" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{news.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{news.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{news.summary}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StockMarket Pro?</h2>
            <p className="text-lg text-muted-foreground">Everything you need for successful investing</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-time Data",
                description: "Live stock prices and market updates with WebSocket technology"
              },
              {
                icon: TrendingUp,
                title: "IPO Analysis",
                description: "Comprehensive IPO tracking with detailed analysis and subscription data"
              },
              {
                icon: Users,
                title: "Community Forum",
                description: "Connect with fellow investors and share insights"
              },
              {
                icon: Star,
                title: "Expert Reviews",
                description: "In-depth broker reviews and investment recommendations"
              },
              {
                icon: DollarSign,
                title: "Portfolio Tracking",
                description: "Monitor your investments and track performance"
              },
              {
                icon: MessageSquare,
                title: "Market News",
                description: "Latest financial news and market analysis"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
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