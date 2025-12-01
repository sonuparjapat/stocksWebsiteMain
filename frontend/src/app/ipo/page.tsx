'use client';
import { useRouter } from 'next/navigation';
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
import LocalDate from '@/components/LocalDate';
import { cn } from '@/lib/utils';

interface IPOData {
  id?: string;
  name?: string;
  companyName?: string;
  company_name?: string;
  issueType?: 'Main IPO' | 'SME IPO';
  issue_type?: 'Main IPO' | 'SME IPO';
  openDate?: string;
  open_date?: string;
  closeDate?: string;
  close_date?: string;
  listingDate?: string;
  listing_date?: string;
  priceBand?: string;
  price_band?: string;
  issuePrice?: number | string;
  issue_price?: number | string;
  lotSize?: number;
  lot_size?: number;
  issueSize?: number | string;
  issue_size?: number | string;
  faceValue?: number | string;
  face_value?: number | string;
  subscriptionRetail?: number | string;
  subscription_retail?: number | string;
  subscriptionQib?: number | string;
  subscription_qib?: number | string;
  subscriptionNii?: number | string;
  subscription_nii?: number | string;
  subscriptionTotal?: number | string;
  subscription_total?: number | string;
  status?: 'Upcoming' | 'Open' | 'Closed' | 'Listed';
  registrarName?: string;
  registrar_name?: string;
  leadManagers?: string[];
  lead_managers?: string[];
  description?: string;
  listingGains?: number | null;
  listing_gains?: number | null;
  raw?: any;
  created_at?: string;
  updated_at?: string;
  [k: string]: any;
}

export default function IPOPage() {
  const [ipos, setIpos] = useState<IPOData[]>([]);
  const [filteredIpos, setFilteredIpos] = useState<IPOData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [selectedIpo, setSelectedIpo] = useState<IPOData | null>(null);
const router=useRouter()
// handler to open details modal
const viewDetails = (ipo: IPOData) => {
  setSelectedIpo(ipo);
};
// handler to close modal
const closeDetails = () => setSelectedIpo(null);
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/ipos');
        const json = await res.json();
        if (!json?.success) {
          throw new Error(json?.error || 'API returned error');
        }
        if (mounted) {
          console.log('IPOS loaded from:', json._loadedFrom ?? 'unknown');
          setIpos(Array.isArray(json.data) ? json.data : []);
          setFilteredIpos(Array.isArray(json.data) ? json.data : []);
        }
      } catch (err: any) {
        console.error('Failed to load IPOS', err);
        if (mounted) setError(err?.message ?? 'Failed to load IPOs');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let filtered = ipos ?? [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ipo => 
        (String(ipo?.name ?? ipo?.company_name ?? ipo?.companyName ?? ipo?.raw?.companyName ?? '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (String(ipo?.companyName ?? ipo?.company_name ?? ipo?.raw?.companyName ?? ipo?.name ?? '')).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ipo => (ipo?.status ?? ipo?.raw?.status) === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(ipo => (ipo?.issueType ?? ipo?.issue_type ?? ipo?.raw?.issueType) === typeFilter);
    }

    setFilteredIpos(filtered);
  }, [ipos, searchTerm, statusFilter, typeFilter]);

  const getStatusIcon = (status?: string) => {
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

  const getStatusColor = (status?: string) => {
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

  const formatCurrency = (amount?: number | string) => {
    const n = Number(amount ?? 0) || 0;
    if (n >= 10000000) {
      return `₹${(n / 10000000).toFixed(0)}Cr`;
    } else if (n >= 100000) {
      return `₹${(n / 100000).toFixed(0)}L`;
    }
    return `₹${n.toLocaleString()}`;
  };

  const upcomingIpos = (filteredIpos ?? []).filter(ipo => (ipo?.status ?? ipo?.raw?.status) === 'Upcoming');
  const openIpos = (filteredIpos ?? []).filter(ipo => (ipo?.status ?? ipo?.raw?.status) === 'Open');
  const closedIpos = (filteredIpos ?? []).filter(ipo => (ipo?.status ?? ipo?.raw?.status) === 'Closed');
  const listedIpos = (filteredIpos ?? []).filter(ipo => (ipo?.status ?? ipo?.raw?.status) === 'Listed');

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
          {loading ? (
            <div className="p-8 text-center">Loading IPOs…</div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-lg font-medium mb-3">Something went wrong</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => { setError(null); setLoading(true); window.location.reload(); }}>
                Retry
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  All ({filteredIpos?.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingIpos?.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="open">
                  Open ({openIpos?.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="closed">
                  Closed ({closedIpos?.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="listed">
                  Listed ({listedIpos?.length ?? 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid gap-6">
                  {filteredIpos?.map((ipo, index) => {
                    // Normalized getters (try multiple shapes)
                    const raw = ipo?.raw ?? {};
                    const id = ipo?.id ?? raw?.id ?? '';
                    const name = ipo?.name ?? ipo?.company_name ?? ipo?.companyName ?? raw?.name ?? '';
                    const companyName = ipo?.companyName ?? ipo?.company_name ?? raw?.companyName ?? '';
                    const issueType = ipo?.issueType ?? ipo?.issue_type ?? raw?.issueType ?? 'Main IPO';
                    const openDate = ipo?.openDate ?? ipo?.open_date ?? raw?.openDate ?? null;
                    const closeDate = ipo?.closeDate ?? ipo?.close_date ?? raw?.closeDate ?? null;
                    const listingDate = ipo?.listingDate ?? ipo?.listing_date ?? raw?.listingDate ?? null;
                    const priceBand = ipo?.priceBand ?? ipo?.price_band ?? raw?.priceBand ?? '';
                    const issuePrice = Number(ipo?.issuePrice ?? ipo?.issue_price ?? raw?.issuePrice ?? 0) || 0;
                    const lotSize = Number(ipo?.lotSize ?? ipo?.lot_size ?? raw?.lotSize ?? 0) || 0;
                    const issueSize = Number(ipo?.issueSize ?? ipo?.issue_size ?? raw?.issueSize ?? 0) || 0;
                    const faceValue = Number(ipo?.faceValue ?? ipo?.face_value ?? raw?.faceValue ?? 0) || 0;

                    const subscriptionRetail = Number(ipo?.subscriptionRetail ?? ipo?.subscription_retail ?? raw?.subscriptionRetail ?? 0) || 0;
                    const subscriptionQib = Number(ipo?.subscriptionQib ?? ipo?.subscription_qib ?? raw?.subscriptionQib ?? 0) || 0;
                    const subscriptionNii = Number(ipo?.subscriptionNii ?? ipo?.subscription_nii ?? raw?.subscriptionNii ?? 0) || 0;
                    const subscriptionTotal = Number(ipo?.subscriptionTotal ?? ipo?.subscription_total ?? raw?.subscriptionTotal ?? 0) || 0;

                    const status = ipo?.status ?? raw?.status ?? 'Upcoming';
                    const registrarName = ipo?.registrarName ?? ipo?.registrar_name ?? raw?.registrarName ?? '';
                    const leadManagers = ipo?.leadManagers ?? ipo?.lead_managers ?? raw?.leadManagers ?? [];
                    const description = ipo?.description ?? raw?.description ?? '';
                    const listingGains = ipo?.listingGains ?? ipo?.listing_gains ?? raw?.listingGains ?? null;

                    return (
                      <motion.div
                        key={id ?? index}
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
                                    <h3 className="text-xl font-semibold mb-2">{name}</h3>
                                    <p className="text-muted-foreground mb-3">{companyName}</p>
                                    <div className="flex items-center gap-3">
                                      <Badge className={getStatusColor(status)}>
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(status)}
                                          {status}
                                        </div>
                                      </Badge>
                                      <Badge variant="outline">{issueType}</Badge>
                                    </div>
                                  </div>
                                  <Building2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {description}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Price Band:</span>
                                    <p className="font-medium">{priceBand}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Issue Size:</span>
                                    <p className="font-medium">{formatCurrency(issueSize)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Lot Size:</span>
                                    <p className="font-medium">{lotSize} shares</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Face Value:</span>
                                    <p className="font-medium">₹{faceValue}</p>
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
                                      <span className="font-medium">
                                        <LocalDate iso={openDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Close:</span>
                                      <LocalDate iso={closeDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Listing:</span>
                                      <LocalDate iso={listingDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                  </div>
                                </div>

                                {(status === 'Open' && subscriptionTotal > 0) && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-medium">Subscription</span>
                                      <span className="text-sm font-bold">{subscriptionTotal.toFixed(2)}x</span>
                                    </div>
                                    <Progress value={Math.min(subscriptionTotal * 20, 100)} className="h-2" />
                                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                      <div>RII: {subscriptionRetail.toFixed(2)}x</div>
                                      <div>NII: {subscriptionNii.toFixed(2)}x</div>
                                      <div>QIB: {subscriptionQib.toFixed(2)}x</div>
                                    </div>
                                  </div>
                                )}

                                {(status === 'Listed' && listingGains != null) && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-800">
                                      <TrendingUp className="w-4 h-4" />
                                      <span className="font-medium">Listing Gains</span>
                                    </div>
                                    <p className="text-green-700 font-bold text-lg">+{listingGains}%</p>
                                  </div>
                                )}

 <Button onClick={() => router.push(`/ipo/${ipo.id}`)} className="w-full">
  View Details
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* upcoming, open, closed, listed tabs reuse same rendering style */}
              <TabsContent value="upcoming">
                <div className="grid gap-6">
                  {upcomingIpos?.map((ipo, index) => {
                    const raw = ipo?.raw ?? {};
                    const id = ipo?.id ?? raw?.id ?? index;
                    const name = ipo?.name ?? ipo?.company_name ?? ipo?.companyName ?? raw?.name ?? '';
                    const companyName = ipo?.companyName ?? ipo?.company_name ?? raw?.companyName ?? '';
                    // reuse same normalization as above for dates/numbers
                    const openDate = ipo?.openDate ?? ipo?.open_date ?? raw?.openDate ?? null;
                    const closeDate = ipo?.closeDate ?? ipo?.close_date ?? raw?.closeDate ?? null;
                    const listingDate = ipo?.listingDate ?? ipo?.listing_date ?? raw?.listingDate ?? null;
                    const subscriptionTotal = Number(ipo?.subscriptionTotal ?? ipo?.subscription_total ?? raw?.subscriptionTotal ?? 0) || 0;
                    const subscriptionRetail = Number(ipo?.subscriptionRetail ?? ipo?.subscription_retail ?? raw?.subscriptionRetail ?? 0) || 0;
                    const subscriptionNii = Number(ipo?.subscriptionNii ?? ipo?.subscription_nii ?? raw?.subscriptionNii ?? 0) || 0;
                    const subscriptionQib = Number(ipo?.subscriptionQib ?? ipo?.subscription_qib ?? raw?.subscriptionQib ?? 0) || 0;
                    const status = ipo?.status ?? raw?.status ?? 'Upcoming';
                    const description = ipo?.description ?? raw?.description ?? '';

                    return (
                      <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card className="hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-2">{name}</h3>
                                    <p className="text-muted-foreground mb-3">{companyName}</p>
                                    <div className="flex items-center gap-3">
                                      <Badge className={getStatusColor(status)}>
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(status)}
                                          {status}
                                        </div>
                                      </Badge>
                                    </div>
                                  </div>
                                  <Building2 className="w-8 h-8 text-muted-foreground" />
                                </div>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
                                {/* simplified info — you can expand like above if needed */}
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
                                      <LocalDate iso={openDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Close:</span>
                                      <LocalDate iso={closeDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Listing:</span>
                                      <LocalDate iso={listingDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                  </div>
                                </div>

                            <Button onClick={() => router.push(`/ipo/${ipo.id}`)} className="w-full">
  View Details
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="open">
                <div className="grid gap-6">
                  {openIpos?.map((ipo, index) => {
                    // reuse normalization pattern: keep it concise here
                    const raw = ipo?.raw ?? {};
                    const id = ipo?.id ?? raw?.id ?? index;
                    const name = ipo?.name ?? ipo?.company_name ?? ipo?.companyName ?? raw?.name ?? '';
                    const companyName = ipo?.companyName ?? ipo?.company_name ?? raw?.companyName ?? '';
                    const openDate = ipo?.openDate ?? ipo?.open_date ?? raw?.openDate ?? null;
                    const closeDate = ipo?.closeDate ?? ipo?.close_date ?? raw?.closeDate ?? null;
                    const listingDate = ipo?.listingDate ?? ipo?.listing_date ?? raw?.listingDate ?? null;
                    const subscriptionTotal = Number(ipo?.subscriptionTotal ?? ipo?.subscription_total ?? raw?.subscriptionTotal ?? 0) || 0;
                    const subscriptionRetail = Number(ipo?.subscriptionRetail ?? ipo?.subscription_retail ?? raw?.subscriptionRetail ?? 0) || 0;
                    const subscriptionNii = Number(ipo?.subscriptionNii ?? ipo?.subscription_nii ?? raw?.subscriptionNii ?? 0) || 0;
                    const subscriptionQib = Number(ipo?.subscriptionQib ?? ipo?.subscription_qib ?? raw?.subscriptionQib ?? 0) || 0;
                    const issueSize = Number(ipo?.issueSize ?? ipo?.issue_size ?? raw?.issueSize ?? 0) || 0;
                    const lotSize = Number(ipo?.lotSize ?? ipo?.lot_size ?? raw?.lotSize ?? 0) || 0;
                    const faceValue = Number(ipo?.faceValue ?? ipo?.face_value ?? raw?.faceValue ?? 0) || 0;
                    const description = ipo?.description ?? raw?.description ?? '';

                    return (
                      <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card className="hover:shadow-lg transition-all duration-300 border-blue-200">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-2">{name}</h3>
                                    <p className="text-muted-foreground mb-3">{companyName}</p>
                                    <div className="flex items-center gap-3">
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-4 h-4" />
                                          {(ipo?.status ?? raw?.status) ?? 'Open'}
                                        </div>
                                      </Badge>
                                      <Badge variant="outline">{ipo?.issueType ?? ipo?.issue_type ?? raw?.issueType ?? 'Main IPO'}</Badge>
                                    </div>
                                  </div>
                                  <Building2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Price Band:</span>
                                    <p className="font-medium">{ipo?.priceBand ?? ipo?.price_band ?? raw?.priceBand ?? '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Issue Size:</span>
                                    <p className="font-medium">{formatCurrency(issueSize)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Lot Size:</span>
                                    <p className="font-medium">{lotSize} shares</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Face Value:</span>
                                    <p className="font-medium">₹{faceValue}</p>
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
                                      <LocalDate iso={openDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Close:</span>
                                      <LocalDate iso={closeDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Listing:</span>
                                      <LocalDate iso={listingDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Subscription</span>
                                    <span className="text-sm font-bold">{subscriptionTotal.toFixed(2)}x</span>
                                  </div>
                                  <Progress value={Math.min(subscriptionTotal * 20, 100)} className="h-2" />
                                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                    <div>RII: {subscriptionRetail.toFixed(2)}x</div>
                                    <div>NII: {subscriptionNii.toFixed(2)}x</div>
                                    <div>QIB: {subscriptionQib.toFixed(2)}x</div>
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
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="closed">
                <div className="grid gap-6">
                  {closedIpos?.map((ipo, index) => {
                    const raw = ipo?.raw ?? {};
                    const id = ipo?.id ?? raw?.id ?? index;
                    const name = ipo?.name ?? ipo?.company_name ?? ipo?.companyName ?? raw?.name ?? '';
                    const companyName = ipo?.companyName ?? ipo?.company_name ?? raw?.companyName ?? '';
                    const issueSize = Number(ipo?.issueSize ?? ipo?.issue_size ?? raw?.issueSize ?? 0) || 0;
                    const lotSize = Number(ipo?.lotSize ?? ipo?.lot_size ?? raw?.lotSize ?? 0) || 0;
                    const faceValue = Number(ipo?.faceValue ?? ipo?.face_value ?? raw?.faceValue ?? 0) || 0;
                    const description = ipo?.description ?? raw?.description ?? '';
                    const openDate = ipo?.openDate ?? ipo?.open_date ?? raw?.openDate ?? null;
                    const closeDate = ipo?.closeDate ?? ipo?.close_date ?? raw?.closeDate ?? null;
                    const listingDate = ipo?.listingDate ?? ipo?.listing_date ?? raw?.listingDate ?? null;
                    const subscriptionTotal = Number(ipo?.subscriptionTotal ?? ipo?.subscription_total ?? raw?.subscriptionTotal ?? 0) || 0;
                    const subscriptionRetail = Number(ipo?.subscriptionRetail ?? ipo?.subscription_retail ?? raw?.subscriptionRetail ?? 0) || 0;
                    const subscriptionNii = Number(ipo?.subscriptionNii ?? ipo?.subscription_nii ?? raw?.subscriptionNii ?? 0) || 0;
                    const subscriptionQib = Number(ipo?.subscriptionQib ?? ipo?.subscription_qib ?? raw?.subscriptionQib ?? 0) || 0;
                    const status = ipo?.status ?? raw?.status ?? 'Closed';
                    const listingGains = ipo?.listingGains ?? ipo?.listing_gains ?? raw?.listingGains ?? null;

                    return (
                      <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card className="hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-2">{name}</h3>
                                    <p className="text-muted-foreground mb-3">{companyName}</p>
                                    <div className="flex items-center gap-3">
                                      <Badge className={getStatusColor(status)}>
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(status)}
                                          {status}
                                        </div>
                                      </Badge>
                                      <Badge variant="outline">{ipo?.issueType ?? ipo?.issue_type ?? raw?.issueType ?? 'Main IPO'}</Badge>
                                    </div>
                                  </div>
                                  <Building2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Price Band:</span>
                                    <p className="font-medium">{ipo?.priceBand ?? ipo?.price_band ?? raw?.priceBand ?? '—'}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Issue Size:</span>
                                    <p className="font-medium">{formatCurrency(issueSize)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Lot Size:</span>
                                    <p className="font-medium">{lotSize} shares</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Face Value:</span>
                                    <p className="font-medium">₹{faceValue}</p>
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
                                      <LocalDate iso={openDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Close:</span>
                                      <LocalDate iso={closeDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Listing:</span>
                                      <LocalDate iso={listingDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Subscription</span>
                                    <span className="text-sm font-bold">{subscriptionTotal.toFixed(2)}x</span>
                                  </div>
                                  <Progress value={Math.min(subscriptionTotal * 20, 100)} className="h-2" />
                                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                    <div>RII: {subscriptionRetail.toFixed(2)}x</div>
                                    <div>NII: {subscriptionNii.toFixed(2)}x</div>
                                    <div>QIB: {subscriptionQib.toFixed(2)}x</div>
                                  </div>
                                </div>

                              <Button onClick={() => router.push(`/ipo/${ipo.id}`)} className="w-full">
  View Details
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="listed">
                <div className="grid gap-6">
                  {listedIpos?.map((ipo, index) => {
                    const raw = ipo?.raw ?? {};
                    const id = ipo?.id ?? raw?.id ?? index;
                    const name = ipo?.name ?? ipo?.company_name ?? ipo?.companyName ?? raw?.name ?? '';
                    const companyName = ipo?.companyName ?? ipo?.company_name ?? raw?.companyName ?? '';
                    const issueSize = Number(ipo?.issueSize ?? ipo?.issue_size ?? raw?.issueSize ?? 0) || 0;
                    const lotSize = Number(ipo?.lotSize ?? ipo?.lot_size ?? raw?.lotSize ?? 0) || 0;
                    const faceValue = Number(ipo?.faceValue ?? ipo?.face_value ?? raw?.faceValue ?? 0) || 0;
                    const description = ipo?.description ?? raw?.description ?? '';
                    const openDate = ipo?.openDate ?? ipo?.open_date ?? raw?.openDate ?? null;
                    const closeDate = ipo?.closeDate ?? ipo?.close_date ?? raw?.closeDate ?? null;
                    const listingDate = ipo?.listingDate ?? ipo?.listing_date ?? raw?.listingDate ?? null;
                    const subscriptionTotal = Number(ipo?.subscriptionTotal ?? ipo?.subscription_total ?? raw?.subscriptionTotal ?? 0) || 0;
                    const subscriptionRetail = Number(ipo?.subscriptionRetail ?? ipo?.subscription_retail ?? raw?.subscriptionRetail ?? 0) || 0;
                    const subscriptionNii = Number(ipo?.subscriptionNii ?? ipo?.subscription_nii ?? raw?.subscriptionNii ?? 0) || 0;
                    const subscriptionQib = Number(ipo?.subscriptionQib ?? ipo?.subscription_qib ?? raw?.subscriptionQib ?? 0) || 0;
                    const status = ipo?.status ?? raw?.status ?? 'Listed';
                    const listingGains = ipo?.listingGains ?? ipo?.listing_gains ?? raw?.listingGains ?? null;

                    return (
                      <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-2">{name}</h3>
                                    <p className="text-muted-foreground mb-3">{companyName}</p>
                                    <div className="flex items-center gap-3">
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                        <div className="flex items-center gap-1">
                                          <CheckCircle className="w-4 h-4" />
                                          {status}
                                        </div>
                                      </Badge>
                                      <Badge variant="outline">{ipo?.issueType ?? ipo?.issue_type ?? raw?.issueType ?? 'Main IPO'}</Badge>
                                    </div>
                                  </div>
                                  <Building2 className="w-8 h-8 text-muted-foreground" />
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {description}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Issue Price:</span>
                                    <p className="font-medium">₹{Number(ipo?.issuePrice ?? ipo?.issue_price ?? raw?.issuePrice ?? 0) || 0}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Issue Size:</span>
                                    <p className="font-medium">{formatCurrency(issueSize)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Lot Size:</span>
                                    <p className="font-medium">{lotSize} shares</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Face Value:</span>
                                    <p className="font-medium">₹{faceValue}</p>
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
                                      <LocalDate iso={openDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Close:</span>
                                      <LocalDate iso={closeDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Listing:</span>
                                      <LocalDate iso={listingDate ?? undefined} options={{ day: 'numeric', month: 'short', year: 'numeric' }} />
                                    </div>
                                  </div>
                                </div>

                                {listingGains != null && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-800">
                                      <TrendingUp className="w-4 h-4" />
                                      <span className="font-medium">Listing Gains</span>
                                    </div>
                                    <p className="text-green-700 font-bold text-lg">+{listingGains}%</p>
                                  </div>
                                )}

                          <Button onClick={() => router.push(`/ipo/${ipo.id}`)} className="w-full">
  View Details
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
      {/* Details modal */}
{selectedIpo && (
  <div
    role="dialog"
    aria-modal="true"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
  >
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">
          {selectedIpo?.name ?? selectedIpo?.company_name ?? selectedIpo?.companyName}
        </h3>
        <button onClick={closeDetails} className="text-muted-foreground">Close</button>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground">{selectedIpo?.description ?? '—'}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Price Band</div>
            <div className="font-medium">{selectedIpo?.priceBand ?? selectedIpo?.price_band ?? '—'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Issue Price</div>
            <div className="font-medium">₹{Number(selectedIpo?.issuePrice ?? selectedIpo?.issue_price ?? 0)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Lot Size</div>
            <div className="font-medium">{Number(selectedIpo?.lotSize ?? selectedIpo?.lot_size ?? 0)} shares</div>
          </div>
          <div>
            <div className="text-muted-foreground">Issue Size</div>
            <div className="font-medium">{formatCurrency(Number(selectedIpo?.issueSize ?? selectedIpo?.issue_size ?? 0))}</div>
          </div>
        </div>

        <div className="pt-3 border-t flex justify-end gap-2">
          <Button variant="ghost" onClick={closeDetails}>Close</Button>
          <Button onClick={() => {
            // example: forward to apply or details page
            // you can implement apply logic or router.push here
            closeDetails();
            alert('Implement apply/navigation logic here');
          }}>
            Apply / Next
          </Button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
