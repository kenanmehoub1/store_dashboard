-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(191) NOT NULL,
  price_usd DOUBLE PRECISION NOT NULL,
  price_syp DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS so anon key can access (for simplicity in local dev)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
