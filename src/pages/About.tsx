import { useState, useEffect } from 'react'
import { BsFlower1, BsHeart, BsEye, BsPeople, BsShieldCheck, BsTruck, BsHeadset, BsStar, BsGear, BsEnvelope } from 'react-icons/bs'
import { supabase, type Feature } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import MagneticButton from '../components/MagneticButton'
import TiltCard from '../components/TiltCard'
import GlowCard from '../components/GlowCard'
import ParallaxSection from '../components/ParallaxSection'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BsShieldCheck, BsTruck, BsHeadset, BsStar, BsHeart, BsEye, BsPeople, BsFlower1, BsGear, BsEnvelope,
}

function getIcon(name: string) {
  return iconMap[name] || BsHeart
}

export default function About() {
  const [values, setValues] = useState<Feature[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [valuesRes, settingsRes] = await Promise.all([
        supabase.from('features').select('*').eq('is_active', true).eq('section', 'about').order('display_order'),
        supabase.from('site_settings').select('setting_key, setting_value'),
      ])
      if (valuesRes.data) setValues(valuesRes.data)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4 animate-fade-in-up">
              {s('about_hero_heading', 'About PharmaNest')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {s('about_hero_subtitle', 'Your trusted skincare pharmacy in Pokhara, Nepal')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal animation="fade-right">
              <TextReveal text={s('about_story_heading', 'Our Story')} tag="h2" className="section-heading mb-6" />
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>{s('about_story_p1', 'PharmaNest was born from a simple idea: everyone deserves access to genuine, high-quality skincare products.')}</p>
                <p>{s('about_story_p2', 'We understand that every skin type is unique. That\'s why we don\'t just sell products — we provide personalized skincare solutions.')}</p>
                <p>{s('about_story_p3', 'From cleansers and moisturizers to serums and sunscreens, we stock a carefully curated selection of products.')}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="flip-left" delay={200}>
              <ParallaxSection speed={0.1}>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl flex items-center justify-center overflow-hidden apple-scale-reveal is-visible">
                    <img src="/logo.jpg" alt="PharmaNest Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
              </ParallaxSection>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      {values.length > 0 && (
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in">
            <div className="text-center mb-12">
              <TextReveal text={s('about_values_heading', 'Our Values')} tag="h2" className="section-heading" />
              <p className="section-subheading">{s('about_values_subheading', 'What drives everything we do')}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => {
              const Icon = getIcon(value.icon)
              return (
                <ScrollReveal key={value.id} animation="bounce-in" delay={i * 120}>
                  <TiltCard tiltAmount={12}>
                    <GlowCard glowColor="rgba(16, 185, 129, 0.12)">
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 text-center hover:shadow-xl transition-shadow duration-300 h-full">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                          <Icon className="text-2xl text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
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

      {/* Location */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="slide-up-big">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-10 md:p-16 text-center text-white">
              <TextReveal
                text={s('about_visit_heading', 'Visit Us Today')}
                tag="h2"
                className="text-3xl md:text-4xl font-bold font-display mb-4"
              />
              <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
                {s('about_visit_body', "Located at the beautiful Devi's Fall area in Pokhara-17. Come experience personalized skincare consultation.")}
              </p>
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <MagneticButton as="a" href={s('maps_link', '#')} className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-lg transition-all shadow-lg apple-press">
                  Get Directions
                </MagneticButton>
                <MagneticButton as="a" href={`tel:${s('phone', '+9779865489647')}`} className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-all apple-press">
                  Call Us
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
