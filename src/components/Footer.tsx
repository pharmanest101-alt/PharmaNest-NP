import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsWhatsapp, BsTelephone, BsEnvelope, BsGeoAlt } from 'react-icons/bs'
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
  const brandName = s('brand_name', s('site_name', 'PharmaNest'))

  const socials = [
    { key: 'facebook', href: s('facebook', ''), label: 'Facebook', icon: <BsFacebook size={18} /> },
    { key: 'instagram', href: s('instagram', ''), label: 'Instagram', icon: <BsInstagram size={18} /> },
    {
      key: 'tiktok',
      href: s('tiktok', ''),
      label: 'TikTok',
      icon: (
        <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.18z" />
        </svg>
      ),
    },
    {
      key: 'whatsapp',
      href: s('whatsapp', '') ? `https://wa.me/${s('whatsapp', '').replace(/[^0-9]/g, '')}` : '',
      label: 'WhatsApp',
      icon: <BsWhatsapp size={18} />,
    },
  ].filter((item) => item.href)

  return (
    <footer className="bg-white border-t border-hairline">{/* taste-skill-ignore */}
      <div className="max-w-wide mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <ScrollReveal animation="fade-up" className="md:col-span-2 min-w-0">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.jpg" alt="" aria-hidden="true" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-[17px] font-semibold text-carbon">{brandName}</span>
            </Link>
            <p className="text-inksoft text-[16px] leading-relaxed max-w-sm mb-6">
              {s('footer_description', 'Your trusted skincare pharmacy in the heart of Pokhara. We provide premium skincare products and expert consultations to help you achieve healthy, glowing skin.')}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-frost hover:bg-accent-50 text-carbon hover:text-accent-700 rounded-card flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* Quick links */}
          <ScrollReveal animation="fade-up" delay={80} className="min-w-0">
            <h3 className="text-[14px] font-semibold text-carbon mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Products', path: '/products' },
                { name: 'Our Team', path: '/team' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-[16px] text-inksoft hover:text-accent-700 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal animation="fade-up" delay={160} className="min-w-0">
            <h3 className="text-[14px] font-semibold text-carbon mb-4">Contact Us</h3>
            <ul className="space-y-3 text-[16px] text-inksoft">
              <li className="flex items-start gap-2.5">
                <BsGeoAlt className="text-accent-700 mt-1 shrink-0" aria-hidden="true" />
                <span className="break-words">{s('address', "Devi's Fall, Pokhara-17, Kaski, Nepal")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <BsTelephone className="text-accent-700 shrink-0" aria-hidden="true" />
                <a href={`tel:${s('phone', '+977-9865489647').replace(/[^0-9+]/g, '')}`} className="min-w-0 break-words hover:text-accent-700 transition-colors duration-200">
                  {s('phone', '+977-9865489647')}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <BsEnvelope className="text-accent-700 shrink-0" aria-hidden="true" />
                <a href={`mailto:${s('email', 'pharmanest101@gmail.com')}`} className="min-w-0 break-words hover:text-accent-700 transition-colors duration-200">
                  {s('email', 'pharmanest101@gmail.com')}
                </a>
              </li>
            </ul>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="fade-up" delay={240}>
          <div className="border-t border-hairline mt-12 pt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[14px] text-steel">{/* taste-skill-ignore */}
            <p className="break-words">&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
            <p className="break-words">
              Managed by{' '}
              <a href="https://veltriontech.vercel.app" className="text-carbon hover:text-accent-700 font-medium transition-colors duration-200">
                Veltrion
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
