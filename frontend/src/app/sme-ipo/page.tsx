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
  Star,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SMEIPOData {
  id: string;
  name: string;
  companyName: string;
  openDate: string;
  closeDate: string;
  listingDate: string;
  priceBand: string;
  issuePrice: number;
  lotSize: number;
  issueSize: number;
  faceValue: number;
  subscriptionRetail: number;
  subscriptionNii: number;
  subscriptionTotal: number;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Listed';
  registrarName: string;
  leadManagers: string[];
  description: string;
  listingGains?: number;
  industry: string;
  smePlatform: 'BSE SME' | 'NSE SME' | 'NSE Emerge';
  isin: string;
}

export default function SMEIPOPage() {
  const [ipos, setIpos] = useState<SMEIPOData[]>([]);
  const [filteredIpos, setFilteredIpos] = useState<SMEIPOData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock SME IPO data
    const mockIpos: SMEIPOData[] = [
      {
        id: '1',
        name: 'Green Energy Ltd IPO',
        companyName: 'Green Energy Limited',
        openDate: '2024-01-18',
        closeDate: '2024-01-22',
        listingDate: '2024-01-30',
        priceBand: '₹45-₹48',
        issuePrice: 47,
        lotSize: 3000,
        issueSize: 45000000,
        faceValue: 10,
        subscriptionRetail: 0,
        subscriptionNii: 0,
        subscriptionTotal: 0,
        status: 'Upcoming',
        registrarName: 'Bigshare Services Pvt Ltd',
        leadManagers: ['Beeline Capital Advisors'],
        description: 'Renewable energy company focused on solar and wind power projects for industrial clients.',
        industry: 'Renewable Energy',
        smePlatform: 'BSE SME',
        isin: 'INE456J01010'
      },
      {
        id: '2',
        name: 'FinTech Solutions IPO',
        companyName: 'FinTech Solutions Limited',
        openDate: '2024-01-08',
        closeDate: '2024-01-10',
        listingDate: '2024-01-18',
        priceBand: '₹78-₹82',
        issuePrice: 80,
        lotSize: 1600,
        issueSize: 67000000,
        faceValue: 10,
        subscriptionRetail: 3.21,
        subscriptionNii: 5.43,
        subscriptionTotal: 4.32,
        status: 'Listed',
        registrarName: 'Skyline Financial Services Pvt Ltd',
        leadManagers: ['Swastika Investmart Ltd'],
        description: 'Digital payment solutions provider for small and medium businesses.',
        industry: 'FinTech',
        smePlatform: 'NSE SME',
        isin: 'INE789K02020'
      },
      {
        id: '3',
        name: 'MediCare Devices IPO',
        companyName: 'MediCare Devices Limited',
        openDate: '2024-01-25',
        closeDate: '2024-01-30',
        listingDate: '2024-02-08',
        priceBand: '₹52-₹55',
        issuePrice: 54,
        lotSize: 2000,
        issueSize: 32000000,
        faceValue: 10,
        subscriptionRetail: 1.85,
        subscriptionNii: 2.95,
        subscriptionTotal: 2.40,
        status: 'Open',
        registrarName: 'Link Intime India Pvt Ltd',
        leadManagers: ['Arihant Capital Markets'],
        description: 'Manufacturer of medical devices and healthcare equipment for hospitals and clinics.',
        industry: 'Healthcare',
        smePlatform: 'BSE SME',
        isin: 'INE321L03030'
      },
      {
        id: '4',
        name: 'EduTech Platforms IPO',
        companyName: 'EduTech Platforms Limited',
        openDate: '2024-01-12',
        closeDate: '2024-01-16',
        listingDate: '2024-01-24',
        priceBand: '₹35-₹38',
        issuePrice: 37,
        lotSize: 4000,
        issueSize: 52000000,
        faceValue: 10,
        subscriptionRetail: 4.56,
        subscriptionNii: 6.78,
        subscriptionTotal: 5.67,
        status: 'Closed',
        registrarName: 'KFIN Technologies Pvt Ltd',
        leadManagers: ['Marwadi Financial Services'],
        description: 'Online education platform offering skill development courses for professionals.',
        industry: 'Education Technology',
        smePlatform: 'NSE Emerge',
        isin: 'INE654M04040'
      },
      {
        id: '5',
        name: 'LogiSmart Solutions IPO',
        companyName: 'LogiSmart Solutions Limited',
        openDate: '2024-02-01',
        closeDate: '2024-02-05',
        listingDate: '2024-02-15',
        priceBand: '₹42-₹45',
        issuePrice: 44,
        lotSize: 3000,
        issueSize: 48000000,
        faceValue: 10,
        subscriptionRetail: 0,
        subscriptionNii: 0,
        subscriptionTotal: 0,
        status: 'Upcoming',
        registrarName: 'Intime Spectrum Registry Pvt Ltd',
        leadManagers: ['Gujarat Leasing & Financial Services'],
        description: 'Logistics and supply chain management solutions provider for e-commerce companies.',
        industry: 'Logistics',
        smePlatform: 'BSE SME',
        isin: 'INE987N05050'
      },
      {
        id: '6',
        name: 'AgriTech Innovations IPO',
        companyName: 'AgriTech Innovations Limited',
        openDate: '2024-01-20',
        closeDate: '2024-01-24',
        listingDate: '2024-02-01',
        priceBand: '₹28-₹30',
        issuePrice: 29,
        lotSize: 4000,
        issueSize: 35000000,
        faceValue: 10,
        subscriptionRetail: 2.89,
        subscriptionNii: 4.12,
        subscriptionTotal: 3.51,
        status: 'Listed',
        registrarName: 'Cameo Corporate Services Ltd',
        leadManagers: ['Vikas Corporate Services Ltd'],
        description: 'Agricultural technology company providing smart farming solutions to farmers.',
        industry: 'Agriculture Technology',
        smePlatform: 'NSE SME',
        isin: 'INE147P06060'
      }
    ];

    setIpos(mockIpos);
    setFilteredIpos(mockIpos);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = ipos;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ipo => 
        ipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ipo.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ipo.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ipo => ipo.status === statusFilter);
    }

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(ipo => ipo.smePlatform === platformFilter);
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(ipo => ipo.industry === industryFilter);
    }

    setFilteredIpos(filtered);
  }, [ipos, searchTerm, statusFilter, platformFilter, industryFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Closed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Listed':
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
      case 'Listed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'BSE SME':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'NSE SME':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'NSE Emerge':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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

  const upcomingIpos = filteredIpos.filter(ipo => ipo.status === 'Upcoming');
  const openIpos = filteredIpos.filter(ipo => ipo.status === 'Open');
  const closedIpos = filteredIpos.filter(ipo => ipo.status === 'Closed');
  const listedIpos = filteredIpos.filter(ipo => ipo.status === 'Listed');

  const industries = Array.from(new Set(ipos.map(ipo => ipo.industry)));
  const platforms = Array.from(new Set(ipos.map(ipo => ipo.smePlatform)));

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold">
                SME IPOs
              </h1>
            </div>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Discover investment opportunities in Small and Medium Enterprise IPOs across BSE SME, NSE SME, and NSE Emerge platforms
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{ipos.length}</div>
              <div className="text-sm text-muted-foreground">Total SME IPOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{openIpos.length}</div>
              <div className="text-sm text-muted-foreground">Currently Open</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{listedIpos.length}</div>
              <div className="text-sm text-muted-foreground">Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {listedIpos.length > 0 ? Math.round(listedIpos.reduce((sum, ipo) => sum + (ipo.listingGains || 0), 0) / listedIpos.length) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Listing Gains</div>
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
                placeholder="Search SME IPOs by name, company, or industry..."
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
                  <SelectItem value="Listed">Listed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
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

      {/* SME IPOs Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({filteredIpos.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingIpos.length})
              </TabsTrigger>
              <TabsTrigger value="open">
                Open ({openIpos.length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed ({closedIpos.length})
              </TabsTrigger>
              <TabsTrigger value="listed">
                Listed ({listedIpos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6">
                {filteredIpos.map((ipo, index) => (
                  <motion.div
                    key={ipo.id}
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
                                <h3 className="text-xl font-semibold mb-2">{ipo.name}</h3>
                                <p className="text-muted-foreground mb-3">{ipo.companyName}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className={getStatusColor(ipo.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(ipo.status)}
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge className={getPlatformColor(ipo.smePlatform)}>
                                    <Target className="w-3 h-3 mr-1" />
                                    {ipo.smePlatform}
                                  </Badge>
                                  <Badge variant="outline">{ipo.industry}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {ipo.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price Band:</span>
                                <p className="font-medium">{ipo.priceBand}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(ipo.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lot Size:</span>
                                <p className="font-medium">{ipo.lotSize} shares</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Min Investment:</span>
                                <p className="font-medium">₹{(ipo.issuePrice * ipo.lotSize).toLocaleString()}</p>
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
                                  <span className="font-medium">{formatDate(ipo.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(ipo.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Listing:</span>
                                  <span className="font-medium">{formatDate(ipo.listingDate)}</span>
                                </div>
                              </div>
                            </div>

                            {ipo.status === 'Open' && ipo.subscriptionTotal > 0 && (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">Subscription</span>
                                  <span className="text-sm font-bold">{ipo.subscriptionTotal.toFixed(2)}x</span>
                                </div>
                                <Progress value={Math.min(ipo.subscriptionTotal * 20, 100)} className="h-2" />
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                  <div>RII: {ipo.subscriptionRetail.toFixed(2)}x</div>
                                  <div>NII: {ipo.subscriptionNii.toFixed(2)}x</div>
                                </div>
                              </div>
                            )}

                            {ipo.status === 'Listed' && ipo.listingGains && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-green-800">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="font-medium">Listing Gains</span>
                                </div>
                                <p className="text-green-700 font-bold text-lg">+{ipo.listingGains}%</p>
                              </div>
                            )}

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
                {upcomingIpos.map((ipo, index) => (
                  <motion.div
                    key={ipo.id}
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
                                <h3 className="text-xl font-semibold mb-2">{ipo.name}</h3>
                                <p className="text-muted-foreground mb-3">{ipo.companyName}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge className={getPlatformColor(ipo.smePlatform)}>
                                    <Target className="w-3 h-3 mr-1" />
                                    {ipo.smePlatform}
                                  </Badge>
                                  <Badge variant="outline">{ipo.industry}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {ipo.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price Band:</span>
                                <p className="font-medium">{ipo.priceBand}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(ipo.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lot Size:</span>
                                <p className="font-medium">{ipo.lotSize} shares</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Min Investment:</span>
                                <p className="font-medium">₹{(ipo.issuePrice * ipo.lotSize).toLocaleString()}</p>
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
                                  <span className="font-medium">{formatDate(ipo.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(ipo.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Listing:</span>
                                  <span className="font-medium">{formatDate(ipo.listingDate)}</span>
                                </div>
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
                {openIpos.map((ipo, index) => (
                  <motion.div
                    key={ipo.id}
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
                                <h3 className="text-xl font-semibold mb-2">{ipo.name}</h3>
                                <p className="text-muted-foreground mb-3">{ipo.companyName}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge className={getPlatformColor(ipo.smePlatform)}>
                                    <Target className="w-3 h-3 mr-1" />
                                    {ipo.smePlatform}
                                  </Badge>
                                  <Badge variant="outline">{ipo.industry}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {ipo.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price Band:</span>
                                <p className="font-medium">{ipo.priceBand}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(ipo.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lot Size:</span>
                                <p className="font-medium">{ipo.lotSize} shares</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Min Investment:</span>
                                <p className="font-medium">₹{(ipo.issuePrice * ipo.lotSize).toLocaleString()}</p>
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
                                  <span className="font-medium">{formatDate(ipo.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(ipo.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Listing:</span>
                                  <span className="font-medium">{formatDate(ipo.listingDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Subscription</span>
                                <span className="text-sm font-bold">{ipo.subscriptionTotal.toFixed(2)}x</span>
                              </div>
                              <Progress value={Math.min(ipo.subscriptionTotal * 20, 100)} className="h-2" />
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div>RII: {ipo.subscriptionRetail.toFixed(2)}x</div>
                                <div>NII: {ipo.subscriptionNii.toFixed(2)}x</div>
                              </div>
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Apply Now
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
                {closedIpos.map((ipo, index) => (
                  <motion.div
                    key={ipo.id}
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
                                <h3 className="text-xl font-semibold mb-2">{ipo.name}</h3>
                                <p className="text-muted-foreground mb-3">{ipo.companyName}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                    <div className="flex items-center gap-1">
                                      <XCircle className="w-4 h-4" />
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge className={getPlatformColor(ipo.smePlatform)}>
                                    <Target className="w-3 h-3 mr-1" />
                                    {ipo.smePlatform}
                                  </Badge>
                                  <Badge variant="outline">{ipo.industry}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {ipo.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Issue Price:</span>
                                <p className="font-medium">₹{ipo.issuePrice}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(ipo.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lot Size:</span>
                                <p className="font-medium">{ipo.lotSize} shares</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Min Investment:</span>
                                <p className="font-medium">₹{(ipo.issuePrice * ipo.lotSize).toLocaleString()}</p>
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
                                  <span className="font-medium">{formatDate(ipo.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(ipo.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Listing:</span>
                                  <span className="font-medium">{formatDate(ipo.listingDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Subscription</span>
                                <span className="text-sm font-bold">{ipo.subscriptionTotal.toFixed(2)}x</span>
                              </div>
                              <Progress value={Math.min(ipo.subscriptionTotal * 20, 100)} className="h-2" />
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div>RII: {ipo.subscriptionRetail.toFixed(2)}x</div>
                                <div>NII: {ipo.subscriptionNii.toFixed(2)}x</div>
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

            <TabsContent value="listed">
              <div className="grid gap-6">
                {listedIpos.map((ipo, index) => (
                  <motion.div
                    key={ipo.id}
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
                                <h3 className="text-xl font-semibold mb-2">{ipo.name}</h3>
                                <p className="text-muted-foreground mb-3">{ipo.companyName}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge className={getPlatformColor(ipo.smePlatform)}>
                                    <Target className="w-3 h-3 mr-1" />
                                    {ipo.smePlatform}
                                  </Badge>
                                  <Badge variant="outline">{ipo.industry}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {ipo.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Issue Price:</span>
                                <p className="font-medium">₹{ipo.issuePrice}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(ipo.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lot Size:</span>
                                <p className="font-medium">{ipo.lotSize} shares</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">ISIN:</span>
                                <p className="font-medium text-xs">{ipo.isin}</p>
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
                                  <span className="font-medium">{formatDate(ipo.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(ipo.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Listing:</span>
                                  <span className="font-medium">{formatDate(ipo.listingDate)}</span>
                                </div>
                              </div>
                            </div>

                            {ipo.listingGains && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-green-800">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="font-medium">Listing Gains</span>
                                </div>
                                <p className="text-green-700 font-bold text-lg">+{ipo.listingGains}%</p>
                              </div>
                            )}

                            <Button className="w-full">
                              View Performance
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