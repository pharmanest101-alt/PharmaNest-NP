import { useState, useEffect } from 'react'
import { BsFlower1, BsHeart, BsEye, BsPeople, BsShieldCheck, BsTruck, BsHeadset, BsStar, BsGear, BsEnvelope, BsArrowRight } from 'react-icons/bs'
import { supabase, type Feature } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import MagneticButton from '../components/MagneticButton'
import ProductShelf from '../components/ProductShelf'
import SEO from '../components/SEO'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BsShieldCheck, BsTruck, BsHeadset, BsStar, BsHeart, BsEye, BsPeople, BsFlower1, BsGear, BsEnvelope,
}

function getIcon(name: string) {
  return iconMap[name] || BsHeart
}

export default function About() {
  const [values, setValues] = useState<Feature[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [founder, setFounder] = useState<{ name: string; role: string; image_url: string } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [valuesRes, settingsRes, teamRes] = await Promise.all([
        supabase.from('features').select('*').eq('is_active', true).eq('section', 'about').order('display_order'),
        supabase.from('site_settings').select('setting_key, setting_value'),
        supabase.from('team').select('name, role, image_url').eq('is_active', true).order('display_order').limit(1),
      ])
      if (valuesRes.data) setValues(valuesRes.data)
      if (teamRes.data && teamRes.data.length > 0) setFounder(teamRes.data[0])
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
  const mapsLink = s('maps_link', "https://www.google.com/maps/search/?api=1&query=Devi%27s+Fall+Pokhara+Nepal")

  return (
    <div>
      <SEO
        title="About PharmaNest - Premium Skincare Pharmacy | Pokhara, Nepal"
        description="Learn about PharmaNest, Pokhara's trusted skincare pharmacy. Our story, values, and commitment to providing genuine skincare products and expert consultations."
        keywords="about PharmaNest, skincare pharmacy Pokhara, Nepal skincare story, Devi's Fall pharmacy, skincare experts Nepal"
        url="/about"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pb-20">
        <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
          <h1 className="hero-heading text-carbon animate-fade-in-up">
            {s('about_hero_heading', 'About PharmaNest')}
          </h1>
          <p className="text-[19px] md:text-[21px] text-inksoft mt-7 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            {s('about_hero_subtitle', "Pokhara's skincare pharmacy in Devi's Fall, open Sunday to Friday")}
          </p>
          <div className="mt-9">
            <MagneticButton href="/products" className="btn-primary text-[17px] px-7 py-3.5 inline-flex items-center gap-2.5">
              Explore Products
              <BsArrowRight aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Story - text left, the founder's photograph right */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-wide mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal animation="fade-up">
            <TextReveal text={s('about_story_heading', 'Our Story')} tag="h2" className="section-heading mb-6" />
            <div className="space-y-5 text-[17px] text-inksoft leading-relaxed max-w-xl">
              <p>{s('about_story_p1', 'PharmaNest was born from a simple idea: everyone deserves access to genuine, high-quality skincare products.')}</p>
              <p>{s('about_story_p2', 'We understand that every skin type is unique. That\'s why we don\'t just sell products; we provide personalized skincare solutions.')}</p>
              <p>{s('about_story_p3', 'From cleansers and moisturizers to serums and sunscreens, we stock a carefully curated selection of products.')}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={120}>
            <figure>
              <div className="aspect-square bg-white rounded-card overflow-hidden">
                <img
                  src={founder?.image_url || '/SANDEEP.jpg'}
                  alt={founder ? `${founder.name}, ${founder.role}` : 'Sandeep Poudel, founder of PharmaNest'}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <figcaption className="text-[14px] text-steel mt-3">
                {founder ? `${founder.name} · ${founder.role}` : 'Sandeep Poudel · Founder & Owner'}
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
      </section>

      {/* Values - a two-column list, not a card grid */}
      {values.length > 0 && (
        <section className="bg-white py-24 md:py-28">
          <div className="max-w-wide mx-auto px-5 sm:px-8">
            <ScrollReveal animation="fade-up">
              <div className="max-w-2xl mb-12">
                <TextReveal text={s('about_values_heading', 'Our Values')} tag="h2" className="section-heading" />
                <p className="section-subheading">{s('about_values_subheading', 'What drives everything we do')}</p>
              </div>
            </ScrollReveal>
            <div>
              {values.map((value, i) => {
                const Icon = getIcon(value.icon)
                return (
                  <ScrollReveal key={value.id} animation="fade-up" delay={i * 70}>
                    <div className="py-7 border-t border-hairline first:border-t-0 first:pt-0 grid sm:grid-cols-[minmax(0,20rem)_1fr] gap-x-10 gap-y-2">{/* taste-skill-ignore */}
                      <div className="flex items-start gap-3 min-w-0">
                        <Icon className="text-[19px] text-accent-700 mt-1 shrink-0" aria-hidden="true" />
                        <h3 className="text-[21px] font-semibold text-carbon tracking-[-0.01em]">{value.title}</h3>
                      </div>
                      <p className="text-[16px] text-inksoft leading-relaxed sm:pt-1">{value.description}</p>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* From the shelf - real products, in motion */}
      <ProductShelf heading={s('home_featured_heading', 'From the Shelf')} tileClass="bg-frost" />

      {/* Visit - one field of carbon */}
      <section className="bg-carbon py-24 md:py-32">
        <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <TextReveal
              text={s('about_visit_heading', 'Visit Us Today')}
              tag="h2"
              className="text-[28px] md:text-[40px] font-semibold text-white leading-[1.1] tracking-[-0.02em]"
            />
            <p className="text-[17px] md:text-[19px] text-[#a1a1a6] mt-6 max-w-xl mx-auto leading-relaxed">
              {s('about_visit_body', "Located at the beautiful Devi's Fall area in Pokhara-17. Come experience personalized skincare consultation.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <MagneticButton
                href={mapsLink}
                className="bg-white text-carbon hover:bg-[#f5f5f7] font-medium px-7 py-3.5 rounded-pill text-[17px] transition-colors duration-200 apple-press"
              >
                Get Directions
              </MagneticButton>
              <MagneticButton
                href={`tel:${s('phone', '+9779865489647').replace(/[^0-9+]/g, '')}`}
                className="bg-white/10 hover:bg-white/15 text-white font-medium px-7 py-3.5 rounded-pill text-[17px] transition-colors duration-200 apple-press"
              >
                Call Us
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
