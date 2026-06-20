import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsInstagram, BsTelephone, BsEnvelope, BsGeoAlt } from 'react-icons/bs'
import { supabase } from '../lib/supabase'
import ScrollReveal from './ScrollReveal'

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('setting_key, setting_value')
    if (data) {
      const map: Record<string, string> = {}
      data.forEach((s) => { map[s.setting_key] = s.setting_value || '' })
      setSettings(map)
    }
  }

  const s = (key: string, fallback: string) => settings[key] || fallback
  const brandName = s('brand_name', 'PharmaNest')

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <ScrollReveal animation="fade-up" className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt={brandName} className="h-10 w-auto rounded-lg" />
              <span className="text-xl font-bold font-display text-blue-300">{brandName}</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              {s('footer_description', 'Your trusted skincare pharmacy in the heart of Pokhara. We provide premium skincare products and expert consultations to help you achieve healthy, glowing skin.')}
            </p>
            <div className="flex gap-3">
              {s('instagram', '') && (
                <a href={s('instagram', '#')} target="_blank" rel="noopener" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <BsInstagram />
                </a>
              )}
              {s('tiktok', '') && (
                <a href={s('tiktok', '#')} target="_blank" rel="noopener" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.18z"/></svg>
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Quick Links */}
          <ScrollReveal animation="fade-up" delay={100}>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Products', path: '/products' },
                { name: 'Our Team', path: '/team' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-emerald-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal animation="fade-up" delay={200}>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <BsGeoAlt className="text-emerald-400 mt-1 flex-shrink-0" />
                <span>{s('address', "Devi's Fall, Pokhara-17, Kaski, Nepal")}</span>
              </li>
              <li className="flex items-center gap-2">
                <BsTelephone className="text-emerald-400 flex-shrink-0" />
                <span>{s('phone', '+977-9865489647')}</span>
              </li>
              <li className="flex items-center gap-2">
                <BsEnvelope className="text-emerald-400 flex-shrink-0" />
                <span>{s('email', 'pharmanest101@gmail.com')}</span>
              </li>
            </ul>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="fade-up" delay={300}>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
