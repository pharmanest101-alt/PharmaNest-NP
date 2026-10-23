import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsSearch, BsGrid, BsList } from 'react-icons/bs'
import { supabase, type Product } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import SEO from '../components/SEO'

const categories = ['All', 'Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Treatment', 'Baby Care', 'Cream', 'Other']

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

  const chipClass = (active: boolean) =>
    `px-4 py-2 rounded-pill text-[14px] font-medium whitespace-nowrap transition-colors duration-200 apple-press ${
      active ? 'bg-carbon text-white' : 'bg-white text-steel hover:text-carbon border border-hairline'
    }`

  return (
    <div>
      <SEO
        title="Our Products - PharmaNest Skincare Pharmacy | Pokhara, Nepal"
        description="Browse premium skincare products at PharmaNest Pokhara. Cleansers, moisturizers, serums, sunscreens, and more for every skin type."
        keywords="skincare products Nepal, cleanser Pokhara, moisturizer Nepal, serum Pokhara, sunscreen Nepal, skincare shop Pokhara, buy skincare online Nepal"
        url="/products"
      />

      {/* Hero */}
      <section className="pt-32 pb-10">
        <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
          <TextReveal
            text={s('products_hero_heading', 'Our Products')}
            tag="h1"
            className="hero-heading text-carbon"
          />
          <p className="text-[19px] md:text-[21px] text-inksoft mt-7 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            {s('products_hero_subtitle', 'Premium skincare products curated for every skin type')}
          </p>
        </div>
      </section>

      {/* Filters - a solid sticky bar, no glass */}
      <section className="sticky top-16 z-40 bg-white border-b border-hairline py-4">{/* taste-skill-ignore */}
        <div className="max-w-wide mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <BsSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                aria-label="Search products"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={chipClass(activeCategory === cat)}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="hidden md:flex gap-1 bg-frost rounded-pill p-1" data-ui>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-pill transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white text-carbon' : 'text-steel hover:text-carbon'}`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <BsGrid aria-hidden="true" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-pill transition-colors duration-200 ${viewMode === 'list' ? 'bg-white text-carbon' : 'text-steel hover:text-carbon'}`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <BsList aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 md:py-16">
        <div className="max-w-wide mx-auto px-5 sm:px-8">
          {loading ? (
            <div className="text-center py-24">
              <div className="animate-spin w-8 h-8 border-[3px] border-hairline border-t-accent-700 rounded-full mx-auto" role="status" aria-label="Loading" />
              <p className="mt-4 text-[15px] text-steel">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 max-w-md mx-auto">
              <h2 className="text-[28px] font-semibold text-carbon tracking-[-0.02em]">No products found</h2>
              <p className="text-[17px] text-steel mt-3">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10' : 'space-y-4'}>
              {filteredProducts.map((product, i) => (
                <ScrollReveal
                  key={product.id}
                  animation="fade-up"
                  delay={Math.min(i * 60, 360)}
                >
                  {viewMode === 'grid' ? (
                    <div className="group">
                      <div className="aspect-square bg-white rounded-card overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            loading={i < 6 ? 'eager' : 'lazy'}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full bg-frost" />
                        )}
                      </div>
                      <p className="text-[14px] text-steel mt-4">{product.category}</p>
                      <h2 className="text-[19px] font-semibold text-carbon mt-1 tracking-[-0.01em]">{product.name}</h2>
                      {product.mrp != null && (
                        <p className="text-[16px] text-carbon mt-1">NPR {product.mrp}</p>
                      )}
                      {product.description && (
                        <p className="text-[16px] text-inksoft mt-2 leading-relaxed line-clamp-2">{product.description}</p>
                      )}
                      <Link
                        to={`/contact?subject=Product Inquiry&message=Is ${encodeURIComponent(product.name)} available?`}
                        className="btn-secondary text-[14px] px-5 py-2.5 mt-4 inline-flex"
                      >
                        Enquire
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white rounded-card border border-hairline overflow-hidden flex flex-col sm:flex-row">{/* taste-skill-ignore */}
                      <div className="sm:w-56 shrink-0 bg-frost">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-48 sm:h-full sm:min-h-[180px] object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 sm:h-full" />
                        )}
                      </div>
                      <div className="p-6 flex-1 min-w-0">
                        <p className="text-[14px] text-steel">{product.category}</p>
                        <h2 className="text-[21px] font-semibold text-carbon mt-1 tracking-[-0.01em]">{product.name}</h2>
                        {product.mrp != null && (
                          <p className="text-[16px] text-carbon mt-1">NPR {product.mrp}</p>
                        )}
                        {product.description && (
                          <p className="text-[16px] text-inksoft mt-2 leading-relaxed line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex justify-end mt-4">
                          <Link
                            to={`/contact?subject=Product Inquiry&message=Is ${encodeURIComponent(product.name)} available?`}
                            className="btn-secondary text-[14px] px-5 py-2.5 inline-flex"
                          >
                            Enquire
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
