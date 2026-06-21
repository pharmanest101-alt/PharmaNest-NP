import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key (for admin operations)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase

// Types
export interface Product {
  id: string
  name: string
  description: string
  category: string
  image_url: string
  mrp: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image_url: string
  email: string
  phone: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  image_url: string
  button_text: string
  button_link: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Stat {
  id: string
  label: string
  value: number
  suffix: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Feature {
  id: string
  section: string
  icon: string
  title: string
  description: string
  display_order: number
  is_active: boolean
  created_at: string
}
