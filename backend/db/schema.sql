-- Database Schema for Stock Market Website

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for future authentication and comments)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    isin VARCHAR(12) UNIQUE,
    sector VARCHAR(100),
    industry VARCHAR(100),
    description TEXT,
    website VARCHAR(500),
    logo_url VARCHAR(500),
    market_cap BIGINT,
    employee_count INTEGER,
    founded_year INTEGER,
    headquarters VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stocks table
CREATE TABLE stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    exchange VARCHAR(50) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    current_price DECIMAL(15, 2),
    previous_close DECIMAL(15, 2),
    open DECIMAL(15, 2),
    high DECIMAL(15, 2),
    low DECIMAL(15, 2),
    volume BIGINT,
    market_cap BIGINT,
    pe_ratio DECIMAL(10, 2),
    eps DECIMAL(10, 2),
    dividend_yield DECIMAL(10, 2),
    beta DECIMAL(10, 2),
    week_52_high DECIMAL(15, 2),
    week_52_low DECIMAL(15, 2),
    avg_volume BIGINT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stock price history for charts
CREATE TABLE stock_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_id UUID REFERENCES stocks(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    open DECIMAL(15, 2),
    high DECIMAL(15, 2),
    low DECIMAL(15, 2),
    close DECIMAL(15, 2),
    volume BIGINT,
    adjusted_close DECIMAL(15, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stock_id, date)
);

-- IPOs table
CREATE TABLE ipos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    ipo_name VARCHAR(255) NOT NULL,
    issue_type VARCHAR(50) NOT NULL, -- 'Main IPO', 'SME IPO'
    open_date DATE,
    close_date DATE,
    listing_date DATE,
    price_band_min DECIMAL(15, 2),
    price_band_max DECIMAL(15, 2),
    issue_price DECIMAL(15, 2),
    lot_size INTEGER,
    issue_size BIGINT,
    face_value DECIMAL(10, 2),
    listing_gains DECIMAL(10, 2),
    subscription_retail DECIMAL(10, 2),
    subscription_qib DECIMAL(10, 2),
    subscription_nii DECIMAL(10, 2),
    subscription_total DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Upcoming', -- 'Upcoming', 'Open', 'Closed', 'Listed'
    registrar_name VARCHAR(255),
    lead_managers TEXT[],
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buybacks table
CREATE TABLE buybacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    open_date DATE,
    close_date DATE,
    buyback_price DECIMAL(15, 2),
    buyback_size BIGINT,
    buyback_method VARCHAR(100),
    record_date DATE,
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'Upcoming',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rights Issues table
CREATE TABLE rights_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    open_date DATE,
    close_date DATE,
    rights_price DECIMAL(15, 2),
    issue_size BIGINT,
    ratio VARCHAR(50),
    record_date DATE,
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'Upcoming',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bonds table
CREATE TABLE bonds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    bond_type VARCHAR(100),
    face_value DECIMAL(15, 2),
    coupon_rate DECIMAL(10, 2),
    maturity_date DATE,
    issue_date DATE,
    credit_rating VARCHAR(20),
    yield_to_maturity DECIMAL(10, 2),
    current_price DECIMAL(15, 2),
    isin VARCHAR(12) UNIQUE,
    status VARCHAR(50) DEFAULT 'Active',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mutual Funds table
CREATE TABLE mutual_funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    fund_house VARCHAR(255) NOT NULL,
    fund_type VARCHAR(100),
    category VARCHAR(100),
    nav DECIMAL(15, 2),
    nav_date DATE,
    expense_ratio DECIMAL(10, 2),
    min_investment DECIMAL(15, 2),
    fund_manager VARCHAR(255),
    inception_date DATE,
    aum BIGINT,
    returns_1y DECIMAL(10, 2),
    returns_3y DECIMAL(10, 2),
    returns_5y DECIMAL(10, 2),
    risk_level VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News articles table
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    summary TEXT,
    content TEXT,
    author VARCHAR(255),
    source VARCHAR(255),
    category VARCHAR(100),
    image_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0
);

-- Brokers table
CREATE TABLE brokers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    description TEXT,
    established_year INTEGER,
    headquarters VARCHAR(255),
    account_opening_fee DECIMAL(10, 2),
    annual_maintenance DECIMAL(10, 2),
    brokerage_equity DECIMAL(10, 2),
    brokerage_futures DECIMAL(10, 2),
    brokerage_options DECIMAL(10, 2),
    brokerage_currency DECIMAL(10, 2),
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Broker reviews table
CREATE TABLE broker_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review TEXT,
    pros TEXT,
    cons TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Discussion forum threads
CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100),
    tags TEXT[],
    is_sticky BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum replies
CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_stocks_company_id ON stocks(company_id);
CREATE INDEX idx_stocks_symbol ON stocks(symbol);
CREATE INDEX idx_stock_prices_stock_id_date ON stock_prices(stock_id, date);
CREATE INDEX idx_ipos_company_id ON ipos(company_id);
CREATE INDEX idx_ipos_status ON ipos(status);
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_forum_threads_category ON forum_threads(category);
CREATE INDEX idx_forum_threads_created_at ON forum_threads(created_at DESC);
CREATE INDEX idx_forum_replies_thread_id ON forum_replies(thread_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stocks_updated_at BEFORE UPDATE ON stocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ipos_updated_at BEFORE UPDATE ON ipos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buybacks_updated_at BEFORE UPDATE ON buybacks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rights_issues_updated_at BEFORE UPDATE ON rights_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bonds_updated_at BEFORE UPDATE ON bonds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mutual_funds_updated_at BEFORE UPDATE ON mutual_funds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON brokers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_broker_reviews_updated_at BEFORE UPDATE ON broker_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON forum_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();