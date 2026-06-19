import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsTelephone, BsEnvelope, BsGeoAlt } from 'react-icons/bs'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="PharmaNest" className="h-10 w-auto rounded-lg" />
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              Your trusted skincare pharmacy in the heart of Pokhara. We provide premium skincare products and expert consultations to help you achieve healthy, glowing skin.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                <BsFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                <BsInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Products', path: '/products' },
                { name: 'Our Team', path: '/team' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-emerald-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <BsGeoAlt className="text-emerald-400 mt-1 flex-shrink-0" />
                <span>Devi's Fall, Pokhara-17, Kaski, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <BsTelephone className="text-emerald-400 flex-shrink-0" />
                <span>+977-9865489647</span>
              </li>
              <li className="flex items-center gap-2">
                <BsEnvelope className="text-emerald-400 flex-shrink-0" />
                <span>pharmanest101@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PharmaNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
