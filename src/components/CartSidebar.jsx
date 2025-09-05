import { useEffect, useState } from 'react'

export default function CartSidebar({ show = false, onClose = () => {} }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      setItems(raw ? JSON.parse(raw) : [])
    } catch (e) {
      setItems([])
    }
  }, [show])

  function save(next) {
    setItems(next)
    try {
      localStorage.setItem('cart', JSON.stringify(next))
    } catch (e) {
      // ignore
    }
  }

  function removeItem(id) {
    save(items.filter((it) => it.id !== id))
  }

  function changeQty(id, delta) {
    const next = items.map((it) => it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) + delta) } : it)
    save(next)
  }

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop: darken only (no blur) - use button for accessibility */}
      <button aria-label="Close cart" className="absolute inset-0 bg-black/40 focus:outline-none" onClick={onClose} />
      {/* aside: slide-in from right, isolated shadow, rounded left corners */}
      <aside className="ml-auto w-full max-w-sm bg-base-100 h-full shadow-2xl rounded-l-xl transform transition-transform duration-300 translate-x-0">
        <div className="p-5 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Your cart</h3>
            </div>
            <button className="btn btn-square btn-ghost" onClick={onClose} aria-label="Close cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="text-center text-sm text-base-content/60 py-12">Your cart is empty</div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 bg-base-200 p-3 rounded-md">
                  <div className="w-16 h-16 bg-base-100 rounded-md flex items-center justify-center overflow-hidden border">
                    {it.img ? <img src={it.img} alt={it.title} className="max-w-full max-h-full object-contain" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{it.title}</div>
                    <div className="text-sm text-base-content/70">${it.price}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="btn btn-xs" onClick={() => changeQty(it.id, -1)}>-</button>
                      <div className="px-2">{it.qty || 1}</div>
                      <button className="btn btn-xs" onClick={() => changeQty(it.id, +1)}>+</button>
                      <button className="btn btn-link btn-sm ml-4 text-error" onClick={() => removeItem(it.id)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t bg-base-200">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Total</div>
            <div className="font-semibold">${total.toFixed(2)}</div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="btn btn-outline w-full">View cart</button>
            <button className="btn btn-accent w-full">Proceed to checkout</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
