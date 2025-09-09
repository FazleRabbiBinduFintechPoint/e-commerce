import { useEffect, useState, useRef } from 'react'
import { getAllProducts } from '../api/db'

export default function HeroSection({ title = 'Welcome', subtitle = 'Build something great.', images = null }) {
  const fallback = images || getAllProducts()[0]?.images || []
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % Math.max(1, fallback.length)), 4000)
    return () => clearInterval(timerRef.current)
  }, [playing, fallback.length])

  function prev() {
    setIndex((i) => (i - 1 + fallback.length) % fallback.length)
    setPlaying(false)
  }

  function next() {
    setIndex((i) => (i + 1) % fallback.length)
    setPlaying(false)
  }

  if (!fallback || fallback.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
          <p className="text-lg text-base-content/70">{subtitle}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4">
      <div className="max-w-6xl mx-auto px-2 md:px-4 lg:px-8">
        <div className="relative rounded-lg overflow-hidden bg-base-200">
          <img src={fallback[index]} alt={`Slide ${index + 1}`} className="w-full h-48 md:h-64 object-cover block" />

          <button
            aria-label="Previous"
            title="Previous"
            className="absolute z-20 left-1 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 hover:bg-black/40 text-white shadow-lg focus:ring-2 focus:ring-white/60"
            onClick={prev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-5 md:w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4l-6 6 6 6" />
            </svg>
          </button>

          <button
            aria-label="Next"
            title="Next"
            className="absolute z-20 right-1 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 hover:bg-black/40 text-white shadow-lg focus:ring-2 focus:ring-white/60"
            onClick={next}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-5 md:w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4l6 6-6 6" />
            </svg>
          </button>

          <div className="absolute left-3 bottom-3 bg-black/40 text-white rounded-md px-2 py-0.5">
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-[11px] text-white/80">{subtitle}</div>
          </div>
        </div>

  {/* thumbnails removed per request */}
      </div>
    </section>
  )
}
