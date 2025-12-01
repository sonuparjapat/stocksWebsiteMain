-- backend/db/schema.sql
CREATE TABLE IF NOT EXISTS ipos (
  id TEXT PRIMARY KEY,
  name TEXT,
  company_name TEXT,
  issue_type TEXT,
  open_date DATE,
  close_date DATE,
  listing_date DATE,
  price_band TEXT,
  issue_price NUMERIC,
  lot_size INTEGER,
  issue_size BIGINT,
  face_value NUMERIC,
  subscription_retail NUMERIC,
  subscription_qib NUMERIC,
  subscription_nii NUMERIC,
  subscription_total NUMERIC,
  status TEXT,
  registrar_name TEXT,
  lead_managers JSONB,
  description TEXT,
  listing_gains NUMERIC,
  raw JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- optional index for faster lookup by status
CREATE INDEX IF NOT EXISTS idx_ipos_status ON ipos(status);
