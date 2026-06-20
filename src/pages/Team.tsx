import { useState, useEffect } from 'react'
import { BsFlower1, BsEnvelope, BsTelephone } from 'react-icons/bs'
import { supabase, type TeamMember } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import TiltCard from '../components/TiltCard'
import GlowCard from '../components/GlowCard'

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
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <TextReveal
              text={s('team_hero_heading', 'Meet Our Team')}
              tag="h1"
              className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4"
            />
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {s('team_hero_subtitle', 'Passionate skincare experts dedicated to your skin health')}
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-gray-500">Loading team members...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member, i) => (
                <ScrollReveal key={member.id} animation="rotate-in" delay={i * 150}>
                  <TiltCard tiltAmount={10}>
                    <GlowCard glowColor="rgba(16, 185, 129, 0.1)">
                      <div className="card group text-center h-full">
                        <div className="aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
                          {member.image_url ? (
                            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                          ) : (
                            <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                              <BsFlower1 className="text-5xl text-emerald-300 dark:text-emerald-600" />
                            </div>
                          )}
                        </div>
                        <div className="p-8">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                          <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-4">{member.role}</p>
                          {member.bio && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">{member.bio}</p>
                          )}
                          <div className="flex justify-center gap-3">
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="w-10 h-10 bg-gray-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <BsEnvelope className="text-emerald-600 dark:text-emerald-400" />
                              </a>
                            )}
                            {member.phone && (
                              <a href={`tel:${member.phone}`} className="w-10 h-10 bg-gray-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <BsTelephone className="text-emerald-600 dark:text-emerald-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlowCard>
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
