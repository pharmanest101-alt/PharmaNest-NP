import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

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

  const brandName = settings.brand_name || settings.site_name || 'PharmaNest'
  const ctaText = settings.nav_cta_text || 'Shop Now'

  const linkClass = (active: boolean) =>
    `px-3 py-2 text-[14px] transition-colors duration-200 ${
      active ? 'text-carbon font-semibold' : 'text-steel hover:text-carbon'
    }`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-[border-color,box-shadow] duration-200 ${
        scrolled ? 'border-b border-hairline' /* taste-skill-ignore */ : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-wide mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.jpg" alt="" aria-hidden="true" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-[17px] font-semibold text-carbon tracking-[-0.01em]">
              {brandName}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(location.pathname === link.path)}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link to="/products" className="hidden md:inline-flex btn-primary text-[14px] px-5 py-2.5">
              {ctaText}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 -mr-2.5 text-carbon apple-press"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-hairline animate-fade-in-up">{/* taste-skill-ignore */}
          <div className="px-5 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 text-[17px] transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-carbon font-semibold'
                    : 'text-steel'
                }`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/products" className="btn-primary block text-center text-[15px] mt-3 mb-2">
              {ctaText}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
