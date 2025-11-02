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
  Percent,
  Calculator,
  Info,
  BarChart3,
  PieChart,
  Star,
  Shield,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BondData {
  id: string;
  name: string;
  issuer: string;
  bondType: string;
  faceValue: number;
  couponRate: number;
  maturityDate: string;
  issueDate: string;
  creditRating: string;
  yieldToMaturity: number;
  currentPrice: number;
  isin: string;
  status: 'Active' | 'Matured' | 'Defaulted';
  description: string;
  industry: string;
  frequency: 'Annual' | 'Semi-Annual' | 'Quarterly';
  minimumInvestment: number;
  liquidity: 'High' | 'Medium' | 'Low';
  taxBenefits: boolean;
  callable: boolean;
  putable: boolean;
  secured: boolean;
}

export default function BondsPage() {
  const [bonds, setBonds] = useState<BondData[]>([]);
  const [filteredBonds, setFilteredBonds] = useState<BondData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock bonds data
    const mockBonds: BondData[] = [
      {
        id: '1',
        name: 'Government of India 7.10% 2033',
        issuer: 'Government of India',
        bondType: 'Government Security',
        faceValue: 1000,
        couponRate: 7.10,
        maturityDate: '2033-06-15',
        issueDate: '2023-06-15',
        creditRating: 'AAA',
        yieldToMaturity: 7.15,
        currentPrice: 998.50,
        isin: 'INE002A01018',
        status: 'Active',
        description: 'Government of India 10-year bond offering attractive returns with sovereign guarantee.',
        industry: 'Government',
        frequency: 'Semi-Annual',
        minimumInvestment: 10000,
        liquidity: 'High',
        taxBenefits: true,
        callable: false,
        putable: false,
        secured: true
      },
      {
        id: '2',
        name: 'Reliance Industries 8.25% 2028',
        issuer: 'Reliance Industries Ltd',
        bondType: 'Corporate Bond',
        faceValue: 1000,
        couponRate: 8.25,
        maturityDate: '2028-09-30',
        issueDate: '2023-09-30',
        creditRating: 'AA+',
        yieldToMaturity: 8.30,
        currentPrice: 1005.25,
        isin: 'INE002A01019',
        status: 'Active',
        description: 'Reliance Industries corporate bond with strong credit rating and regular interest payments.',
        industry: 'Oil & Gas',
        frequency: 'Semi-Annual',
        minimumInvestment: 10000,
        liquidity: 'High',
        taxBenefits: false,
        callable: true,
        putable: false,
        secured: true
      },
      {
        id: '3',
        name: 'HDFC Bank 7.75% 2026',
        issuer: 'HDFC Bank Ltd',
        bondType: 'Banking Bond',
        faceValue: 1000,
        couponRate: 7.75,
        maturityDate: '2026-03-31',
        issueDate: '2024-03-31',
        creditRating: 'AAA',
        yieldToMaturity: 7.80,
        currentPrice: 1002.75,
        isin: 'INE002A01020',
        status: 'Active',
        description: 'HDFC Bank tier 2 bond offering stable returns with high credit rating.',
        industry: 'Banking',
        frequency: 'Annual',
        minimumInvestment: 10000,
        liquidity: 'High',
        taxBenefits: false,
        callable: false,
        putable: false,
        secured: true
      },
      {
        id: '4',
        name: 'Tata Steel 9.00% 2029',
        issuer: 'Tata Steel Ltd',
        bondType: 'Corporate Bond',
        faceValue: 1000,
        couponRate: 9.00,
        maturityDate: '2029-12-15',
        issueDate: '2024-12-15',
        creditRating: 'AA',
        yieldToMaturity: 9.05,
        currentPrice: 995.50,
        isin: 'INE002A01021',
        status: 'Active',
        description: 'Tata Steel corporate bond offering higher yield with solid credit fundamentals.',
        industry: 'Steel',
        frequency: 'Semi-Annual',
        minimumInvestment: 10000,
        liquidity: 'Medium',
        taxBenefits: false,
        callable: true,
        putable: true,
        secured: true
      },
      {
        id: '5',
        name: 'SBI Green Bonds 6.50% 2030',
        issuer: 'State Bank of India',
        bondType: 'Green Bond',
        faceValue: 1000,
        couponRate: 6.50,
        maturityDate: '2030-08-20',
        issueDate: '2024-08-20',
        creditRating: 'AAA',
        yieldToMaturity: 6.55,
        currentPrice: 998.00,
        isin: 'INE002A01022',
        status: 'Active',
        description: 'SBI green bond supporting environmentally friendly projects with tax benefits.',
        industry: 'Banking',
        frequency: 'Annual',
        minimumInvestment: 10000,
        liquidity: 'Medium',
        taxBenefits: true,
        callable: false,
        putable: false,
        secured: true
      },
      {
        id: '6',
        name: 'Bharti Airtel 8.75% 2027',
        issuer: 'Bharti Airtel Ltd',
        bondType: 'Corporate Bond',
        faceValue: 1000,
        couponRate: 8.75,
        maturityDate: '2027-05-10',
        issueDate: '2024-05-10',
        creditRating: 'AA-',
        yieldToMaturity: 8.80,
        currentPrice: 1003.25,
        isin: 'INE002A01023',
        status: 'Active',
        description: 'Bharti Airtel corporate bond funding 5G expansion with regular interest payments.',
        industry: 'Telecom',
        frequency: 'Semi-Annual',
        minimumInvestment: 10000,
        liquidity: 'Medium',
        taxBenefits: false,
        callable: true,
        putable: false,
        secured: true
      },
      {
        id: '7',
        name: 'Infosys 7.25% 2025',
        issuer: 'Infosys Ltd',
        bondType: 'Corporate Bond',
        faceValue: 1000,
        couponRate: 7.25,
        maturityDate: '2025-11-30',
        issueDate: '2023-11-30',
        creditRating: 'AAA',
        yieldToMaturity: 7.30,
        currentPrice: 1001.50,
        isin: 'INE002A01024',
        status: 'Active',
        description: 'Infosys corporate bond with highest credit rating and strong liquidity.',
        industry: 'Information Technology',
        frequency: 'Semi-Annual',
        minimumInvestment: 10000,
        liquidity: 'High',
        taxBenefits: false,
        callable: false,
        putable: false,
        secured: true
      },
      {
        id: '8',
        name: 'NTPC 8.00% 2032',
        issuer: 'NTPC Ltd',
        bondType: 'PSU Bond',
        faceValue: 1000,
        couponRate: 8.00,
        maturityDate: '2032-04-15',
        issueDate: '2024-04-15',
        creditRating: 'AA+',
        yieldToMaturity: 8.05,
        currentPrice: 997.75,
        isin: 'INE002A01025',
        status: 'Active',
        description: 'NTPC PSU bond offering stable returns with government backing.',
        industry: 'Power',
        frequency: 'Semi-Annual',
        minimumInvestment: 10000,
        liquidity: 'Medium',
        taxBenefits: true,
        callable: false,
        putable: false,
        secured: true
      }
    ];

    setBonds(mockBonds);
    setFilteredBonds(mockBonds);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = bonds;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bond => 
        bond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bond.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bond.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bond.isin.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(bond => bond.bondType === typeFilter);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(bond => bond.creditRating === ratingFilter);
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(bond => bond.industry === industryFilter);
    }

    setFilteredBonds(filtered);
  }, [bonds, searchTerm, typeFilter, ratingFilter, industryFilter]);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'AAA':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'AA+':
      case 'AA':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'AA-':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'A+':
      case 'A':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getLiquidityColor = (liquidity: string) => {
    switch (liquidity) {
      case 'High':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Low':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
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
    return `₹${amount.toLocaleString()}`;
  };

  const calculateYearsToMaturity = (maturityDate: string) => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = Math.abs(maturity.getTime() - today.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
    return Math.round(diffYears);
  };

  const calculateYield = (bond: BondData) => {
    const yearsToMaturity = calculateYearsToMaturity(bond.maturityDate);
    const annualCoupon = bond.faceValue * (bond.couponRate / 100);
    const totalReturn = (annualCoupon * yearsToMaturity) + (bond.faceValue - bond.currentPrice);
    const averageInvestment = (bond.faceValue + bond.currentPrice) / 2;
    return (totalReturn / averageInvestment / yearsToMaturity * 100).toFixed(2);
  };

  const activeBonds = filteredBonds.filter(bond => bond.status === 'Active');
  const maturedBonds = filteredBonds.filter(bond => bond.status === 'Matured');
  const defaultedBonds = filteredBonds.filter(bond => bond.status === 'Defaulted');

  const bondTypes = Array.from(new Set(bonds.map(bond => bond.bondType)));
  const creditRatings = Array.from(new Set(bonds.map(bond => bond.creditRating)));
  const industries = Array.from(new Set(bonds.map(bond => bond.industry)));

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bonds & NCDs
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Explore government and corporate bonds with varying risk profiles and attractive returns
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{bonds.length}</div>
              <div className="text-sm text-muted-foreground">Total Bonds</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{activeBonds.length}</div>
              <div className="text-sm text-muted-foreground">Active Bonds</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {bonds.length > 0 ? Math.round(bonds.reduce((sum, bond) => sum + bond.couponRate, 0) / bonds.length * 100) / 100 : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Coupon Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {bonds.filter(bond => bond.creditRating === 'AAA').length}
              </div>
              <div className="text-sm text-muted-foreground">AAA Rated</div>
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
                placeholder="Search bonds by name, issuer, or ISIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Bond Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {bondTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {creditRatings.map(rating => (
                    <SelectItem key={rating} value={rating}>{rating}</SelectItem>
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

      {/* Bonds Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({filteredBonds.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeBonds.length})
              </TabsTrigger>
              <TabsTrigger value="matured">
                Matured ({maturedBonds.length})
              </TabsTrigger>
              <TabsTrigger value="defaulted">
                Defaulted ({defaultedBonds.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6">
                {filteredBonds.map((bond, index) => (
                  <motion.div
                    key={bond.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Left Section - Bond Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{bond.name}</h3>
                                <p className="text-muted-foreground mb-3">{bond.issuer}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className={getRatingColor(bond.creditRating)}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {bond.creditRating}
                                  </Badge>
                                  <Badge variant="outline">{bond.bondType}</Badge>
                                  <Badge variant="outline">{bond.industry}</Badge>
                                  <Badge className={getLiquidityColor(bond.liquidity)}>
                                    {bond.liquidity} Liquidity
                                  </Badge>
                                </div>
                              </div>
                              <BarChart3 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {bond.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Coupon Rate:</span>
                                <p className="font-medium text-emerald-600">{bond.couponRate}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">YTM:</span>
                                <p className="font-medium text-blue-600">{bond.yieldToMaturity}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Maturity:</span>
                                <p className="font-medium">{calculateYearsToMaturity(bond.maturityDate)} years</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Frequency:</span>
                                <p className="font-medium">{bond.frequency}</p>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Details and Actions */}
                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calculator className="w-4 h-4" />
                                Investment Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Face Value:</span>
                                  <span className="font-medium">{formatCurrency(bond.faceValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Current Price:</span>
                                  <span className="font-medium">{formatCurrency(bond.currentPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Min Investment:</span>
                                  <span className="font-medium">{formatCurrency(bond.minimumInvestment)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maturity Date:</span>
                                  <span className="font-medium">{formatDate(bond.maturityDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <Activity className="w-4 h-4" />
                                <span className="font-medium">Bond Features</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {bond.taxBenefits && (
                                  <div className="flex items-center gap-1 text-green-700">
                                    <Star className="w-3 h-3" />
                                    Tax Benefits
                                  </div>
                                )}
                                {bond.callable && (
                                  <div className="flex items-center gap-1 text-orange-700">
                                    <TrendingUp className="w-3 h-3" />
                                    Callable
                                  </div>
                                )}
                                {bond.putable && (
                                  <div className="flex items-center gap-1 text-purple-700">
                                    <TrendingDown className="w-3 h-3" />
                                    Putable
                                  </div>
                                )}
                                {bond.secured && (
                                  <div className="flex items-center gap-1 text-blue-700">
                                    <Shield className="w-3 h-3" />
                                    Secured
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button className="w-full">
                              Invest Now
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

            <TabsContent value="active">
              <div className="grid gap-6">
                {activeBonds.map((bond, index) => (
                  <motion.div
                    key={bond.id}
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
                                <h3 className="text-xl font-semibold mb-2">{bond.name}</h3>
                                <p className="text-muted-foreground mb-3">{bond.issuer}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className={getRatingColor(bond.creditRating)}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {bond.creditRating}
                                  </Badge>
                                  <Badge variant="outline">{bond.bondType}</Badge>
                                  <Badge variant="outline">{bond.industry}</Badge>
                                  <Badge className={getLiquidityColor(bond.liquidity)}>
                                    {bond.liquidity} Liquidity
                                  </Badge>
                                </div>
                              </div>
                              <BarChart3 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {bond.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Coupon Rate:</span>
                                <p className="font-medium text-emerald-600">{bond.couponRate}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">YTM:</span>
                                <p className="font-medium text-blue-600">{bond.yieldToMaturity}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Maturity:</span>
                                <p className="font-medium">{calculateYearsToMaturity(bond.maturityDate)} years</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Frequency:</span>
                                <p className="font-medium">{bond.frequency}</p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calculator className="w-4 h-4" />
                                Investment Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Face Value:</span>
                                  <span className="font-medium">{formatCurrency(bond.faceValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Current Price:</span>
                                  <span className="font-medium">{formatCurrency(bond.currentPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Min Investment:</span>
                                  <span className="font-medium">{formatCurrency(bond.minimumInvestment)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maturity Date:</span>
                                  <span className="font-medium">{formatDate(bond.maturityDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-green-800 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-medium">Active Investment</span>
                              </div>
                              <p className="text-green-700 text-sm">
                                Currently accepting investments with regular interest payments
                              </p>
                            </div>

                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              Invest Now
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

            <TabsContent value="matured">
              <div className="grid gap-6">
                {maturedBonds.map((bond, index) => (
                  <motion.div
                    key={bond.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{bond.name}</h3>
                                <p className="text-muted-foreground mb-3">{bond.issuer}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className={getRatingColor(bond.creditRating)}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {bond.creditRating}
                                  </Badge>
                                  <Badge variant="outline">{bond.bondType}</Badge>
                                  <Badge variant="outline">{bond.industry}</Badge>
                                  <Badge variant="outline">Matured</Badge>
                                </div>
                              </div>
                              <BarChart3 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {bond.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Coupon Rate:</span>
                                <p className="font-medium text-emerald-600">{bond.couponRate}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Maturity Date:</span>
                                <p className="font-medium">{formatDate(bond.maturityDate)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Face Value:</span>
                                <p className="font-medium">{formatCurrency(bond.faceValue)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Frequency:</span>
                                <p className="font-medium">{bond.frequency}</p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Maturity Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Issue Date:</span>
                                  <span className="font-medium">{formatDate(bond.issueDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maturity Date:</span>
                                  <span className="font-medium">{formatDate(bond.maturityDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tenure:</span>
                                  <span className="font-medium">{calculateYearsToMaturity(bond.maturityDate)} years</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-gray-800 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-medium">Matured Successfully</span>
                              </div>
                              <p className="text-gray-700 text-sm">
                                Bond has matured and principal has been repaid to investors
                              </p>
                            </div>

                            <Button className="w-full" variant="outline">
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

            <TabsContent value="defaulted">
              <div className="grid gap-6">
                {defaultedBonds.map((bond, index) => (
                  <motion.div
                    key={bond.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-red-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{bond.name}</h3>
                                <p className="text-muted-foreground mb-3">{bond.issuer}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Defaulted
                                  </Badge>
                                  <Badge variant="outline">{bond.bondType}</Badge>
                                  <Badge variant="outline">{bond.industry}</Badge>
                                </div>
                              </div>
                              <BarChart3 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {bond.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Coupon Rate:</span>
                                <p className="font-medium text-emerald-600">{bond.couponRate}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Maturity Date:</span>
                                <p className="font-medium">{formatDate(bond.maturityDate)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Face Value:</span>
                                <p className="font-medium">{formatCurrency(bond.faceValue)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Frequency:</span>
                                <p className="font-medium">{bond.frequency}</p>
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-80 space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Default Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Issue Date:</span>
                                  <span className="font-medium">{formatDate(bond.issueDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Maturity Date:</span>
                                  <span className="font-medium">{formatDate(bond.maturityDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Credit Rating:</span>
                                  <span className="font-medium">{bond.creditRating}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-red-800 mb-2">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">Payment Default</span>
                              </div>
                              <p className="text-red-700 text-sm">
                                Bond has defaulted on interest payments and/or principal repayment
                              </p>
                            </div>

                            <Button className="w-full" variant="outline">
                              View Recovery Status
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