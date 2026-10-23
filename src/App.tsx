import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Products from './pages/Products'
import Contact from './pages/Contact'

// Admin is a separate app surface - keep it out of the public bundle
const Admin = lazy(() => import('./pages/Admin'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6 py-32">
      <div className="text-center max-w-lg">
        <p className="text-[17px] text-steel">404</p>
        <h1 className="text-[40px] md:text-[56px] font-semibold text-carbon mt-3 leading-[1.05] tracking-[-0.02em]">
          This page could not be found.
        </h1>
        <p className="text-[21px] text-steel mt-5">
          The link may be out of date, or the page has moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-8">
          Back to home
        </Link>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-svh flex flex-col">
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-svh flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-[3px] border-hairline border-t-accent-700 rounded-full" role="status" aria-label="Loading" />
                </div>
              }
            >
              <Admin />
            </Suspense>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
