'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Users,
  FileText,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Bookmark,
  Star,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface IPODetail {
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
  currentPrice?: number;
  aboutCompany: string;
  objectives: string[];
  financialHighlights: {
    year: string;
    revenue: number;
    profit: number;
    assets: number;
  }[];
  risks: string[];
  documents: {
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
}

export default function IPODetailPage({ params }: { params: { slug: string } }) {
  const [ipo, setIpo] = useState<IPODetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock IPO detail data
    const mockIPO: IPODetail = {
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
      leadManagers: ['ICICI Securities', 'SBI Capital Markets', 'Axis Capital'],
      description: 'Leading technology solutions provider specializing in cloud computing and AI services.',
      aboutCompany: 'TechStart India Limited is a leading technology solutions provider established in 2015. The company specializes in cloud computing, artificial intelligence, and enterprise software solutions. With a strong presence in the Indian market, the company has expanded its operations to international markets, serving over 500 enterprise clients across various sectors including banking, healthcare, and retail.',
      objectives: [
        'Funding expansion of data center infrastructure',
        'Investment in AI and machine learning R&D',
        'Acquisition of strategic technology startups',
        'Working capital requirements',
        'General corporate purposes'
      ],
      financialHighlights: [
        { year: '2021', revenue: 185000000, profit: 22000000, assets: 156000000 },
        { year: '2022', revenue: 242000000, profit: 31000000, assets: 198000000 },
        { year: '2023', revenue: 298000000, profit: 45000000, assets: 267000000 }
      ],
      risks: [
        'Intense competition in the technology sector',
        'Dependence on key personnel and technical expertise',
        'Regulatory changes in data protection and privacy',
        'Currency fluctuations in international operations',
        'Rapid technological changes requiring continuous innovation'
      ],
      documents: [
        { name: 'Draft Red Herring Prospectus', type: 'PDF', size: '5.2 MB', url: '#' },
        { name: 'Application Form', type: 'PDF', size: '245 KB', url: '#' },
        { name: 'Financial Statements', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Corporate Presentation', type: 'PPT', size: '3.8 MB', url: '#' }
      ]
    };

    setTimeout(() => {
      setIpo(mockIPO);
      setLoading(false);
    }, 1000);
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      case 'Listed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const calculateMinInvestment = () => {
    if (!ipo) return 0;
    return ipo.issuePrice * ipo.lotSize;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading IPO details...</p>
        </div>
      </div>
    );
  }

  if (!ipo) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">IPO Not Found</h2>
          <p className="text-muted-foreground mb-6">The IPO you're looking for doesn't exist.</p>
          <Link href="/ipo">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to IPOs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/ipo">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to IPOs
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getStatusColor(ipo.status)}>
                  {ipo.status}
                </Badge>
                <Badge variant="outline" className="text-white border-white/50">
                  {ipo.issueType}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{ipo.name}</h1>
              <p className="text-xl text-blue-100 mb-6">{ipo.companyName}</p>
              <p className="text-blue-100 max-w-3xl">{ipo.description}</p>
            </div>
            
            <div className="lg:w-80">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold mb-1">{ipo.priceBand}</div>
                    <div className="text-sm text-blue-200">Price Band</div>
                  </div>
                  <Separator className="bg-white/20 mb-4" />
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Issue Size:</span>
                      <span className="font-medium">{formatCurrency(ipo.issueSize)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Lot Size:</span>
                      <span className="font-medium">{ipo.lotSize} shares</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Min Investment:</span>
                      <span className="font-medium">₹{calculateMinInvestment().toLocaleString()}</span>
                    </div>
                  </div>
                  {ipo.status === 'Open' && (
                    <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50">
                      Apply Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6">
                {/* Key Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Key Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm text-muted-foreground">Issue Type</label>
                        <p className="font-medium">{ipo.issueType}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Face Value</label>
                        <p className="font-medium">₹{ipo.faceValue}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Issue Price</label>
                        <p className="font-medium">₹{ipo.issuePrice}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Lot Size</label>
                        <p className="font-medium">{ipo.lotSize} Shares</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Issue Size</label>
                        <p className="font-medium">{formatCurrency(ipo.issueSize)}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Registrar</label>
                        <p className="font-medium">{ipo.registrarName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Important Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Important Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {formatDate(ipo.openDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">Opens On</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 mb-2">
                          {formatDate(ipo.closeDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">Closes On</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {formatDate(ipo.listingDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">Listing Date</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About Company */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      About the Company
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{ipo.aboutCompany}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Issue Objectives</h4>
                      <ul className="space-y-2">
                        {ipo.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Lead Managers</h4>
                      <div className="flex flex-wrap gap-2">
                        {ipo.leadManagers.map((manager, index) => (
                          <Badge key={index} variant="outline">
                            {manager}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Factors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {ipo.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial">
              <div className="grid gap-6">
                {/* Financial Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Financial Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Year</th>
                            <th className="text-right py-3 px-4">Revenue</th>
                            <th className="text-right py-3 px-4">Profit</th>
                            <th className="text-right py-3 px-4">Assets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ipo.financialHighlights.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 px-4 font-medium">{item.year}</td>
                              <td className="py-3 px-4 text-right">{formatCurrency(item.revenue)}</td>
                              <td className="py-3 px-4 text-right">{formatCurrency(item.profit)}</td>
                              <td className="py-3 px-4 text-right">{formatCurrency(item.assets)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Ratios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Key Financial Ratios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">15.2%</div>
                        <div className="text-sm text-muted-foreground">ROE</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">12.8%</div>
                        <div className="text-sm text-muted-foreground">ROCE</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">2.34</div>
                        <div className="text-sm text-muted-foreground">Debt/Equity</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">18.5%</div>
                        <div className="text-sm text-muted-foreground">PAT Margin</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="grid gap-6">
                {/* Subscription Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Subscription Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{ipo.subscriptionTotal.toFixed(2)}x</div>
                        <div className="text-sm text-muted-foreground">Total Subscription</div>
                        <Progress value={Math.min(ipo.subscriptionTotal * 20, 100)} className="mt-3 h-3" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {ipo.subscriptionRetail.toFixed(2)}x
                          </div>
                          <div className="text-sm text-muted-foreground">Retail Investors</div>
                          <Progress value={Math.min(ipo.subscriptionRetail * 20, 100)} className="mt-2 h-2" />
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {ipo.subscriptionNii.toFixed(2)}x
                          </div>
                          <div className="text-sm text-muted-foreground">NII</div>
                          <Progress value={Math.min(ipo.subscriptionNii * 20, 100)} className="mt-2 h-2" />
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {ipo.subscriptionQib.toFixed(2)}x
                          </div>
                          <div className="text-sm text-muted-foreground">QIB</div>
                          <Progress value={Math.min(ipo.subscriptionQib * 20, 100)} className="mt-2 h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Calculator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Investment Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Number of Lots</label>
                          <input
                            type="number"
                            min="1"
                            defaultValue="1"
                            className="w-full mt-1 px-3 py-2 border border-input rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Application Amount</label>
                          <div className="text-2xl font-bold">₹{calculateMinInvestment().toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground">Shares Allotted</label>
                          <div className="text-2xl font-bold">{ipo.lotSize} (1 Lot)</div>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Estimated Allotment</label>
                          <div className="text-lg font-medium text-green-600">
                            {Math.min(100 / ipo.subscriptionTotal, 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    IPO Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ipo.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">{doc.type} • {doc.size}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    IPO Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-blue-600 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium">IPO Announcement</div>
                        <div className="text-sm text-muted-foreground">January 1, 2024</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Company announces its intention to go public with an IPO
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-orange-600 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium">DRHP Filed</div>
                        <div className="text-sm text-muted-foreground">January 5, 2024</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Draft Red Herring Prospectus filed with SEBI
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-green-600 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium">IPO Opens</div>
                        <div className="text-sm text-muted-foreground">{formatDate(ipo.openDate)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          IPO opens for public subscription
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-red-600 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium">IPO Closes</div>
                        <div className="text-sm text-muted-foreground">{formatDate(ipo.closeDate)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          IPO closes for public subscription
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-purple-600 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium">Allotment Finalized</div>
                        <div className="text-sm text-muted-foreground">January 22, 2024</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Share allotment finalized and refunds initiated
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-4 h-4 bg-green-600 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium">Listing</div>
                        <div className="text-sm text-muted-foreground">{formatDate(ipo.listingDate)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Shares listed on stock exchanges
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}