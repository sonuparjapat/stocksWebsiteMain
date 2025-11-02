'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const footerSections = [
  {
    title: 'Markets',
    links: [
      { name: 'IPOs', href: '/ipo' },
      { name: 'SME IPOs', href: '/sme-ipo' },
      { name: 'Stocks', href: '/stocks' },
      { name: 'Mutual Funds', href: '/mutual-funds' },
      { name: 'Bonds', href: '/bonds' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ]
  },
  {
    title: 'Connect',
    links: [
      { name: 'Community Forum', href: '/forum' },
      { name: 'Newsletter', href: '/newsletter' },
      { name: 'Mobile Apps', href: '/apps' },
      { name: 'Broker Reviews', href: '/brokers' },
      { name: 'Advertise', href: '/advertise' },
    ]
  }
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h3 className="text-2xl font-bold mb-2">Stay Updated with Market Insights</h3>
              <p className="text-slate-300 mb-6">
                Get daily market analysis, IPO updates, and investment tips delivered to your inbox.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Subscribe
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">StockMarket Pro</span>
            </div>
            <p className="text-slate-300 mb-6 text-sm">
              Your comprehensive platform for stock market analysis, IPO tracking, and investment insights. 
              Make informed decisions with real-time data and expert analysis.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <social.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-300 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-slate-400"
          >
            © 2024 StockMarket Pro. All rights reserved.
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center space-x-6 text-sm text-slate-400"
          >
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>support@stockmarketpro.com</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>New York, NY</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}