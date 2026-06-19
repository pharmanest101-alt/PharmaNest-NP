-- PharmaNest Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'skincare',
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  phone TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners / Hero sections
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('site_name', 'PharmaNest'),
  ('site_tagline', 'Your Trusted Skincare Pharmacy'),
  ('site_description', 'Premium skincare products and expert consultations in Pokhara, Nepal.'),
  ('address', 'Devi''s Fall, Pokhara-17, Kaski, Nepal'),
  ('phone', '+977-9800000000'),
  ('email', 'info@pharmanest.com.np'),
  ('facebook', ''),
  ('instagram', ''),
  ('opening_hours', 'Sun-Fri: 9:00 AM - 8:00 PM, Sat: 10:00 AM - 6:00 PM')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default banner
INSERT INTO banners (title, subtitle, button_text, button_link, display_order) VALUES
  ('Welcome to PharmaNest', 'Your Trusted Skincare Pharmacy in Pokhara', 'Explore Products', '/products', 1)
ON CONFLICT DO NOTHING;

-- RLS policies (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read access for public tables
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read team" ON team FOR SELECT USING (is_active = true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Admin full access (using service role key on frontend for admin)
CREATE POLICY "Admin all products" ON products FOR ALL USING (true);
CREATE POLICY "Admin all team" ON team FOR ALL USING (true);
CREATE POLICY "Admin all settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Admin all messages" ON messages FOR ALL USING (true);
CREATE POLICY "Admin all banners" ON banners FOR ALL USING (true);
