import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsFlower1, BsSearch, BsGrid, BsList } from 'react-icons/bs'
import { supabase, type Product } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import TiltCard from '../components/TiltCard'

const categories = ['All', 'Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Mask', 'Treatment', 'Baby Care', 'Cream', 'Other']

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, activeCategory, searchQuery])

  async function fetchProducts() {
    try {
      const [productsRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('site_settings').select('setting_key, setting_value'),
      ])
      if (productsRes.data) setProducts(productsRes.data)
      if (settingsRes.data) {
        const map: Record<string, string> = {}
        settingsRes.data.forEach((s) => { map[s.setting_key] = s.setting_value || '' })
        setSettings(map)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterProducts() {
    let result = [...products]
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase())
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    setFilteredProducts(result)
  }

  const s = (key: string, fallback: string) => settings[key] || fallback

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-10 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <TextReveal
              text={s('products_hero_heading', 'Our Products')}
              tag="h1"
              className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4"
            />
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {s('products_hero_subtitle', 'Premium skincare products curated for every skin type')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <ScrollReveal animation="fade-down" threshold={0.01}>
        <section className="py-8 sticky top-20 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 apple-press ${
                      activeCategory === cat
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
                >
                  <BsGrid className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}
                >
                  <BsList className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <BsFlower1 className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredProducts.map((product, i) => (
                <ScrollReveal
                  key={product.id}
                  animation={viewMode === 'grid' ? 'scale-up' : 'fade-left'}
                  delay={Math.min(i * 80, 400)}
                >
                  <TiltCard tiltAmount={viewMode === 'grid' ? 8 : 4}>
                    <div
                      className={viewMode === 'grid' ? 'card group h-full' : 'card group flex flex-col md:flex-row h-full'}
                    >
                      <div className={`${viewMode === 'grid' ? 'aspect-square' : 'w-full md:w-64 aspect-square md:aspect-auto'} bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0`}>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        ) : (
                          <BsFlower1 className="text-6xl text-emerald-300 dark:text-emerald-600" />
                        )}
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">{product.category}</p>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex items-center justify-end">
                          <Link
                            to={`/contact?subject=Product Inquiry&message=Is ${encodeURIComponent(product.name)} available?`}
                            className="btn-primary text-sm apple-press"
                          >
                            Enquire
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
