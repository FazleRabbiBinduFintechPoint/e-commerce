import { useMemo, useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { getAllProducts } from '../api/db'

function useResponsiveColumns() {
  const getCols = () => {
    if (typeof window === 'undefined') return 5
    const w = window.innerWidth
    if (w >= 1024) return 5 // lg
    if (w >= 768) return 3 // md
    if (w >= 640) return 2 // sm
    return 1
  }

  const [cols, setCols] = useState(getCols)

  useEffect(() => {
    function onResize() {
      setCols(getCols())
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return cols
}

export default function Home() {
  const products = useMemo(() => getAllProducts(), [])
  const columns = useResponsiveColumns()
  const [rowsToShow, setRowsToShow] = useState(2)
  const [loadedCount, setLoadedCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // ensure rowsToShow never exceeds max rows after a resize
  useEffect(() => {
    const maxRows = Math.max(2, Math.ceil(products.length / columns))
    setRowsToShow((r) => Math.min(r, maxRows))
  }, [columns, products.length])

  const itemsToShow = rowsToShow * columns
  // on mobile we may progressively load more items (5 at a time)
  const initial = Math.max(itemsToShow, 0)
  const effectiveLoaded = Math.max(initial, loadedCount)
  const visible = products.slice(0, effectiveLoaded)
  const maxRows = Math.max(2, Math.ceil(products.length / columns))
  const canShowMore = rowsToShow < maxRows

  function handleShowMore() {
    setRowsToShow((r) => Math.min(maxRows, r + 1))
  }

  // mobile: load 5 more items with a fake fetch & loading animation
  async function handleMobileLoadMore() {
    if (loading) return
    setLoading(true)
    // simulate network delay and fetch next 5
    await new Promise((res) => setTimeout(res, 700))
    const next = Math.min(products.length, effectiveLoaded + 5)
    setLoadedCount(next)
    setLoading(false)
  }

  // IntersectionObserver for mobile infinite load
  useEffect(() => {
    if (columns !== 1) return // only for mobile
    const sentinel = document.getElementById('load-sentinel')
    if (!sentinel) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && visible.length < products.length) {
          handleMobileLoadMore()
        }
      })
    }, { root: null, rootMargin: '200px', threshold: 0.1 })
    obs.observe(sentinel)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, visible.length, products.length])

  function handleShowLess() {
    setRowsToShow(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="mt-8 px-6">
      <h3 className="text-xl font-semibold mb-4">Featured products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {visible.map((p) => (
          <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} img={p.images?.[0]} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        {columns === 1 ? (
          // mobile: auto-load when sentinel becomes visible
          <div className="w-full text-center">
            {visible.length < products.length ? (
              <div className="py-6" id="load-sentinel">
                <button className={`btn ${loading ? 'loading' : 'btn-ghost'}`} aria-busy={loading}>
                  {loading ? 'Loading...' : 'Scroll to load more'}
                </button>
              </div>
            ) : (
              <div className="py-6 text-sm text-base-content/60">End of products</div>
            )}
          </div>
        ) : (
          <div>
            {canShowMore && (
              <button className="btn btn-outline" onClick={handleShowMore}>
                Show more (+1 row)
              </button>
            )}
            {!canShowMore && rowsToShow > 2 && (
              <button className="btn btn-outline" onClick={handleShowLess}>
                Show less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
