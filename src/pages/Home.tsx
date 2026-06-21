import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsFlower1, BsShieldCheck, BsTruck, BsHeadset, BsStar, BsArrowRight, BsHeart, BsEye, BsPeople, BsGear, BsEnvelope } from 'react-icons/bs'
import { supabase, type Product, type Banner, type Stat, type Feature } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import MagneticButton from '../components/MagneticButton'
import TiltCard from '../components/TiltCard'
import GlowCard from '../components/GlowCard'
import AnimatedCounter from '../components/AnimatedCounter'
import ParallaxSection from '../components/ParallaxSection'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BsShieldCheck, BsTruck, BsHeadset, BsStar, BsHeart, BsEye, BsPeople, BsFlower1, BsGear, BsEnvelope,
}

function getIcon(name: string) {
  return iconMap[name] || BsShieldCheck
}

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [bannerRes, productRes, statsRes, featuresRes, settingsRes] = await Promise.all([
        supabase.from('banners').select('*').eq('is_active', true).order('display_order'),
        supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('stats').select('*').eq('is_active', true).order('display_order'),
        supabase.from('features').select('*').eq('is_active', true).eq('section', 'home').order('display_order'),
        supabase.from('site_settings').select('setting_key, setting_value'),
      ])
      if (bannerRes.data) setBanners(bannerRes.data)
      if (productRes.data) setFeaturedProducts(productRes.data)
      if (statsRes.data) setStats(statsRes.data)
      if (featuresRes.data) setFeatures(featuresRes.data)
      if (settingsRes.data) {
        const map: Record<string, string> = {}
        settingsRes.data.forEach((s) => { map[s.setting_key] = s.setting_value || '' })
        setSettings(map)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const s = (key: string, fallback: string) => settings[key] || fallback

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl apple-float-orb" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl apple-float-orb" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/10 dark:bg-emerald-600/5 rounded-full blur-3xl apple-float-orb" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {banners.length > 0 ? (
            banners.map((banner) => (
              <div key={banner.id}>
                <TextReveal
                  text={banner.title}
                  tag="h1"
                  className="apple-hero-heading text-gray-900 dark:text-white mb-6"
                />
                {banner.subtitle && (
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    {banner.subtitle}
                  </p>
                )}
                {banner.button_text && (
                  <MagneticButton as="a" href={banner.button_link || '/products'} className="btn-primary text-lg inline-flex items-center gap-2 apple-press">
                    {banner.button_text}
                    <BsArrowRight />
                  </MagneticButton>
                )}
              </div>
            ))
          ) : (
            <div>
              <TextReveal
                text={s('home_hero_heading', 'Your Trusted Skincare Pharmacy')}
                tag="h1"
                className="apple-hero-heading text-gray-900 dark:text-white mb-6"
                wordClassName="apple-gradient-text"
              />
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                {s('home_hero_subtitle', 'Premium skincare products and expert consultations in the heart of Pokhara, Nepal.')}
              </p>
              <MagneticButton as="a" href="/products" className="btn-primary text-lg inline-flex items-center gap-2 apple-press">
                {s('nav_cta_text', 'Explore Products')} <BsArrowRight />
              </MagneticButton>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.id} animation="scale-up" delay={i * 100}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold font-display text-emerald-600 dark:text-emerald-400 mb-2">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2000 + i * 300} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Features */}
      {features.length > 0 && (
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <TextReveal text={s('home_features_heading', 'Why Choose Us')} tag="h2" className="section-heading" />
              <p className="section-subheading">{s('home_features_subheading', 'Everything you need for perfect skin')}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = getIcon(feature.icon)
              return (
                <ScrollReveal key={feature.id} animation="scale-up" delay={i * 100}>
                  <TiltCard tiltAmount={10}>
                    <GlowCard glowColor="rgba(16, 185, 129, 0.1)">
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300 h-full">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-5">
                          <Icon className="text-2xl text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </GlowCard>
                  </TiltCard>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="blur-in">
              <div className="text-center mb-12">
                <TextReveal text={s('home_featured_heading', 'Featured Products')} tag="h2" className="section-heading" />
                <p className="section-subheading">{s('home_featured_subheading', 'Discover our best-selling skincare essentials')}</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <ScrollReveal key={product.id} animation="flip-up" delay={i * 120}>
                  <TiltCard tiltAmount={8}>
                    <div className="card group h-full">
                      <div className="aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        ) : (
                          <BsFlower1 className="text-6xl text-emerald-300 dark:text-emerald-600" />
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider mb-1">{product.category}</p>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                        {product.mrp != null && (
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">NPR {product.mrp}</p>
                        )}
                        {product.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center mt-10">
                <MagneticButton as="a" href="/products" className="btn-primary inline-flex items-center gap-2 apple-press">
                  View All Products <BsArrowRight />
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Parallax CTA */}
      <ParallaxSection speed={0.15}>
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal animation="zoom-in">
              <TextReveal
                text={s('home_cta_heading', 'Ready to Transform Your Skincare Routine?')}
                tag="h2"
                className="text-3xl md:text-4xl font-bold font-display text-white mb-6"
              />
              <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                {s('home_cta_body', "Visit us at Devi's Fall, Pokhara-17 or explore our products online. Your skin deserves the best.")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton as="a" href={s('home_cta_button1_link', '/products')} className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-lg transition-all shadow-lg apple-press">
                  {s('home_cta_button1_text', 'Shop Now')}
                </MagneticButton>
                <MagneticButton as="a" href={s('home_cta_button2_link', '/about')} className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-all apple-press">
                  {s('home_cta_button2_text', 'Learn More')}
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>
    </div>
  )
}
