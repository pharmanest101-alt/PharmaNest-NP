import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BsSend, BsCheckCircle, BsTelephone, BsEnvelope, BsGeoAlt, BsClock } from 'react-icons/bs'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import MagneticButton from '../components/MagneticButton'
import ProductShelf from '../components/ProductShelf'
import SEO from '../components/SEO'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: searchParams.get('subject') || '',
    message: searchParams.get('message') || '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .then(({ data }) => {
        if (cancelled || !data) return
        const map: Record<string, string> = {}
        data.forEach((s) => { map[s.setting_key] = s.setting_value || '' })
        setSettings(map)
      })
    return () => { cancelled = true }
  }, [])

  const s = (key: string, fallback: string) => settings[key] || fallback
  const phone = s('phone', '+977-9865489647')
  const phoneHref = `tel:${phone.replace(/[^0-9+]/g, '')}`
  const email = s('email', 'pharmanest101@gmail.com')
  const address = s('address', "Devi's Fall, Pokhara-17, Kaski, Nepal")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in name, email, and message')
      return
    }
    setSending(true)
    const { error } = await supabase.from('messages').insert([{
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    }])
    setSending(false)
    if (error) {
      toast.error('Failed to send message. Please try again.')
    } else {
      setSent(true)
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    }
  }

  const details = [
    {
      icon: <BsGeoAlt aria-hidden="true" />,
      title: 'Visit Us',
      body: <span className="break-words">{address}</span>,
    },
    {
      icon: <BsTelephone aria-hidden="true" />,
      title: 'Call Us',
      body: <a href={phoneHref} className="hover:text-accent-700 transition-colors duration-200">{phone}</a>,
    },
    {
      icon: <BsEnvelope aria-hidden="true" />,
      title: 'Email Us',
      body: <a href={`mailto:${email}`} className="hover:text-accent-700 transition-colors duration-200 break-words">{email}</a>,
    },
    {
      icon: <BsClock aria-hidden="true" />,
      title: 'Opening Hours',
      body: (
        <span>
          Sun–Fri: 9:00 AM – 8:00 PM
          <br />
          Sat: 10:00 AM – 6:00 PM
        </span>
      ),
    },
  ]

  return (
    <div>
      <SEO
        title="Contact Us - PharmaNest Skincare Pharmacy | Pokhara, Nepal"
        description="Get in touch with PharmaNest in Pokhara. Visit us at Devi's Fall or call +977-9865489647. We'd love to help with your skincare needs."
        keywords="contact PharmaNest, skincare pharmacy Pokhara, Devi's Fall pharmacy, skincare consultation booking Nepal"
        url="/contact"
      />

      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
          <TextReveal
            text="Contact Us"
            tag="h1"
            className="hero-heading text-carbon"
          />
          <p className="text-[19px] md:text-[21px] text-inksoft mt-7 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            Have a question or want to get in touch? We'd love to hear from you.
          </p>
          <div className="mt-9">
            <MagneticButton href={phoneHref} className="btn-primary text-[17px] px-7 py-3.5 inline-flex items-center gap-2.5">
              <BsTelephone aria-hidden="true" />
              Call {phone}
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Details + form */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-wide mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Details - spacing, not cards */}
          <div className="space-y-9">
            {details.map((detail, i) => (
              <ScrollReveal key={detail.title} animation="fade-up" delay={i * 70}>
                <div className="flex gap-4 min-w-0">
                  <span className="text-[19px] text-accent-700 mt-1 shrink-0">{detail.icon}</span>
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-semibold text-carbon">{detail.title}</h2>
                    <p className="text-[16px] text-inksoft mt-1 leading-relaxed">{detail.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Form */}
          <ScrollReveal animation="fade-up" delay={100} className="lg:col-span-2">
            <div className="bg-white rounded-card p-7 md:p-10">
              {sent ? (
                <div className="text-center py-12">
                  <BsCheckCircle className="text-[48px] text-accent-700 mx-auto mb-5" aria-hidden="true" />
                  <h2 className="text-[28px] font-semibold text-carbon tracking-[-0.02em] mb-3">Message Sent!</h2>
                  <p className="text-[17px] text-steel mb-7">Thank you for reaching out. We'll get back to you soon.</p>
                  <button type="button" onClick={() => setSent(false)} className="btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-[28px] font-semibold text-carbon tracking-[-0.02em] mb-7">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-[14px] font-medium text-carbon mb-1.5">Name *</label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-field"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-[14px] font-medium text-carbon mb-1.5">Email *</label>
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="input-field"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-[14px] font-medium text-carbon mb-1.5">Subject</label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="input-field"
                        placeholder="What is this about?"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-[14px] font-medium text-carbon mb-1.5">Message *</label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input-field"
                        placeholder="Write your message here..."
                        rows={6}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-primary inline-flex items-center gap-2.5 disabled:opacity-60"
                    >
                      {sending ? (
                        <>
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <BsSend aria-hidden="true" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Find us - the real place, in pictures */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-wide mx-auto px-5 sm:px-8">
          <ScrollReveal animation="fade-up">
            <h2 className="text-[28px] font-semibold text-carbon tracking-[-0.02em]">Find us in Devi's Fall</h2>
            <p className="text-[17px] text-inksoft mt-3 max-w-2xl leading-relaxed">
              The waterfall our address is named for, Pokhara's valley, and one of its busy streets.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={70} className="mt-10">
            <figure className="min-w-0">
              <img
                src="/place/devi-falls-1280.jpg"
                srcSet="/place/devi-falls-640.jpg 640w, /place/devi-falls-1280.jpg 1280w, /place/devi-falls-1920.jpg 1920w"
                sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1119px) calc(100vw - 64px), 1056px"
                width={1280}
                height={853}
                alt="Devi's Fall in monsoon season, white water pouring over dark rock as visitors watch from a railing"
                className="w-full aspect-[3/2] object-cover rounded-card"
                decoding="async"
              />
              <figcaption className="text-[16px] text-steel mt-2.5 leading-relaxed">
                Devi's Fall, Pokhara-17, in monsoon season.
              </figcaption>
            </figure>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <ScrollReveal animation="fade-up" delay={140}>
              <figure className="min-w-0">
                <img
                  src="/place/devi-falls-platform.jpg"
                  width={960}
                  height={640}
                  alt="Visitors at the brick viewing platform above the falls, looking down at turquoise water"
                  className="w-full aspect-[3/2] object-cover rounded-card"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="text-[16px] text-steel mt-2.5 leading-relaxed">
                  The viewing platform above the falls.
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={210}>
              <figure className="min-w-0">
                <img
                  src="/place/pokhara-valley.jpg"
                  width={960}
                  height={720}
                  alt="The Pokhara valley spread below forested hills, seen from the World Peace Stupa"
                  className="w-full aspect-[3/2] object-cover rounded-card"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="text-[16px] text-steel mt-2.5 leading-relaxed">
                  Pokhara from the World Peace Stupa.
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={280}>
              <figure className="min-w-0">
                <img
                  src="/place/pokhara-street.jpg"
                  width={960}
                  height={720}
                  alt="A busy Pokhara street lined with shops, signs and parked motorbikes"
                  className="w-full aspect-[3/2] object-cover rounded-card"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="text-[16px] text-steel mt-2.5 leading-relaxed">
                  Shops and motorbikes on a Pokhara street.
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* From the shelf - real products, in motion */}
      <ProductShelf heading="From the Shelf" tileClass="bg-frost" />
    </div>
  )
}
