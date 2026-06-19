import { BsFlower1, BsHeart, BsEye, BsPeople } from 'react-icons/bs'
import ScrollReveal from '../components/ScrollReveal'

const values = [
  {
    icon: BsHeart,
    title: 'Care First',
    description: 'We prioritize your skin health with personalized recommendations and genuine products.',
  },
  {
    icon: BsEye,
    title: 'Transparency',
    description: 'Honest pricing, authentic products, and clear information about every item we sell.',
  },
  {
    icon: BsPeople,
    title: 'Community',
    description: 'Serving the Pokhara community with dedication and building lasting relationships.',
  },
  {
    icon: BsFlower1,
    title: 'Excellence',
    description: 'Curating only the best skincare solutions from trusted global and local brands.',
  },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
              About <span className="text-emerald-600">PharmaNest</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your trusted skincare pharmacy in Pokhara, Nepal
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal animation="fade-right">
              <h2 className="section-heading mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  PharmaNest was born from a simple idea: everyone deserves access to genuine, high-quality skincare products. Located in the beautiful city of Pokhara, at the scenic Devi's Fall area in Ward No. 17, we have become a trusted name in skincare pharmacy.
                </p>
                <p>
                  We understand that every skin type is unique. That's why we don't just sell products — we provide personalized skincare solutions. Our knowledgeable team helps you find the right products for your specific needs, whether you're dealing with acne, aging, sensitivity, or simply want to maintain healthy, glowing skin.
                </p>
                <p>
                  From cleansers and moisturizers to serums and sunscreens, we stock a carefully curated selection of products from reputable brands that meet our strict quality standards.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="flip-left" delay={200}>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl flex items-center justify-center overflow-hidden">
                  <img src="/logo.jpg" alt="PharmaNest Logo" className="w-full h-full object-cover" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in">
            <div className="text-center mb-12">
              <h2 className="section-heading">Our <span className="text-emerald-600">Values</span></h2>
              <p className="section-subheading">What drives everything we do</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <ScrollReveal key={i} animation="bounce-in" delay={i * 120}>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 text-center hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <value.icon className="text-2xl text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="slide-up-big">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-10 md:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Visit Us Today</h2>
              <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
                Located at the beautiful Devi's Fall area in Pokhara-17. Come experience personalized skincare consultation.
              </p>
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <a
                  href="https://maps.google.com/?q=Devi's+Fall+Pokhara+17"
                  target="_blank"
                  rel="noopener"
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-lg transition-all shadow-lg"
                >
                  Get Directions
                </a>
                <a
                  href="tel:+9779865489647"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-all"
                >
                  Call Us
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
