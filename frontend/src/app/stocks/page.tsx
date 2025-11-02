'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Star,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
  avgVolume: number;
  sector: string;
  industry: string;
  exchange: string;
  lastUpdated: string;
  isWatchlisted: boolean;
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [exchangeFilter, setExchangeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gainers');

  useEffect(() => {
    // Mock stocks data
    const mockStocks: StockData[] = [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        price: 2847.52,
        change: -15.23,
        changePercent: -0.53,
        volume: 1234000,
        marketCap: 1900000000000,
        peRatio: 28.5,
        eps: 99.91,
        dividendYield: 0.85,
        week52High: 2987.45,
        week52Low: 2187.32,
        avgVolume: 2100000,
        sector: 'Energy',
        industry: 'Oil & Gas',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: true
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd',
        price: 4156.78,
        change: 45.67,
        changePercent: 1.11,
        volume: 890000,
        marketCap: 1500000000000,
        peRatio: 32.1,
        eps: 129.52,
        dividendYield: 1.45,
        week52High: 4356.78,
        week52Low: 3456.23,
        avgVolume: 1200000,
        sector: 'Information Technology',
        industry: 'Software Services',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        price: 1654.32,
        change: 12.45,
        changePercent: 0.76,
        volume: 2345000,
        marketCap: 1100000000000,
        peRatio: 21.3,
        eps: 77.65,
        dividendYield: 1.23,
        week52High: 1789.45,
        week52Low: 1456.78,
        avgVolume: 2800000,
        sector: 'Financials',
        industry: 'Banking',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: true
      },
      {
        symbol: 'INFY',
        name: 'Infosys Ltd',
        price: 1789.45,
        change: -8.90,
        changePercent: -0.50,
        volume: 1567000,
        marketCap: 750000000000,
        peRatio: 28.9,
        eps: 61.91,
        dividendYield: 2.10,
        week52High: 1987.65,
        week52Low: 1456.32,
        avgVolume: 1800000,
        sector: 'Information Technology',
        industry: 'Software Services',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      },
      {
        symbol: 'BHARTIARTL',
        name: 'Bharti Airtel Ltd',
        price: 910.23,
        change: 15.67,
        changePercent: 1.75,
        volume: 3456000,
        marketCap: 520000000000,
        peRatio: 45.2,
        eps: 20.14,
        dividendYield: 0.45,
        week52High: 987.65,
        week52Low: 765.43,
        avgVolume: 2800000,
        sector: 'Telecommunication',
        industry: 'Telecom Services',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      },
      {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Ltd',
        price: 987.65,
        change: 5.43,
        changePercent: 0.55,
        volume: 4567000,
        marketCap: 680000000000,
        peRatio: 19.8,
        eps: 49.88,
        dividendYield: 1.67,
        week52High: 1123.45,
        week52Low: 876.54,
        avgVolume: 4200000,
        sector: 'Financials',
        industry: 'Banking',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: true
      },
      {
        symbol: 'KOTAKBANK',
        name: 'Kotak Mahindra Bank Ltd',
        price: 1876.54,
        change: -12.34,
        changePercent: -0.65,
        volume: 890000,
        marketCap: 380000000000,
        peRatio: 24.5,
        eps: 76.59,
        dividendYield: 0.98,
        week52High: 2098.76,
        week52Low: 1654.32,
        avgVolume: 1200000,
        sector: 'Financials',
        industry: 'Banking',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      },
      {
        symbol: 'WIPRO',
        name: 'Wipro Ltd',
        price: 445.67,
        change: 3.21,
        changePercent: 0.73,
        volume: 2345000,
        marketCap: 270000000000,
        peRatio: 22.1,
        eps: 20.17,
        dividendYield: 0.87,
        week52High: 498.76,
        week52Low: 387.65,
        avgVolume: 2100000,
        sector: 'Information Technology',
        industry: 'Software Services',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      },
      {
        symbol: 'AXISBANK',
        name: 'Axis Bank Ltd',
        price: 1123.45,
        change: 8.90,
        changePercent: 0.80,
        volume: 3456000,
        marketCap: 320000000000,
        peRatio: 18.7,
        eps: 60.08,
        dividendYield: 1.34,
        week52High: 1234.56,
        week52Low: 876.54,
        avgVolume: 2800000,
        sector: 'Financials',
        industry: 'Banking',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      },
      {
        symbol: 'SBIN',
        name: 'State Bank of India',
        price: 765.43,
        change: -5.67,
        changePercent: -0.74,
        volume: 5678000,
        marketCap: 680000000000,
        peRatio: 12.3,
        eps: 62.23,
        dividendYield: 2.45,
        week52High: 876.54,
        week52Low: 543.21,
        avgVolume: 5200000,
        sector: 'Financials',
        industry: 'Banking',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: true
      },
      {
        symbol: 'SUNPHARMA',
        name: 'Sun Pharmaceutical Industries Ltd',
        price: 1456.78,
        change: 23.45,
        changePercent: 1.64,
        volume: 1234000,
        marketCap: 420000000000,
        peRatio: 35.6,
        eps: 40.92,
        dividendYield: 1.12,
        week52High: 1598.76,
        week52Low: 1234.56,
        avgVolume: 1500000,
        sector: 'Healthcare',
        industry: 'Pharmaceuticals',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      },
      {
        symbol: 'MARUTI',
        name: 'Maruti Suzuki India Ltd',
        price: 12345.67,
        change: -45.67,
        changePercent: -0.37,
        volume: 890000,
        marketCap: 380000000000,
        peRatio: 28.9,
        eps: 427.12,
        dividendYield: 0.98,
        week52High: 13456.78,
        week52Low: 9876.54,
        avgVolume: 1200000,
        sector: 'Consumer Discretionary',
        industry: 'Automobile',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString(),
        isWatchlisted: false
      }
    ];

    setStocks(mockStocks);
    setFilteredStocks(mockStocks);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 10,
        change: stock.change + (Math.random() - 0.5) * 5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5,
        volume: stock.volume + Math.floor(Math.random() * 10000),
        lastUpdated: new Date().toISOString()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = stocks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sector filter
    if (sectorFilter !== 'all') {
      filtered = filtered.filter(stock => stock.sector === sectorFilter);
    }

    // Exchange filter
    if (exchangeFilter !== 'all') {
      filtered = filtered.filter(stock => stock.exchange === exchangeFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        case 'marketCap':
        default:
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredStocks(filtered);
  }, [stocks, searchTerm, sectorFilter, exchangeFilter, sortBy, sortOrder]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000000) {
      return `₹${(amount / 10000000000).toFixed(1)}L Cr`;
    } else if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(0)}K Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(0)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const toggleWatchlist = (symbol: string) => {
    setStocks(prev => prev.map(stock => 
      stock.symbol === symbol 
        ? { ...stock, isWatchlisted: !stock.isWatchlisted }
        : stock
    ));
  };

  const gainers = stocks.filter(stock => stock.change > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = stocks.filter(stock => stock.change < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = stocks.sort((a, b) => b.volume - a.volume).slice(0, 5);

  const sectors = Array.from(new Set(stocks.map(stock => stock.sector)));
  const exchanges = Array.from(new Set(stocks.map(stock => stock.exchange)));

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stock Market
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Track real-time stock prices, analyze market trends, and make informed investment decisions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Gainers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gainers.map((stock, index) => (
                    <div key={stock.symbol} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                        <div className="text-sm text-green-600">+{stock.changePercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="w-5 h-5" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {losers.map((stock, index) => (
                    <div key={stock.symbol} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                        <div className="text-sm text-red-600">{stock.changePercent.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Active */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Activity className="w-5 h-5" />
                  Most Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mostActive.map((stock, index) => (
                    <div key={stock.symbol} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(stock.volume)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search stocks by symbol, name, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={exchangeFilter} onValueChange={setExchangeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exchanges</SelectItem>
                  {exchanges.map(exchange => (
                    <SelectItem key={exchange} value={exchange}>{exchange}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="change">Change %</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stocks List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 font-medium">Symbol</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium text-right">Price</th>
                    <th className="p-4 font-medium text-right">Change</th>
                    <th className="p-4 font-medium text-right">Volume</th>
                    <th className="p-4 font-medium text-right">Market Cap</th>
                    <th className="p-4 font-medium text-right">P/E Ratio</th>
                    <th className="p-4 font-medium text-right">Div Yield</th>
                    <th className="p-4 font-medium">Sector</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => (
                    <motion.tr
                      key={stock.symbol}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.exchange}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-sm text-muted-foreground">{stock.industry}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </div>
                        <div className={`text-sm ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">{formatNumber(stock.volume)}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">{formatCurrency(stock.marketCap)}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">{stock.peRatio.toFixed(2)}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">{stock.dividendYield.toFixed(2)}%</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{stock.sector}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleWatchlist(stock.symbol)}
                            className={stock.isWatchlisted ? 'text-yellow-500' : ''}
                          >
                            <Star className={`w-4 h-4 ${stock.isWatchlisted ? 'fill-current' : ''}`} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredStocks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No stocks found matching your criteria.</div>
            </div>
          )}
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-8 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stocks.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {gainers.length}
              </div>
              <div className="text-sm text-muted-foreground">Gainers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {losers.length}
              </div>
              <div className="text-sm text-muted-foreground">Losers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {formatCurrency(stocks.reduce((sum, stock) => sum + stock.marketCap, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Market Cap</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}