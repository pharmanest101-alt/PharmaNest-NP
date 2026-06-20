-- PharmaNest - Full Database Setup for Supabase
-- Run this ENTIRE file in Supabase SQL Editor
-- This creates all tables, inserts default data, sets up RLS, and configures storage.

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'skincare',
  image_url TEXT,
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

-- Site settings table (key-value store for all editable content)
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

-- Stats / Counter section
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  suffix TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Features (Why Choose Us on Home + Our Values on About)
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section TEXT NOT NULL DEFAULT 'home',
  icon TEXT NOT NULL DEFAULT 'BsShieldCheck',
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SEED DATA - Site Settings
-- ============================================================

INSERT INTO site_settings (setting_key, setting_value) VALUES
  -- General
  ('site_name', 'PharmaNest'),
  ('site_tagline', 'Your Trusted Skincare Pharmacy'),
  ('site_description', 'Premium skincare products and expert consultations in Pokhara, Nepal.'),
  ('brand_name', 'PharmaNest'),
  ('owner', 'Sandeep Poudel'),

  -- Contact
  ('address', 'Devi''s Fall, Pokhara-17, Kaski, Nepal'),
  ('phone', '+977-9865489647'),
  ('email', 'pharmanest101@gmail.com'),
  ('opening_hours', 'Sun-Fri: 9:00 AM - 8:00 PM, Sat: 10:00 AM - 6:00 PM'),

  -- Social
  ('facebook', ''),
  ('instagram', 'https://www.instagram.com/pharmanest.np/'),
  ('tiktok', 'https://www.tiktok.com/@pharmanest.np'),

  -- Maps
  ('maps_link', 'https://www.google.com/maps/place/PharmaNest+Skin+Care+%7C+Baby+Care/@28.1902873,83.9552205,17z/data=!3m1!4b1!4m6!3m5!1s0x399595d83afaf09f:0xe9cd9f1b0e0252da!8m2!3d28.1902826!4d83.9577954!16s%2Fg%2F11z4754zb4?entry=ttu'),

  -- Navbar
  ('nav_cta_text', 'Shop Now'),
  ('nav_cta_link', '/products'),

  -- Footer
  ('footer_description', 'Your trusted skincare pharmacy in the heart of Pokhara. We provide premium skincare products and expert consultations to help you achieve healthy, glowing skin.'),

  -- Home page
  ('home_hero_heading', 'Your Trusted Skincare Pharmacy'),
  ('home_hero_subtitle', 'Premium skincare products and expert consultations in the heart of Pokhara, Nepal.'),
  ('home_features_heading', 'Why Choose Us'),
  ('home_features_subheading', 'Everything you need for perfect skin'),
  ('home_featured_heading', 'Featured Products'),
  ('home_featured_subheading', 'Discover our best-selling skincare essentials'),
  ('home_cta_heading', 'Ready to Transform Your Skincare Routine?'),
  ('home_cta_body', 'Visit us at Devi''s Fall, Pokhara-17 or explore our products online. Your skin deserves the best.'),
  ('home_cta_button1_text', 'Shop Now'),
  ('home_cta_button1_link', '/products'),
  ('home_cta_button2_text', 'Learn More'),
  ('home_cta_button2_link', '/about'),

  -- About page
  ('about_hero_heading', 'About PharmaNest'),
  ('about_hero_subtitle', 'Your trusted skincare pharmacy in Pokhara, Nepal'),
  ('about_story_heading', 'Our Story'),
  ('about_story_p1', 'PharmaNest was born from a simple idea: everyone deserves access to genuine, high-quality skincare products. Located in the beautiful city of Pokhara, at the scenic Devi''s Fall area in Ward No. 17, we have become a trusted name in skincare pharmacy.'),
  ('about_story_p2', 'We understand that every skin type is unique. That''s why we don''t just sell products — we provide personalized skincare solutions. Our knowledgeable team helps you find the right products for your specific needs, whether you''re dealing with acne, aging, sensitivity, or simply want to maintain healthy, glowing skin.'),
  ('about_story_p3', 'From cleansers and moisturizers to serums and sunscreens, we stock a carefully curated selection of products from reputable brands that meet our strict quality standards.'),
  ('about_values_heading', 'Our Values'),
  ('about_values_subheading', 'What drives everything we do'),
  ('about_visit_heading', 'Visit Us Today'),
  ('about_visit_body', 'Located at the beautiful Devi''s Fall area in Pokhara-17. Come experience personalized skincare consultation.'),

  -- Products page
  ('products_hero_heading', 'Our Products'),
  ('products_hero_subtitle', 'Premium skincare products curated for every skin type'),

  -- Team page
  ('team_hero_heading', 'Meet Our Team'),
  ('team_hero_subtitle', 'Passionate skincare experts dedicated to your skin health')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================
-- 4. SEED DATA - Banners
-- ============================================================

INSERT INTO banners (title, subtitle, button_text, button_link, display_order) VALUES
  ('Welcome to PharmaNest', 'Your Trusted Skincare Pharmacy in Pokhara', 'Explore Products', '/products', 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. SEED DATA - Stats
-- ============================================================

INSERT INTO stats (label, value, suffix, display_order) VALUES
  ('Happy Customers', 5000, '+', 1),
  ('Products Sold', 10000, '+', 2),
  ('Years Experience', 5, '+', 3),
  ('5-Star Reviews', 500, '+', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. SEED DATA - Features (Why Choose Us - Home)
-- ============================================================

INSERT INTO features (section, icon, title, description, display_order) VALUES
  ('home', 'BsShieldCheck', 'Authentic Products', '100% genuine skincare products from trusted brands.', 1),
  ('home', 'BsTruck', 'Quick Delivery', 'Fast and reliable delivery across Pokhara Valley.', 2),
  ('home', 'BsHeadset', 'Expert Consultation', 'Personalized skincare advice from our specialists.', 3),
  ('home', 'BsStar', 'Best Prices', 'Competitive prices with regular offers and discounts.', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. SEED DATA - Features (Our Values - About)
-- ============================================================

INSERT INTO features (section, icon, title, description, display_order) VALUES
  ('about', 'BsHeart', 'Care First', 'We prioritize your skin health with personalized recommendations and genuine products.', 1),
  ('about', 'BsEye', 'Transparency', 'Honest pricing, authentic products, and clear information about every item we sell.', 2),
  ('about', 'BsPeople', 'Community', 'Serving the Pokhara community with dedication and building lasting relationships.', 3),
  ('about', 'BsFlower1', 'Excellence', 'Curating only the best skincare solutions from trusted global and local brands.', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key can read)
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read team" ON team FOR SELECT USING (is_active = true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (is_active = true);
CREATE POLICY "Public read features" ON features FOR SELECT USING (is_active = true);

-- Public insert for contact form
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Admin full access (service role key bypasses RLS, but these are fallback)
CREATE POLICY "Admin all products" ON products FOR ALL USING (true);
CREATE POLICY "Admin all team" ON team FOR ALL USING (true);
CREATE POLICY "Admin all settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Admin all messages" ON messages FOR ALL USING (true);
CREATE POLICY "Admin all banners" ON banners FOR ALL USING (true);
CREATE POLICY "Admin all stats" ON stats FOR ALL USING (true);
CREATE POLICY "Admin all features" ON features FOR ALL USING (true);

-- ============================================================
-- 9. STORAGE - Create images bucket
-- ============================================================

-- Create the storage bucket (run in Supabase Dashboard > Storage, or here)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
-- Allow public read access to the images bucket
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow anyone to upload to the images bucket (admin uses service role)
CREATE POLICY "Insert images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Allow delete from images bucket
CREATE POLICY "Delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');

-- ============================================================
-- DONE! All tables, data, RLS, and storage are configured.
-- ============================================================
