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
  FileText,
  PieChart,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface RightsIssueData {
  id: string;
  companyName: string;
  symbol: string;
  title: string;
  openDate: string;
  closeDate: string;
  recordDate: string;
  paymentDate: string;
  rightsPrice: number;
  currentMarketPrice: number;
  issueSize: number;
  ratio: string;
  entitlementRatio: string;
  maxShares: number;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Completed';
  description: string;
  purpose: string[];
  industry: string;
  website: string;
  registrarName: string;
  leadManagers: string[];
  rightsFormUrl: string;
}

export default function RightsIssuesPage() {
  const [rightsIssues, setRightsIssues] = useState<RightsIssueData[]>([]);
  const [filteredRightsIssues, setFilteredRightsIssues] = useState<RightsIssueData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock rights issues data
    const mockRightsIssues: RightsIssueData[] = [
      {
        id: '1',
        companyName: 'Tata Steel Ltd',
        symbol: 'TATASTEEL',
        title: 'Tata Steel Rights Issue 2024',
        openDate: '2024-02-01',
        closeDate: '2024-02-15',
        recordDate: '2024-01-25',
        paymentDate: '2024-02-28',
        rightsPrice: 85,
        currentMarketPrice: 125,
        issueSize: 12000000000,
        ratio: '1:5',
        entitlementRatio: '1 Rights Share for every 5 Equity Shares',
        maxShares: 141176470,
        status: 'Open',
        description: 'Tata Steel Limited has announced a rights issue of equity shares worth ₹12,000 crore to fund its expansion plans and reduce debt.',
        purpose: [
          'Debt reduction',
          'Capital expenditure for expansion',
          'Working capital requirements',
          'General corporate purposes'
        ],
        industry: 'Steel',
        website: 'https://www.tatasteel.com',
        registrarName: 'KFIN Technologies Pvt Ltd',
        leadManagers: ['Axis Capital', 'ICICI Securities', 'SBI Capital Markets'],
        rightsFormUrl: '#'
      },
      {
        id: '2',
        companyName: 'Bharti Airtel Ltd',
        symbol: 'BHARTIARTL',
        title: 'Airtel Rights Issue 2024',
        openDate: '2024-01-20',
        closeDate: '2024-02-03',
        recordDate: '2024-01-18',
        paymentDate: '2024-02-20',
        rightsPrice: 525,
        currentMarketPrice: 910,
        issueSize: 21000000000,
        ratio: '1:14',
        entitlementRatio: '1 Rights Share for every 14 Equity Shares',
        maxShares: 40000000,
        status: 'Open',
        description: 'Bharti Airtel Limited has announced a rights issue of equity shares worth ₹21,000 crore to fund 5G network expansion and strengthen its balance sheet.',
        purpose: [
          '5G network rollout',
          'Debt reduction',
          'Working capital requirements',
          'General corporate purposes'
        ],
        industry: 'Telecom',
        website: 'https://www.airtel.com',
        registrarName: 'Link Intime India Pvt Ltd',
        leadManagers: ['HDFC Bank', 'ICICI Securities', 'Kotak Mahindra Capital'],
        rightsFormUrl: '#'
      },
      {
        id: '3',
        companyName: 'Reliance Industries Ltd',
        symbol: 'RELIANCE',
        title: 'RIL Rights Issue 2023',
        openDate: '2023-11-15',
        closeDate: '2023-11-29',
        recordDate: '2023-11-13',
        paymentDate: '2023-12-15',
        rightsPrice: 1250,
        currentMarketPrice: 1185,
        issueSize: 53000000000,
        ratio: '1:15',
        entitlementRatio: '1 Rights Share for every 15 Equity Shares',
        maxShares: 42400000,
        status: 'Completed',
        description: 'Reliance Industries Limited successfully completed its rights issue of equity shares worth ₹53,000 crore to fund its green energy initiatives and reduce debt.',
        purpose: [
          'Green energy projects',
          'Debt reduction',
          '5G network expansion',
          'General corporate purposes'
        ],
        industry: 'Oil & Gas',
        website: 'https://www.ril.com',
        registrarName: 'Intime Spectrum Registry Pvt Ltd',
        leadManagers: ['SBI Capital Markets', 'ICICI Securities', 'Axis Capital'],
        rightsFormUrl: '#'
      },
      {
        id: '4',
        companyName: 'Adani Enterprises Ltd',
        symbol: 'ADANIENT',
        title: 'Adani Enterprises Rights Issue 2024',
        openDate: '2024-03-01',
        closeDate: '2024-03-15',
        recordDate: '2024-02-28',
        paymentDate: '2024-04-01',
        rightsPrice: 950,
        currentMarketPrice: 2100,
        issueSize: 20000000000,
        ratio: '1:7',
        entitlementRatio: '1 Rights Share for every 7 Equity Shares',
        maxShares: 21052631,
        status: 'Upcoming',
        description: 'Adani Enterprises Limited has announced a rights issue of equity shares worth ₹20,000 crore to fund its airport and green energy businesses.',
        purpose: [
          'Airport development',
          'Green energy projects',
          'Debt reduction',
          'General corporate purposes'
        ],
        industry: 'Conglomerate',
        website: 'https://www.adani.com',
        registrarName: 'Bigshare Services Pvt Ltd',
        leadManagers: ['Axis Capital', 'BOB Capital Markets', 'DAM Capital Advisors'],
        rightsFormUrl: '#'
      },
      {
        id: '5',
        companyName: 'HDFC Bank Ltd',
        symbol: 'HDFCBANK',
        title: 'HDFC Bank Rights Issue 2024',
        openDate: '2024-02-10',
        closeDate: '2024-02-24',
        recordDate: '2024-02-08',
        paymentDate: '2024-03-10',
        rightsPrice: 1650,
        currentMarketPrice: 1590,
        issueSize: 24000000000,
        ratio: '1:16',
        entitlementRatio: '1 Rights Share for every 16 Equity Shares',
        maxShares: 14545454,
        status: 'Open',
        description: 'HDFC Bank Limited has announced a rights issue of equity shares worth ₹24,000 crore to fund business growth and meet regulatory requirements.',
        purpose: [
          'Business expansion',
          'Regulatory capital requirements',
          'Technology upgrade',
          'General corporate purposes'
        ],
        industry: 'Banking',
        website: 'https://www.hdfcbank.com',
        registrarName: 'Cameo Corporate Services Ltd',
        leadManagers: ['HDFC Securities', 'ICICI Securities', 'Kotak Mahindra Capital'],
        rightsFormUrl: '#'
      },
      {
        id: '6',
        companyName: 'Infosys Ltd',
        symbol: 'INFY',
        title: 'Infosys Rights Issue 2023',
        openDate: '2023-10-01',
        closeDate: '2023-10-15',
        recordDate: '2023-09-29',
        paymentDate: '2023-11-01',
        rightsPrice: 1650,
        currentMarketPrice: 1780,
        issueSize: 9200000000,
        ratio: '1:2',
        entitlementRatio: '1 Rights Share for every 2 Equity Shares',
        maxShares: 5575757,
        status: 'Completed',
        description: 'Infosys Limited successfully completed its rights issue of equity shares worth ₹9,200 crore to fund strategic acquisitions and share buyback.',
        purpose: [
          'Strategic acquisitions',
          'Share buyback program',
          'Working capital requirements',
          'General corporate purposes'
        ],
        industry: 'Information Technology',
        website: 'https://www.infosys.com',
        registrarName: 'Alankit Assignment Ltd',
        leadManagers: ['Axis Capital', 'DAM Capital Advisors', 'Equirus Capital'],
        rightsFormUrl: '#'
      }
    ];

    setRightsIssues(mockRightsIssues);
    setFilteredRightsIssues(mockRightsIssues);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = rightsIssues;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.industry === industryFilter);
    }

    setFilteredRightsIssues(filtered);
  }, [rightsIssues, searchTerm, statusFilter, industryFilter]);

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

  const calculateDiscount = (rightsPrice: number, currentMarketPrice: number) => {
    return ((currentMarketPrice - rightsPrice) / currentMarketPrice * 100).toFixed(2);
  };

  const upcomingIssues = filteredRightsIssues.filter(issue => issue.status === 'Upcoming');
  const openIssues = filteredRightsIssues.filter(issue => issue.status === 'Open');
  const closedIssues = filteredRightsIssues.filter(issue => issue.status === 'Closed');
  const completedIssues = filteredRightsIssues.filter(issue => issue.status === 'Completed');

  const industries = Array.from(new Set(rightsIssues.map(issue => issue.industry)));

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Rights Issues
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Track the latest rights issues from companies and discover opportunities to invest at discounted prices
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{rightsIssues.length}</div>
              <div className="text-sm text-muted-foreground">Total Issues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{openIssues.length}</div>
              <div className="text-sm text-muted-foreground">Currently Open</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {formatCurrency(rightsIssues.reduce((sum, issue) => sum + issue.issueSize, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {rightsIssues.length > 0 ? Math.round(rightsIssues.reduce((sum, issue) => sum + parseFloat(calculateDiscount(issue.rightsPrice, issue.currentMarketPrice)), 0) / rightsIssues.length) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Discount</div>
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
                placeholder="Search rights issues by company, symbol, or industry..."
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

      {/* Rights Issues Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({filteredRightsIssues.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingIssues.length})
              </TabsTrigger>
              <TabsTrigger value="open">
                Open ({openIssues.length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed ({closedIssues.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedIssues.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6">
                {filteredRightsIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
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
                                <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                                <p className="text-muted-foreground mb-3">{issue.companyName} ({issue.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className={getStatusColor(issue.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(issue.status)}
                                      {issue.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{issue.industry}</Badge>
                                  <Badge variant="outline">{issue.ratio}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Rights Price:</span>
                                <p className="font-medium">₹{issue.rightsPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(issue.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{issue.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Discount:</span>
                                <p className="font-medium text-green-600">
                                  {calculateDiscount(issue.rightsPrice, issue.currentMarketPrice)}%
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
                                  <span className="font-medium">{formatDate(issue.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(issue.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(issue.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(issue.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <BarChart3 className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{issue.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Entitlement: {issue.entitlementRatio}
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
                {upcomingIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
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
                                <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                                <p className="text-muted-foreground mb-3">{issue.companyName} ({issue.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {issue.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{issue.industry}</Badge>
                                  <Badge variant="outline">{issue.ratio}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Rights Price:</span>
                                <p className="font-medium">₹{issue.rightsPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(issue.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{issue.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Discount:</span>
                                <p className="font-medium text-green-600">
                                  {calculateDiscount(issue.rightsPrice, issue.currentMarketPrice)}%
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
                                  <span className="font-medium">{formatDate(issue.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(issue.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(issue.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(issue.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <BarChart3 className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{issue.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Entitlement: {issue.entitlementRatio}
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
                {openIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
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
                                <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                                <p className="text-muted-foreground mb-3">{issue.companyName} ({issue.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {issue.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{issue.industry}</Badge>
                                  <Badge variant="outline">{issue.ratio}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Rights Price:</span>
                                <p className="font-medium">₹{issue.rightsPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(issue.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{issue.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Discount:</span>
                                <p className="font-medium text-green-600">
                                  {calculateDiscount(issue.rightsPrice, issue.currentMarketPrice)}%
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
                                  <span className="font-medium">{formatDate(issue.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(issue.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(issue.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(issue.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <BarChart3 className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{issue.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Entitlement: {issue.entitlementRatio}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                Apply Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </div>
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
                {closedIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
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
                                <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                                <p className="text-muted-foreground mb-3">{issue.companyName} ({issue.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                    <div className="flex items-center gap-1">
                                      <XCircle className="w-4 h-4" />
                                      {issue.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{issue.industry}</Badge>
                                  <Badge variant="outline">{issue.ratio}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Rights Price:</span>
                                <p className="font-medium">₹{issue.rightsPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(issue.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{issue.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Discount:</span>
                                <p className="font-medium text-green-600">
                                  {calculateDiscount(issue.rightsPrice, issue.currentMarketPrice)}%
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
                                  <span className="font-medium">{formatDate(issue.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(issue.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(issue.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(issue.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <BarChart3 className="w-4 h-4" />
                                <span className="font-medium">Current Market Price</span>
                              </div>
                              <p className="text-blue-700 font-bold text-lg">₹{issue.currentMarketPrice.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs text-blue-600">
                                  Entitlement: {issue.entitlementRatio}
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
                {completedIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
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
                                <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                                <p className="text-muted-foreground mb-3">{issue.companyName} ({issue.symbol})</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      {issue.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{issue.industry}</Badge>
                                  <Badge variant="outline">{issue.ratio}</Badge>
                                </div>
                              </div>
                              <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Rights Price:</span>
                                <p className="font-medium">₹{issue.rightsPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Issue Size:</span>
                                <p className="font-medium">{formatCurrency(issue.issueSize)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Shares:</span>
                                <p className="font-medium">{issue.maxShares.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Discount:</span>
                                <p className="font-medium text-green-600">
                                  {calculateDiscount(issue.rightsPrice, issue.currentMarketPrice)}%
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
                                  <span className="font-medium">{formatDate(issue.openDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close:</span>
                                  <span className="font-medium">{formatDate(issue.closeDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Record:</span>
                                  <span className="font-medium">{formatDate(issue.recordDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <span className="font-medium">{formatDate(issue.paymentDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-green-800 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-medium">Successfully Completed</span>
                              </div>
                              <p className="text-green-700 text-sm">
                                Rights issue completed successfully with strong investor participation
                              </p>
                            </div>

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