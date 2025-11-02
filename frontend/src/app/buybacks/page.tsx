'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Filter, 
  Search,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Percent,
  Calculator,
  Info,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BuybackData {
  id: string;
  companyName: string;
  symbol: string;
  title: string;
  openDate: string;
  closeDate: string;
  recordDate: string;
  paymentDate: string;
  buybackPrice: number;
  buybackSize: number;
  buybackMethod: string;
  maxShares: number;
  currentMarketPrice: number;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Completed';
  description: string;
  buybackRatio: number;
  promoterStake: number;
  industry: string;
  website: string;
}

export default function BuybacksPage() {
  const [buybacks, setBuybacks] = useState<BuybackData[]>([]);
  const [filteredBuybacks, setFilteredBuybacks] = useState<BuybackData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock buyback data
    const mockBuybacks: BuybackData[] = [
      {
        id: '1',
        companyName: 'Reliance Industries Ltd',
        symbol: 'RELIANCE',
        title: 'Reliance Industries Buyback 2024',
        openDate: '2024-02-01',
        closeDate: '2024-02-15',
        recordDate: '2024-01-25',
        paymentDate: '2024-02-28',
        buybackPrice: 1250,
        buybackSize: 10000000000,
        buybackMethod: 'Tender Offer',
        maxShares: 8000000,
        currentMarketPrice: 1185,
        status: 'Open',
        description: 'Reliance Industries Limited has announced a buyback of equity shares worth ₹10,000 crore through the tender offer route.',
        buybackRatio: 15.2,
        promoterStake: 50.3,
        industry: 'Oil & Gas',
        website: 'https://www.ril.com'
      },
      {
        id: '2',
        companyName: 'Tata Consultancy Services Ltd',
        symbol: 'TCS',
        title: 'TCS Share Buyback Program',
        openDate: '2024-01-20',
        closeDate: '2024-02-03',
        recordDate: '2024-01-18',
        paymentDate: '2024-02-20',
        buybackPrice: 4150,
        buybackSize: 17000000000,
        buybackMethod: 'Open Market',
        maxShares: 4096385,
        currentMarketPrice: 3980,
        status: 'Open',
        description: 'Tata Consultancy Services has announced a buyback of equity shares worth ₹17,000 crore through the open market route.',
        buybackRatio: 12.8,
        promoterStake: 72.3,
        industry: 'Information Technology',
        website: 'https://www.tcs.com'
      },
      {
        id: '3',
        companyName: 'Infosys Ltd',
        symbol: 'INFY',
        title: 'Infosys Buyback Offer 2024',
        openDate: '2023-12-15',
        closeDate: '2023-12-29',
        recordDate: '2023-12-13',
        paymentDate: '2024-01-15',
        buybackPrice: 1850,
        buybackSize: 9200000000,
        buybackMethod: 'Tender Offer',
        maxShares: 4972972,
        currentMarketPrice: 1780,
        status: 'Closed',
        description: 'Infosys Limited has completed its buyback of equity shares worth ₹9,200 crore through the tender offer route.',
        buybackRatio: 10.5,
        promoterStake: 15.2,
        industry: 'Information Technology',
        website: 'https://www.infosys.com'
      },
      {
        id: '4',
        companyName: 'HDFC Bank Ltd',
        symbol: 'HDFCBANK',
        title: 'HDFC Bank Share Buyback',
        openDate: '2024-02-10',
        closeDate: '2024-02-24',
        recordDate: '2024-02-08',
        paymentDate: '2024-03-10',
        buybackPrice: 1650,
        buybackSize: 13000000000,
        buybackMethod: 'Tender Offer',
        maxShares: 7878787,
        currentMarketPrice: 1590,
        status: 'Upcoming',
        description: 'HDFC Bank Limited has announced a buyback of equity shares worth ₹13,000 crore through the tender offer route.',
        buybackRatio: 8.9,
        promoterStake: 26.4,
        industry: 'Banking',
        website: 'https://www.hdfcbank.com'
      },
      {
        id: '5',
        companyName: 'Wipro Ltd',
        symbol: 'WIPRO',
        title: 'Wipro Buyback of Shares',
        openDate: '2023-11-01',
        closeDate: '2023-11-15',
        recordDate: '2023-10-30',
        paymentDate: '2023-12-01',
        buybackPrice: 445,
        buybackSize: 12000000000,
        buybackMethod: 'Open Market',
        maxShares: 26966292,
        currentMarketPrice: 425,
        status: 'Completed',
        description: 'Wipro Limited has successfully completed its buyback of equity shares worth ₹12,000 crore through the open market route.',
        buybackRatio: 15.8,
        promoterStake: 73.4,
        industry: 'Information Technology',
        website: 'https://www.wipro.com'
      },
      {
        id: '6',
        companyName: 'Bharti Airtel Ltd',
        symbol: 'BHARTIARTL',
        title: 'Airtel Share Buyback 2024',
        openDate: '2024-03-01',
        closeDate: '2024-03-15',
        recordDate: '2024-02-28',
        paymentDate: '2024-04-01',
        buybackPrice: 950,
        buybackSize: 7500000000,
        buybackMethod: 'Tender Offer',
        maxShares: 7894736,
        currentMarketPrice: 910,
        status: 'Upcoming',
        description: 'Bharti Airtel Limited has announced a buyback of equity shares worth ₹7,500 crore through the tender offer route.',
        buybackRatio: 12.3,
        promoterStake: 56.8,
        industry: 'Telecom',
        website: 'https://www.airtel.com'
      }
    ];

    setBuybacks(mockBuybacks);
    setFilteredBuybacks(mockBuybacks);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = buybacks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(buyback => 
        buyback.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyback.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyback.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(buyback => buyback.status === statusFilter);
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(buyback => buyback.industry === industryFilter);
    }

    setFilteredBuybacks(filtered);
  }, [buybacks, searchTerm, statusFilter, industryFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Closed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Closed':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(0)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(0)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const calculatePremium = (buybackPrice: number, currentMarketPrice: number) => {
    return ((buybackPrice - currentMarketPrice) / currentMarketPrice * 100).toFixed(2);
  };

  const upcomingBuybacks = filteredBuybacks.filter(buyback => buyback.status === 'Upcoming');
  const openBuybacks = filteredBuybacks.filter(buyback => buyback.status === 'Open');
  const closedBuybacks = filteredBuybacks.filter(buyback => buyback.status === 'Closed');
  const completedBuybacks = filteredBuybacks.filter(buyback => buyback.status === 'Completed');

  const industries = Array.from(new Set(buybacks.map(buyback => buyback.industry)));

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Share Buybacks
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Track the latest share buyback programs from top companies and discover investment opportunities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{buybacks.length}</div>
              <div className="text-sm text-muted-foreground">Total Buybacks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{openBuybacks.length}</div>
              <div className="text-sm text-muted-foreground">Currently Open</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {formatCurrency(buybacks.reduce((sum, b) => sum + b.buybackSize, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {buybacks.length > 0 ? Math.round(buybacks.reduce((sum, b) => sum + parseFloat(calculatePremium(b.buybackPrice, b.currentMarketPrice)), 0) / buybacks.length) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Premium</div>
            </div>
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
                placeholder="Search buybacks by company, symbol, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Buybacks Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({filteredBuybacks.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBuybacks.length})
              </TabsTrigger>
              <TabsTrigger value="open">
                Open ({openBuybacks.length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed ({closedBuybacks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedBuybacks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6">
                {filteredBuybacks.map((buyback, index) => (
                  <motion.div
                    key={buyback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Left Section - Company Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{buyback.title}</h3>
                                <p className="text-muted-foreground mb-3">{buyback.companyName} ({buyback.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className={getStatusColor(buyback.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(buyback.status)}
                                      {buyback.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{buyback.industry}</Badge>
                                  <Badge variant="outline">{buyback.buybackMethod}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {buyback.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Buyback Price:</span>
                                <p className="font-medium">₹{buyback.buybackPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Buyback Size:</span>
                                <p className="font-medium">{formatCurrency(buyback.buybackSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{buyback.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Premium:</span>
                                <p className="font-medium text-green-600">
                                  +{calculatePremium(buyback.buybackPrice, buyback.currentMarketPrice)}%
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Dates and Actions */}
                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Important Dates
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Open:</span>
                                  <span className="font-medium">{formatDate(buyback.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(buyback.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(buyback.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(buyback.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{buyback.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Promoter Stake: {buyback.promoterStake}%
                                </span>
                              </div>
                            </div>

                            <Button className="w-full">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="grid gap-6">
                {upcomingBuybacks.map((buyback, index) => (
                  <motion.div
                    key={buyback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{buyback.title}</h3>
                                <p className="text-muted-foreground mb-3">{buyback.companyName} ({buyback.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {buyback.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{buyback.industry}</Badge>
                                  <Badge variant="outline">{buyback.buybackMethod}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {buyback.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Buyback Price:</span>
                                <p className="font-medium">₹{buyback.buybackPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Buyback Size:</span>
                                <p className="font-medium">{formatCurrency(buyback.buybackSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{buyback.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Premium:</span>
                                <p className="font-medium text-green-600">
                                  +{calculatePremium(buyback.buybackPrice, buyback.currentMarketPrice)}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Important Dates
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Open:</span>
                                  <span className="font-medium">{formatDate(buyback.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(buyback.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(buyback.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(buyback.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{buyback.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Promoter Stake: {buyback.promoterStake}%
                                </span>
                              </div>
                            </div>

                            <Button className="w-full">
                              Set Reminder
                              <Clock className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="open">
              <div className="grid gap-6">
                {openBuybacks.map((buyback, index) => (
                  <motion.div
                    key={buyback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{buyback.title}</h3>
                                <p className="text-muted-foreground mb-3">{buyback.companyName} ({buyback.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {buyback.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{buyback.industry}</Badge>
                                  <Badge variant="outline">{buyback.buybackMethod}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {buyback.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Buyback Price:</span>
                                <p className="font-medium">₹{buyback.buybackPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Buyback Size:</span>
                                <p className="font-medium">{formatCurrency(buyback.buybackSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{buyback.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Premium:</span>
                                <p className="font-medium text-green-600">
                                  +{calculatePremium(buyback.buybackPrice, buyback.currentMarketPrice)}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Important Dates
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Open:</span>
                                  <span className="font-medium">{formatDate(buyback.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(buyback.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(buyback.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(buyback.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{buyback.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Promoter Stake: {buyback.promoterStake}%
                                </span>
                              </div>
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Participate Now
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="closed">
              <div className="grid gap-6">
                {closedBuybacks.map((buyback, index) => (
                  <motion.div
                    key={buyback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{buyback.title}</h3>
                                <p className="text-muted-foreground mb-3">{buyback.companyName} ({buyback.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                    <div className="flex items-center gap-1">
                                      <XCircle className="w-4 h-4" />
                                      {buyback.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{buyback.industry}</Badge>
                                  <Badge variant="outline">{buyback.buybackMethod}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {buyback.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Buyback Price:</span>
                                <p className="font-medium">₹{buyback.buybackPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Buyback Size:</span>
                                <p className="font-medium">{formatCurrency(buyback.buybackSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{buyback.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Premium:</span>
                                <p className="font-medium text-green-600">
                                  +{calculatePremium(buyback.buybackPrice, buyback.currentMarketPrice)}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Important Dates
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Open:</span>
                                  <span className="font-medium">{formatDate(buyback.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(buyback.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(buyback.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(buyback.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{buyback.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Promoter Stake: {buyback.promoterStake}%
                                </span>
                              </div>
                            </div>

                            <Button className="w-full">
                              View Allotment Status
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid gap-6">
                {completedBuybacks.map((buyback, index) => (
                  <motion.div
                    key={buyback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{buyback.title}</h3>
                                <p className="text-muted-foreground mb-3">{buyback.companyName} ({buyback.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      {buyback.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{buyback.industry}</Badge>
                                  <Badge variant="outline">{buyback.buybackMethod}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {buyback.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Buyback Price:</span>
                                <p className="font-medium">₹{buyback.buybackPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Buyback Size:</span>
                                <p className="font-medium">{formatCurrency(buyback.buybackSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{buyback.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Premium:</span>
                                <p className="font-medium text-green-600">
                                  +{calculatePremium(buyback.buybackPrice, buyback.currentMarketPrice)}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Important Dates
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Open:</span>
                                  <span className="font-medium">{formatDate(buyback.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(buyback.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(buyback.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(buyback.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-green-800 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-medium">Successfully Completed</span>
                              </div>
                              <p className="text-green-700 text-sm">
                                Buyback completed successfully with {buyback.buybackRatio}% acceptance ratio
                              </p>
                            </div>

                            <Button className="w-full">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
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
    </div>
  );
}