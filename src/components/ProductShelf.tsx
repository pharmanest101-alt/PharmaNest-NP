import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsFlower1 } from 'react-icons/bs'
import { supabase, type Product } from '../lib/supabase'

interface ProductShelfProps {
  /** When set, renders as a white band with this heading; otherwise a bare row (hero use) */
  heading?: string
  limit?: number
  /** Tile surface - frost on a white band, white on the frost canvas */
  tileClass?: string
}

/**
 * The shelf: one slow, endless row of the pharmacy's own product photography.
 * The site's one moving picture - pauses on hover, static under reduced motion.
 */
export default function ProductShelf({ heading, limit = 8, tileClass = 'bg-white' }: ProductShelfProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        if (!cancelled && data) setProducts(data)
      })
    return () => { cancelled = true }
  }, [limit])

  if (products.length === 0) return null

  const row = (
    <div className="shelf overflow-hidden" aria-label="Products we carry">
      <div className="shelf-track flex w-max">
        {[...products, ...products].map((product, i) => (
          <Link
            key={`${product.id}-${i}`}
            to="/products"
            className="group w-[180px] sm:w-[240px] mr-3 sm:mr-4 shrink-0 animate-fade-in-up"
            style={{ animationDelay: `${(i % products.length) * 60}ms` }}
            tabIndex={i < products.length ? 0 : -1}
            aria-hidden={i >= products.length}
          >
            <div className={`aspect-square ${tileClass} rounded-card overflow-hidden`}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading={i < products.length ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BsFlower1 className="text-4xl text-hairline" aria-hidden="true" />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  if (!heading) return <div className="mt-14">{row}</div>

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-wide mx-auto px-5 sm:px-8 mb-8">
        <h2 className="section-heading">{heading}</h2>
      </div>
      {/* Inset within the content margins so the shelf sits on the page's grid */}
      <div className="max-w-wide mx-auto px-5 sm:px-8 overflow-hidden">
        {row}
      </div>
    </section>
  )
}
