'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
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
import axios from 'axios';

interface IPODetail {
  id: string;
  name: string;
  companyName: string;
  issueType?: 'Main IPO' | 'SME IPO';
  openDate?: string;
  closeDate?: string;
  listingDate?: string;
  priceBand?: string;
  issuePrice?: number;
  lotSize?: number;
  issueSize?: number;
  faceValue?: number;
  subscriptionRetail?: number;
  subscriptionQib?: number;
  subscriptionNii?: number;
  subscriptionTotal?: number;
  status?: 'Upcoming' | 'Open' | 'Closed' | 'Listed';
  registrarName?: string;
  leadManagers?: string[];
  description?: string;
  listingGains?: number | null;
  currentPrice?: number;
  aboutCompany?: string;
  objectives?: string[];
  financialHighlights?: {
    year: string;
    revenue: number;
    profit: number;
    assets: number;
  }[];
  risks?: string[];
  documents?: {
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
}

/**
 * Helper: slugify a name (same pattern used for link generation)
 */
function slugify(text?: string) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Normalize raw DB row (snake_case) into IPODetail with parsed numbers/dates
 */
function normalizeRow(raw: any): IPODetail {
  if (!raw) return {} as IPODetail;
  const r = raw;

  const parseNum = (v: any) => {
    if (v === null || v === undefined || v === '') return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };

  return {
    id: String(r.id ?? r.id?.toString?.() ?? ''),
    name: r.name ?? r.company_name ?? r.companyName ?? '',
    companyName: r.company_name ?? r.companyName ?? r.name ?? '',
    issueType: (r.issue_type ?? r.issueType) as any,
    openDate: r.open_date ?? r.openDate ?? '',
    closeDate: r.close_date ?? r.closeDate ?? '',
    listingDate: r.listing_date ?? r.listingDate ?? '',
    priceBand: r.price_band ?? r.priceBand ?? '',
    issuePrice: parseNum(r.issue_price ?? r.issuePrice),
    lotSize: parseNum(r.lot_size ?? r.lotSize),
    issueSize: parseNum(r.issue_size ?? r.issueSize),
    faceValue: parseNum(r.face_value ?? r.faceValue),
    subscriptionRetail: parseNum(r.subscription_retail ?? r.subscriptionRetail),
    subscriptionQib: parseNum(r.subscription_qib ?? r.subscriptionQib),
    subscriptionNii: parseNum(r.subscription_nii ?? r.subscriptionNii),
    subscriptionTotal: parseNum(r.subscription_total ?? r.subscriptionTotal),
    status: (r.status ?? 'Upcoming') as any,
    registrarName: r.registrar_name ?? r.registrarName ?? '',
    leadManagers: r.lead_managers ?? r.leadManagers ?? [],
    description: r.description ?? r.raw?.description ?? '',
    listingGains: r.listing_gains ?? r.listingGains ?? null,
    aboutCompany: r.about_company ?? r.aboutCompany ?? r.raw?.aboutCompany ?? '',
    objectives: r.objectives ?? r.raw?.objectives ?? [],
    financialHighlights: r.financial_highlights ?? r.financialHighlights ?? [],
    risks: r.risks ?? [],
    documents: r.documents ?? []
  };
}

export default function IPODetailPage({ params }: { params: { slug: string } }) {
  const [ipo, setIpo] = useState<IPODetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let mounted = true;

  async function load() {
    setLoading(true);
    setError(null);

    try {
      // Correct axios call
      const response:any = await axios.get(`/api/ipos/${params.slug}`);
console.log(response,"reponse coming")


      if (response?.status==200) {
        const data=response?.data?.data||[]
 // Normalize rows (optional)
      const normalized:any = data?.map((row: any) => normalizeRow(row));
console.log(normalized,"ip o data")
        setIpo(normalized[0]);
      }else{
         setError( "Failed to load IPO detail");
      }
    



     

    } catch (err: any) {
      console.error("Failed to load IPO detail", err);
      if (mounted) setError(err?.message || "Failed to load IPO detail");
    } finally {
      if (mounted) setLoading(false);
    }
  }

  load();
  return () => { mounted = false; };

}, [params.slug]);
  const formatDate = (dateString?: string) => {
    if (!dateString) return '--';
    try {
      const d = new Date(dateString);
      if (Number.isNaN(d.getTime())) return String(dateString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return String(dateString);
    }
  };

  const formatCurrency = (amount?: number) => {
    const a = Number(amount ?? 0);
    if (a >= 10000000) return `₹${(a / 10000000).toFixed(0)}Cr`;
    if (a >= 100000) return `₹${(a / 100000).toFixed(0)}L`;
    return `₹${a.toLocaleString()}`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'Listed': return 'bg-green-100 text-green-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const calculateMinInvestment = () => {
    const ip = ipo;
    if (!ip) return 0;
    return (ip.issuePrice ?? 0) * (ip.lotSize ?? 0);
  };

  // Loading state
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

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Failed to load IPO</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => { setError(null); setLoading(true); /* re-run effect */ window.location.reload(); }}>Retry</Button>
            <Link href="/ipo"><Button variant="outline">Back to IPOs</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  // Not found
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

  // Safe access using optional chaining below
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getStatusColor(ipo.status)}>{ipo.status ?? '—'}</Badge>
                <Badge variant="outline" className="text-white border-white/50">{ipo.issueType ?? '—'}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{ipo.name ?? '—'}</h1>
              <p className="text-xl text-blue-100 mb-6">{ipo.companyName ?? '—'}</p>
              <p className="text-blue-100 max-w-3xl">{ipo.description ?? ipo.aboutCompany ?? 'No description available.'}</p>
            </div>

            <div className="lg:w-80">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold mb-1">{ipo.priceBand ?? '—'}</div>
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
                      <span className="font-medium">{ipo.lotSize ?? 0} shares</span>
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

      {/* Main content (overview, financial etc.) */}
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
                    <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Key Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm text-muted-foreground">Issue Type</label>
                        <p className="font-medium">{ipo.issueType ?? '—'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Face Value</label>
                        <p className="font-medium">₹{ipo.faceValue ?? '—'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Issue Price</label>
                        <p className="font-medium">₹{ipo.issuePrice ?? '—'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Lot Size</label>
                        <p className="font-medium">{ipo.lotSize ?? '—'} Shares</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Issue Size</label>
                        <p className="font-medium">{formatCurrency(ipo.issueSize)}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Registrar</label>
                        <p className="font-medium">{ipo.registrarName ?? '—'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Important Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Important Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{formatDate(ipo.openDate)}</div>
                        <div className="text-sm text-muted-foreground">Opens On</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 mb-2">{formatDate(ipo.closeDate)}</div>
                        <div className="text-sm text-muted-foreground">Closes On</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">{formatDate(ipo.listingDate)}</div>
                        <div className="text-sm text-muted-foreground">Listing Date</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About & Risks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> About the Company</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{ipo.aboutCompany ?? ipo.description ?? 'No information available.'}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Issue Objectives</h4>
                      <ul className="space-y-2">
                        {(ipo.objectives ?? []).length === 0 ? <li className="text-sm text-muted-foreground">No objectives listed.</li> : (ipo.objectives ?? []).map((o, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Lead Managers</h4>
                      <div className="flex flex-wrap gap-2">
                        {(ipo.leadManagers ?? []).map((manager, index) => (
                          <Badge key={index} variant="outline">{manager}</Badge>
                        ))}
                        {(ipo.leadManagers ?? []).length === 0 && <div className="text-sm text-muted-foreground">No lead managers</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {(ipo.risks ?? []).length === 0 ? <li className="text-sm text-muted-foreground">No risks listed.</li> : (ipo.risks ?? []).map((risk, index) => (
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

            {/* Financial, subscription, documents, timeline tabs - keep existing markup but safely reference ipo.* with ?. */}
            {/* You can keep rest of your existing markup — it's already safe now because we normalized. */}
          </Tabs>
        </div>
      </section>
    </div>
  );
}
