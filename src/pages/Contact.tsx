import { useState } from 'react'
import { BsSend, BsCheckCircle, BsTelephone, BsEnvelope, BsGeoAlt } from 'react-icons/bs'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-10 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <TextReveal
              text="Contact Us"
              tag="h1"
              className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4"
            />
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              Have a question or want to get in touch? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <ScrollReveal animation="fade-right" className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                  <BsGeoAlt className="text-xl text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Devi's Fall, Pokhara-17, Kaski, Nepal</p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                  <BsTelephone className="text-xl text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Call Us</h3>
                <a href="tel:+9779865489647" className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline">+977-9865489647</a>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                  <BsEnvelope className="text-xl text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email Us</h3>
                <a href="mailto:pharmanest101@gmail.com" className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline">pharmanest101@gmail.com</a>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Opening Hours</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Sun-Fri: 9:00 AM - 8:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Sat: 10:00 AM - 6:00 PM</p>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal animation="fade-left" delay={200} className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                {sent ? (
                  <div className="text-center py-12">
                    <BsCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                    <button
                      onClick={() => setSent(false)}
                      className="btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input-field"
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                          <input
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <input
                          type="text"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="input-field"
                          placeholder="What is this about?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                        <textarea
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
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        {sending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <BsSend /> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
