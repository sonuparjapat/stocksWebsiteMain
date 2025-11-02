import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockMarket Pro - Real-time Stock Market Data, IPO Analysis & Investment Insights",
  description: "Your comprehensive platform for stock market analysis, IPO tracking, and investment insights. Get real-time data, expert analysis, and make informed investment decisions.",
  keywords: ["stock market", "IPO", "stocks", "investments", "financial analysis", "market data", "trading", "SME IPO", "mutual funds", "bonds"],
  authors: [{ name: "StockMarket Pro Team" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "StockMarket Pro - Real-time Stock Market Data & Analysis",
    description: "Comprehensive platform for stock market analysis, IPO tracking, and investment insights with real-time data.",
    url: "https://stockmarketpro.com",
    siteName: "StockMarket Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StockMarket Pro - Real-time Stock Market Data & Analysis",
    description: "Comprehensive platform for stock market analysis, IPO tracking, and investment insights with real-time data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
