import { useState, useRef, useEffect } from 'react'

export default function ProductDetails({ id, title, price, description, img, images, onAdd }) {
    const [qty, setQty] = useState(1)
    const [selected, setSelected] = useState(0)
    const numericPrice = Number(price) || 0
    const cumulative = (numericPrice * qty).toFixed(2)

    // Normalize images: prefer `images` array, fall back to single `img` prop
    const gallery = Array.isArray(images) && images.length ? images : img ? [img] : []
    const main = gallery[selected] || null

    const containerRef = useRef(null)
    const [lensVisible, setLensVisible] = useState(false)
    const [lensStyle, setLensStyle] = useState({ left: 0, top: 0, backgroundPosition: '0% 0%', backgroundSize: '200%' })
    const zoomScale = 2.5
    const [showModal, setShowModal] = useState(false)
    const overlayRef = useRef(null)

    useEffect(() => {
        // hide lens on small/touch devices
        const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
        if (isTouch) setLensVisible(false)
    }, [])

    useEffect(() => {
        function onKey(e) {
            if (!showModal) return
            if (e.key === 'Escape') setShowModal(false)
            if (e.key === 'ArrowLeft') setSelected((s) => (s - 1 + gallery.length) % gallery.length)
            if (e.key === 'ArrowRight') setSelected((s) => (s + 1) % gallery.length)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [showModal, gallery.length])

    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center justify-center mb-4 relative" ref={containerRef}
                        onMouseEnter={() => setLensVisible(true)}
                        onMouseLeave={() => setLensVisible(false)}
                        onMouseMove={(e) => {
                            if (!containerRef.current || !main) return
                            const rect = containerRef.current.getBoundingClientRect()
                            const x = e.clientX - rect.left
                            const y = e.clientY - rect.top
                            const xPct = (x / rect.width) * 100
                            const yPct = (y / rect.height) * 100
                            const bgSizeX = rect.width * zoomScale
                            const bgSizeY = rect.height * zoomScale
                            const lensSize = Math.min(220, rect.width * 0.4)
                            const left = Math.min(Math.max(x - lensSize / 2, 0), rect.width - lensSize)
                            const top = Math.min(Math.max(y - lensSize / 2, 0), rect.height - lensSize)
                            setLensStyle({
                                left,
                                top,
                                width: lensSize,
                                height: lensSize,
                                backgroundImage: `url(${main})`,
                                backgroundPosition: `${xPct}% ${yPct}%`,
                                backgroundSize: `${bgSizeX}px ${bgSizeY}px`,
                            })
                        }}
                    >
                        {main ? (
                            <div
                                className="w-full h-80 md:h-96 flex items-center justify-center bg-base-100 cursor-zoom-in"
                                onClick={() => setShowModal(true)}
                            >
                                <img src={main} alt={`${title} - ${selected + 1}`} className="max-w-full max-h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-full h-64 bg-base-200 flex items-center justify-center">No image</div>
                        )}

                        {/* Lens */}
                        {lensVisible && gallery.length > 0 && (
                            <div
                                className="hidden md:block pointer-events-none absolute border rounded overflow-hidden"
                                style={{
                                    left: lensStyle.left,
                                    top: lensStyle.top,
                                    width: lensStyle.width,
                                    height: lensStyle.height,
                                    backgroundImage: lensStyle.backgroundImage,
                                    backgroundPosition: lensStyle.backgroundPosition,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: lensStyle.backgroundSize,
                                    boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
                                }}
                            />
                        )}
                    </div>

                    {/* Lightbox modal */}
                    {showModal && main && (
                        <div
                            ref={overlayRef}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                            onMouseDown={(e) => {
                                if (e.target === overlayRef.current) setShowModal(false)
                            }}
                        >
                            <div className="relative max-w-4xl w-full p-4">
                                <button
                                    aria-label="Close"
                                    className="btn btn-ghost btn-circle absolute right-2 top-2 z-10"
                                    onClick={() => setShowModal(false)}
                                >
                                    ✕
                                </button>

                                {gallery.length > 1 && (
                                    <>
                                        <button
                                            aria-label="Previous image"
                                            className="btn btn-ghost btn-circle absolute left-2 top-1/2 -translate-y-1/2 z-10"
                                            onClick={() => setSelected((s) => (s - 1 + gallery.length) % gallery.length)}
                                        >
                                            ‹
                                        </button>
                                        <button
                                            aria-label="Next image"
                                            className="btn btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                            onClick={() => setSelected((s) => (s + 1) % gallery.length)}
                                        >
                                            ›
                                        </button>
                                    </>
                                )}

                                <div className="flex items-center justify-center">
                                    <img src={gallery[selected]} alt={`${title} large ${selected + 1}`} className="max-w-full max-h-[80vh] object-contain mx-auto" />
                                </div>
                            </div>
                        </div>
                    )}

                    {gallery.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {gallery.map((thumb, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelected(idx)}
                                    className={`w-20 h-20 rounded overflow-hidden border ${selected === idx ? 'ring ring-primary' : 'border-base-300'} bg-base-100 flex-shrink-0`}
                                    aria-label={`Show image ${idx + 1}`}
                                >
                                    <img src={thumb} alt={`${title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                    <p className="text-lg text-primary font-semibold mb-2">${numericPrice.toFixed(2)}</p>
                    <div className="mb-4 text-base-content/80">
                        <p className="mb-2">{description}</p>
                        <ul className="list-disc list-inside text-sm text-base-content/70">
                            <li>High-quality materials</li>
                            <li>30-day money-back guarantee</li>
                            <li>Free standard shipping</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <span className="text-sm text-base-content/70">Quantity</span>
                        <div className="flex items-center gap-3 mt-2">
                            <button className="btn btn-sm" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                            <span className="px-4">{qty}</span>
                            <button className="btn btn-sm" onClick={() => setQty(qty + 1)}>+</button>
                            <div className="ml-6">
                                <span className="text-sm text-base-content/70">Total:</span>
                                <div className="text-lg font-semibold">${cumulative}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => onAdd?.({ id, title, price: numericPrice, qty })}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
