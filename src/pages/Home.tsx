import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsFlower1, BsShieldCheck, BsTruck, BsHeadset, BsStar, BsArrowRight } from 'react-icons/bs'
import { supabase, type Product, type Banner } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'

const features = [
  {
    icon: BsShieldCheck,
    title: 'Authentic Products',
    description: '100% genuine skincare products from trusted brands.',
  },
  {
    icon: BsTruck,
    title: 'Quick Delivery',
    description: 'Fast and reliable delivery across Pokhara Valley.',
  },
  {
    icon: BsHeadset,
    title: 'Expert Consultation',
    description: 'Personalized skincare advice from our specialists.',
  },
  {
    icon: BsStar,
    title: 'Best Prices',
    description: 'Competitive prices with regular offers and discounts.',
  },
]

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [bannerRes, productRes] = await Promise.all([
        supabase.from('banners').select('*').eq('is_active', true).order('display_order'),
        supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(6),
      ])
      if (bannerRes.data) setBanners(bannerRes.data)
      if (productRes.data) setFeaturedProducts(productRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {banners.length > 0 ? (
            banners.map((banner) => (
              <div key={banner.id} className="animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-bold font-display text-gray-900 dark:text-white mb-6 leading-tight">
                  {banner.title.split(' ').map((word, i) => (
                    <span key={i}>
                      {i === banner.title.split(' ').length - 1 ? (
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{word} </span>
                      ) : (
                        <>{word} </>
                      )}
                    </span>
                  ))}
                </h1>
                {banner.subtitle && (
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                    {banner.subtitle}
                  </p>
                )}
                {banner.button_text && (
                  <Link to={banner.button_link || '/products'} className="btn-primary text-lg inline-flex items-center gap-2">
                    {banner.button_text}
                    <BsArrowRight />
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold font-display text-gray-900 dark:text-white mb-6 leading-tight">
                Your Trusted{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Skincare Pharmacy
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                Premium skincare products and expert consultations in the heart of Pokhara, Nepal.
              </p>
              <Link to="/products" className="btn-primary text-lg inline-flex items-center gap-2">
                Explore Products <BsArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <h2 className="section-heading">Why <span className="text-emerald-600">Choose Us</span></h2>
              <p className="section-subheading">Everything you need for perfect skin</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <ScrollReveal key={i} animation="scale-up" delay={i * 100}>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-5">
                    <feature.icon className="text-2xl text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="blur-in">
              <div className="text-center mb-12">
                <h2 className="section-heading">
                  Featured <span className="text-emerald-600">Products</span>
                </h2>
                <p className="section-subheading">Discover our best-selling skincare essentials</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <ScrollReveal key={product.id} animation="flip-up" delay={i * 120}>
                  <div className="card group h-full">
                    <div className="aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <BsFlower1 className="text-6xl text-emerald-300 dark:text-emerald-600" />
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">NPR {product.price}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center mt-10">
                <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                  View All Products <BsArrowRight />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal animation="zoom-in">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
              Ready to Transform Your Skincare Routine?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Visit us at Devi's Fall, Pokhara-17 or explore our products online. Your skin deserves the best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-lg transition-all shadow-lg">
                Shop Now
              </Link>
              <Link to="/about" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-all">
                Learn More
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
