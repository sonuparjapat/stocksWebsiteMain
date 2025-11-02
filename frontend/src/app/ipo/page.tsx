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
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface IPOData {
  id: string;
  name: string;
  companyName: string;
  issueType: 'Main IPO' | 'SME IPO';
  openDate: string;
  closeDate: string;
  listingDate: string;
  priceBand: string;
  issuePrice: number;
  lotSize: number;
  issueSize: number;
  faceValue: number;
  subscriptionRetail: number;
  subscriptionQib: number;
  subscriptionNii: number;
  subscriptionTotal: number;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Listed';
  registrarName: string;
  leadManagers: string[];
  description: string;
  listingGains?: number;
}

export default function IPOPage() {
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [filteredIpos, setFilteredIpos] = useState<IPOData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock IPO data
    const mockIpos: IPOData[] = [
      {
        id: '1',
        name: 'TechStart India IPO',
        companyName: 'TechStart India Limited',
        issueType: 'Main IPO',
        openDate: '2024-01-15',
        closeDate: '2024-01-17',
        listingDate: '2024-01-25',
        priceBand: '₹215-₹225',
        issuePrice: 220,
        lotSize: 65,
        issueSize: 1200000000,
        faceValue: 10,
        subscriptionRetail: 2.34,
        subscriptionQib: 3.45,
        subscriptionNii: 4.56,
        subscriptionTotal: 3.12,
        status: 'Open',
        registrarName: 'Link Intime India Pvt Ltd',
        leadManagers: ['ICICI Securities', 'SBI Capital Markets'],
        description: 'Leading technology solutions provider specializing in cloud computing and AI services.'
      },
      {
        id: '2',
        name: 'Green Energy Ltd IPO',
        companyName: 'Green Energy Limited',
        issueType: 'SME IPO',
        openDate: '2024-01-18',
        closeDate: '2024-01-22',
        listingDate: '2024-01-30',
        priceBand: '₹45-₹48',
        issuePrice: 47,
        lotSize: 3000,
        issueSize: 45000000,
        faceValue: 10,
        subscriptionRetail: 0,
        subscriptionQib: 0,
        subscriptionNii: 0,
        subscriptionTotal: 0,
        status: 'Upcoming',
        registrarName: 'Bigshare Services Pvt Ltd',
        leadManagers: ['Beeline Capital Advisors'],
        description: 'Renewable energy company focused on solar and wind power projects.'
      },
      {
        id: '3',
        name: 'HealthCare Plus IPO',
        companyName: 'HealthCare Plus Limited',
        issueType: 'Main IPO',
        openDate: '2024-01-10',
        closeDate: '2024-01-12',
        listingDate: '2024-01-20',
        priceBand: '₹320-₹335',
        issuePrice: 330,
        lotSize: 45,
        issueSize: 800000000,
        faceValue: 10,
        subscriptionRetail: 4.56,
        subscriptionQib: 5.67,
        subscriptionNii: 6.78,
        subscriptionTotal: 5.67,
        status: 'Closed',
        registrarName: 'KFIN Technologies Pvt Ltd',
        leadManagers: ['Axis Capital', 'Kotak Mahindra Capital Company'],
        description: 'Integrated healthcare services provider with hospitals and diagnostic centers.'
      },
      {
        id: '4',
        name: 'FinTech Solutions IPO',
        companyName: 'FinTech Solutions Limited',
        issueType: 'SME IPO',
        openDate: '2024-01-08',
        closeDate: '2024-01-10',
        listingDate: '2024-01-18',
        priceBand: '₹78-₹82',
        issuePrice: 80,
        lotSize: 1600,
        issueSize: 67000000,
        faceValue: 10,
        subscriptionRetail: 3.21,
        subscriptionQib: 4.32,
        subscriptionNii: 5.43,
        subscriptionTotal: 4.32,
        status: 'Listed',
        registrarName: 'Skyline Financial Services Pvt Ltd',
        leadManagers: ['Swastika Investmart Ltd'],
        description: 'Digital payment solutions provider for businesses and individuals.',
        listingGains: 15.5
      },
      {
        id: '5',
        name: 'EduTech Platforms IPO',
        companyName: 'EduTech Platforms Limited',
        issueType: 'Main IPO',
        openDate: '2024-01-20',
        closeDate: '2024-01-24',
        listingDate: '2024-02-01',
        priceBand: '₹180-₹190',
        issuePrice: 185,
        lotSize: 80,
        issueSize: 950000000,
        faceValue: 10,
        subscriptionRetail: 1.23,
        subscriptionQib: 2.34,
        subscriptionNii: 3.45,
        subscriptionTotal: 2.34,
        status: 'Open',
        registrarName: 'Intime Spectrum Registry Pvt Ltd',
        leadManagers: ['HDFC Securities', 'IIFL Securities'],
        description: 'Online education platform offering courses from top universities and institutions.'
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
        ipo.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ipo => ipo.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(ipo => ipo.issueType === typeFilter);
    }

    setFilteredIpos(filtered);
  }, [ipos, searchTerm, statusFilter, typeFilter]);

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

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Initial Public Offerings (IPOs)
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover new investment opportunities with detailed analysis of upcoming, open, and listed IPOs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search IPOs by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
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

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Main IPO">Main IPO</SelectItem>
                  <SelectItem value="SME IPO">SME IPO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* IPOs Content */}
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
                                <div className="flex items-center gap-3">
                                  <Badge className={getStatusColor(ipo.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(ipo.status)}
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{ipo.issueType}</Badge>
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
                                <span className="text-muted-foreground">Face Value:</span>
                                <p className="font-medium">₹{ipo.faceValue}</p>
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
                                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                  <div>RII: {ipo.subscriptionRetail.toFixed(2)}x</div>
                                  <div>NII: {ipo.subscriptionNii.toFixed(2)}x</div>
                                  <div>QIB: {ipo.subscriptionQib.toFixed(2)}x</div>
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
                                <div className="flex items-center gap-3">
                                  <Badge className={getStatusColor(ipo.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(ipo.status)}
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{ipo.issueType}</Badge>
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
                                <span className="text-muted-foreground">Face Value:</span>
                                <p className="font-medium">₹{ipo.faceValue}</p>
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
                                <div className="flex items-center gap-3">
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{ipo.issueType}</Badge>
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
                                <span className="text-muted-foreground">Face Value:</span>
                                <p className="font-medium">₹{ipo.faceValue}</p>
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
                              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                <div>RII: {ipo.subscriptionRetail.toFixed(2)}x</div>
                                <div>NII: {ipo.subscriptionNii.toFixed(2)}x</div>
                                <div>QIB: {ipo.subscriptionQib.toFixed(2)}x</div>
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
                                <div className="flex items-center gap-3">
                                  <Badge className={getStatusColor(ipo.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(ipo.status)}
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{ipo.issueType}</Badge>
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
                                <span className="text-muted-foreground">Face Value:</span>
                                <p className="font-medium">₹{ipo.faceValue}</p>
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
                              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                <div>RII: {ipo.subscriptionRetail.toFixed(2)}x</div>
                                <div>NII: {ipo.subscriptionNii.toFixed(2)}x</div>
                                <div>QIB: {ipo.subscriptionQib.toFixed(2)}x</div>
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
                                <div className="flex items-center gap-3">
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      {ipo.status}
                                    </div>
                                  </Badge>
                                  <Badge variant="outline">{ipo.issueType}</Badge>
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
                                <span className="text-muted-foreground">Face Value:</span>
                                <p className="font-medium">₹{ipo.faceValue}</p>
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