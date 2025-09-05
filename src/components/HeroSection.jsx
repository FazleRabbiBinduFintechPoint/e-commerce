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
    <section className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-lg overflow-hidden bg-base-200">
          <img src={fallback[index]} alt={`Slide ${index + 1}`} className="w-full h-64 md:h-96 object-cover" />

          <button aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost" onClick={prev}>
            ‹
          </button>
          <button aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost" onClick={next}>
            ›
          </button>

          <div className="absolute left-4 bottom-4 bg-black/40 text-white rounded-md px-3 py-1">
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-white/80">{subtitle}</div>
          </div>
        </div>

  {/* thumbnails removed per request */}
      </div>
    </section>
  )
}
