import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsFlower1, BsShieldCheck, BsTruck, BsHeadset, BsStar, BsArrowRight, BsHeart, BsEye, BsPeople, BsGear, BsEnvelope } from 'react-icons/bs'
import { supabase, type Product, type Banner, type Stat, type Feature } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import MagneticButton from '../components/MagneticButton'
import AnimatedCounter from '../components/AnimatedCounter'
import ProductShelf from '../components/ProductShelf'
import SEO, { localBusinessSchema } from '../components/SEO'

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
    }
  }

  const s = (key: string, fallback: string) => settings[key] || fallback
  const banner = banners[0]
  const heroTitle = banner?.title || s('home_hero_heading', 'Your Trusted Skincare Pharmacy')
  const heroSubtitle = banner?.subtitle || s('home_hero_subtitle', 'Premium skincare products and expert consultations in the heart of Pokhara, Nepal.')
  const heroCta = banner?.button_text || s('nav_cta_text', 'Explore Products')
  const heroCtaHref = banner?.button_link || '/products'

  return (
    <div>
      <SEO
        title="PharmaNest - Premium Skincare Pharmacy | Pokhara, Nepal"
        description="PharmaNest is Pokhara's trusted skincare pharmacy in Devi's Fall. Premium skincare products, expert consultations, and personalized care for healthy, glowing skin."
        keywords="skincare pharmacy Pokhara, Nepal skincare, Devi's Fall pharmacy, skincare products Nepal, PharmaNest, premium skincare Nepal, skincare consultation Pokhara"
        url="/"
        structuredData={localBusinessSchema}
      />

      {/* Hero - big type, one action, the shelf of real products below */}
      <section className="pt-28 sm:pt-32 pb-10">
        <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
          <TextReveal
            text={heroTitle}
            tag="h1"
            className="hero-heading text-carbon"
          />
          <p className="text-[19px] md:text-[21px] text-inksoft mt-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            {heroSubtitle}
          </p>
          <p className="text-[15px] text-steel mt-5 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            {s('address', "Devi's Fall, Pokhara-17, Kaski, Nepal")}
          </p>
          <div className="mt-9">
            <MagneticButton
              href={heroCtaHref}
              className="btn-primary text-[17px] px-7 py-3.5 inline-flex items-center gap-2.5"
            >
              {heroCta}
              <BsArrowRight aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>

        {/* The shelf: a slow, endless row of the pharmacy's own products */}
        {featuredProducts.length > 0 && <ProductShelf />}
      </section>

      {/* Stats - a white band under the canvas */}
      {stats.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-wide mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
              {stats.map((stat, i) => (
                <div key={stat.id} className="text-center md:text-left animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="text-[40px] lg:text-[56px] font-semibold text-carbon leading-none">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2000 + i * 300} />
                  </div>
                  <p className="text-[15px] text-steel mt-3">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features - heading left, list right */}
      {features.length > 0 ? (
        <section className="py-24 md:py-32">
          <div className="max-w-wide mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <ScrollReveal animation="fade-up" className="md:sticky md:top-28">
              <TextReveal text={s('home_features_heading', 'Why Choose Us')} tag="h2" className="section-heading" />
              <p className="section-subheading max-w-md">{s('home_features_subheading', 'Everything you need for perfect skin')}</p>
            </ScrollReveal>
            <div className="md:pt-2">
              {features.map((feature, i) => {
                const Icon = getIcon(feature.icon)
                return (
                  <ScrollReveal key={feature.id} animation="fade-up" delay={i * 70}>
                    <div className="py-7 border-t border-hairline first:border-t-0 first:pt-0 flex gap-5">{/* taste-skill-ignore */}
                      <Icon className="text-[21px] text-accent-700 mt-1 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <h3 className="text-[21px] font-semibold text-carbon tracking-[-0.01em]">{feature.title}</h3>
                        <p className="text-[16px] text-inksoft mt-1.5 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      ) : (
        <div className="h-16 md:h-24" aria-hidden="true" />
      )}

      {/* Featured products - photography, no card chrome */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-24 md:py-32">
          <div className="max-w-wide mx-auto px-5 sm:px-8">
            <ScrollReveal animation="fade-up">
              <div className="max-w-2xl">
                <TextReveal text={s('home_featured_heading', 'Featured Products')} tag="h2" className="section-heading" />
                <p className="section-subheading">{s('home_featured_subheading', 'Discover our best-selling skincare essentials')}</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 mt-12">
              {featuredProducts.map((product, i) => (
                <ScrollReveal key={product.id} animation="fade-up" delay={(i % 3) * 70}>
                  <Link
                    to="/products"
                    className="group block focus-visible:outline-2 focus-visible:outline-accent-700 rounded-card"
                  >
                    <div className="aspect-square bg-frost rounded-card overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BsFlower1 className="text-5xl text-hairline" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <p className="text-[14px] text-steel mt-4">{product.category}</p>
                    <h3 className="text-[19px] font-semibold text-carbon mt-1 tracking-[-0.01em] group-hover:text-accent-700 transition-colors duration-200">
                      {product.name}
                    </h3>
                    {product.mrp != null && (
                      <p className="text-[16px] text-carbon mt-1">NPR {product.mrp}</p>
                    )}
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="fade-up" delay={120}>
              <div className="mt-12">
                <MagneticButton href="/products" className="btn-secondary inline-flex items-center gap-2.5">
                  View All Products
                  <BsArrowRight aria-hidden="true" />
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Closing band - one field of carbon */}
      <section className="bg-carbon py-24 md:py-32">
        <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <TextReveal
              text={s('home_cta_heading', 'Ready to Transform Your Skincare Routine?')}
              tag="h2"
              className="text-[28px] md:text-[40px] font-semibold text-white leading-[1.1] tracking-[-0.02em]"
            />
            <p className="text-[17px] md:text-[19px] text-[#a1a1a6] mt-6 max-w-2xl mx-auto leading-relaxed">
              {s('home_cta_body', "Visit us at Devi's Fall, Pokhara-17 or explore our products online. Your skin deserves the best.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <MagneticButton
                href={s('home_cta_button1_link', '/products')}
                className="bg-white text-carbon hover:bg-[#f5f5f7] font-medium px-7 py-3.5 rounded-pill text-[17px] transition-colors duration-200 apple-press"
              >
                {s('home_cta_button1_text', 'Shop Now')}
              </MagneticButton>
              <MagneticButton
                href={s('home_cta_button2_link', '/about')}
                className="bg-white/10 hover:bg-white/15 text-white font-medium px-7 py-3.5 rounded-pill text-[17px] transition-colors duration-200 apple-press"
              >
                {s('home_cta_button2_text', 'Learn More')}
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
