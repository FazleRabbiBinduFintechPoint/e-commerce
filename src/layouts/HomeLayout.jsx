import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import { useLocation, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}

export default function HomeLayout() {
  const location = useLocation()
  const isProductPage = location.pathname.startsWith('/product/')
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {!isProductPage && (
          <HeroSection title="Welcome to Project Blanco" subtitle="A minimal starter with Tailwind & daisyUI" />
        )}
        <Outlet />
        <Testimonials />
      </main>
      {!isMobile && <Footer />}
    </div>
  )
}
