'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Bell, User, TrendingUp, Home, Newspaper, MessageSquare, Star, Building2, DollarSign, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface StockTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'IPOs', href: '/ipo', icon: TrendingUp },
  { name: 'SME IPOs', href: '/sme-ipo', icon: Building2 },
  { name: 'Stocks', href: '/stocks', icon: BarChart3 },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Forum', href: '/forum', icon: MessageSquare },
  { name: 'Brokers', href: '/brokers', icon: Star },
  { name: 'Mutual Funds', href: '/mutual-funds', icon: DollarSign },
];

const secondaryNav = [
  { name: 'Buybacks', href: '/buybacks' },
  { name: 'Rights Issues', href: '/rights-issues' },
  { name: 'Bonds', href: '/bonds' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tickerData, setTickerData] = useState<StockTicker[]>([]);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate ticker data
    const mockTickerData: StockTicker[] = [
      { symbol: 'AAPL', price: 175.43, change: 2.34, changePercent: 1.35 },
      { symbol: 'GOOGL', price: 2847.52, change: -15.23, changePercent: -0.53 },
      { symbol: 'MSFT', price: 378.91, change: 5.67, changePercent: 1.52 },
      { symbol: 'AMZN', price: 3456.78, change: 12.45, changePercent: 0.36 },
      { symbol: 'TSLA', price: 234.56, change: -3.21, changePercent: -1.35 },
      { symbol: 'META', price: 487.23, change: 8.90, changePercent: 1.86 },
      { symbol: 'NVDA', price: 876.54, change: 15.32, changePercent: 1.78 },
      { symbol: 'JPM', price: 156.78, change: -1.23, changePercent: -0.78 },
    ];
    setTickerData(mockTickerData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (!isTickerPaused) {
        setTickerData(prev => prev.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 0.5,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1
        })));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTickerPaused]);

  return (
    <>
      {/* Stock Ticker */}
      <div 
        className="bg-slate-900 text-white py-2 overflow-hidden relative"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
      >
        <div className="flex items-center space-x-8 animate-ticker whitespace-nowrap">
          {tickerData.map((stock, index) => (
            <div key={stock.symbol} className="flex items-center space-x-2 text-sm">
              <span className="font-semibold">{stock.symbol}</span>
              <span>${stock.price.toFixed(2)}</span>
              <Badge 
                variant={stock.change >= 0 ? "default" : "destructive"}
                className={cn(
                  "text-xs",
                  stock.change >= 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                )}
              >
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-lg"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StockMarket Pro
                </span>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 300 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="hidden md:block"
                  >
                    <Input
                      placeholder="Search stocks, news..."
                      className="w-full"
                      autoFocus
                      onBlur={() => setIsSearchOpen(false)}
                    />
                  </motion.div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden md:flex"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                )}
              </AnimatePresence>

              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="w-4 h-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs">3</Badge>
              </Button>

              {/* User */}
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex items-center space-x-2 pb-4 border-b">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-bold">StockMarket Pro</span>
                    </div>
                    
                    <div className="space-y-2">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </a>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">More</h3>
                      <div className="space-y-2">
                        {secondaryNav.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="block px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}