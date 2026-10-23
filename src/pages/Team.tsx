import { useState, useEffect } from 'react'
import { BsEnvelope, BsTelephone, BsArrowRight } from 'react-icons/bs'
import { supabase, type TeamMember } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import MagneticButton from '../components/MagneticButton'
import ProductShelf from '../components/ProductShelf'
import SEO from '../components/SEO'

const defaultMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sandeep Poudel',
    role: 'Founder & Skincare Specialist',
    bio: 'Founder of PharmaNest, dedicated to helping you find the perfect skincare solutions for your unique needs.',
    image_url: '',
    email: 'pharmanest101@gmail.com',
    phone: '+977-9865489647',
    display_order: 1,
    is_active: true,
    created_at: '',
  },
]

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [membersRes, settingsRes] = await Promise.all([
        supabase.from('team').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_settings').select('setting_key, setting_value'),
      ])
      if (membersRes.data && membersRes.data.length > 0) {
        setMembers(membersRes.data)
      } else {
        setMembers(defaultMembers)
      }
      if (settingsRes.data) {
        const map: Record<string, string> = {}
        settingsRes.data.forEach((s) => { map[s.setting_key] = s.setting_value || '' })
        setSettings(map)
      }
    } catch {
      setMembers(defaultMembers)
    } finally {
      setLoading(false)
    }
  }

  const s = (key: string, fallback: string) => settings[key] || fallback

  return (
    <div>
      <SEO
        title="Our Team - PharmaNest Skincare Pharmacy | Pokhara, Nepal"
        description="Meet the passionate skincare experts at PharmaNest in Pokhara. Dedicated to helping you find the perfect skincare solutions for your unique needs."
        keywords="PharmaNest team, skincare experts Pokhara, skincare specialist Nepal, Sandeep Poudel PharmaNest"
        url="/team"
      />

      {/* Hero */}
      <section className="pt-32 pb-14 md:pb-16">
        <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
          <TextReveal
            text={s('team_hero_heading', 'Meet Our Team')}
            tag="h1"
            className="hero-heading text-carbon"
          />
          <p className="text-[19px] md:text-[21px] text-inksoft mt-7 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            {s('team_hero_subtitle', "The skincare specialists behind PharmaNest, our pharmacy in Devi's Fall, Pokhara")}
          </p>
          <div className="mt-9">
            <MagneticButton href="/contact" className="btn-primary text-[17px] px-7 py-3.5 inline-flex items-center gap-2.5">
              Book a Consultation
              <BsArrowRight aria-hidden="true" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-wide mx-auto px-5 sm:px-8">
          {loading ? (
            <div className="text-center py-24">
              <div className="animate-spin w-8 h-8 border-[3px] border-hairline border-t-accent-700 rounded-full mx-auto" role="status" aria-label="Loading" />
              <p className="mt-4 text-[15px] text-steel">Loading team members...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
              {members.map((member, i) => (
                <ScrollReveal key={member.id} animation="fade-up" delay={i * 80}>
                  <figure>
                    {member.image_url ? (
                      <div className="aspect-[4/5] bg-white rounded-card overflow-hidden">
                        <img
                          src={member.image_url}
                          alt={member.name}
                          loading={i < 3 ? 'eager' : 'lazy'}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center" aria-hidden="true">
                        <span className="text-[20px] sm:text-[24px] font-semibold text-silver leading-none">
                          {member.name.trim().charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <figcaption className="mt-5">
                      <h2 className="text-[21px] font-semibold text-carbon tracking-[-0.01em]">{member.name}</h2>
                      <p className="text-[15px] text-steel font-medium mt-1">{member.role}</p>
                      {member.bio && (
                        <p className="text-[16px] text-inksoft mt-3 leading-relaxed">{member.bio}</p>
                      )}
                      {(member.email || member.phone) && (
                        <div className="flex gap-2.5 mt-4">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="w-11 h-11 bg-white hover:bg-frost border border-hairline rounded-card flex items-center justify-center text-carbon apple-press" /* taste-skill-ignore */
                              aria-label={`Email ${member.name}`}
                            >
                              <BsEnvelope aria-hidden="true" />
                            </a>
                          )}
                          {member.phone && (
                            <a
                              href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                              className="w-11 h-11 bg-white hover:bg-frost border border-hairline rounded-card flex items-center justify-center text-carbon apple-press" /* taste-skill-ignore */
                              aria-label={`Call ${member.name}`}
                            >
                              <BsTelephone aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      )}
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* From the shelf - real products, in motion */}
      <ProductShelf heading={s('home_featured_heading', 'From the Shelf')} tileClass="bg-frost" />
    </div>
  )
}
