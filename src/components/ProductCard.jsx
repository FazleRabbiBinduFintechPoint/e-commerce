import { Link } from 'react-router-dom'

export default function ProductCard({ id = '1', title, price, img, onAddToCart }) {
  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (typeof onAddToCart === 'function') onAddToCart({ id, title, price })
    else console.log('Add to cart:', { id, title, price })
  }

  return (
    <div className="block w-full">
      <div className="card w-full p-2 bg-base-100 shadow overflow-hidden">
        {/* Row 1: image (fixed aspect ratio) */}
        <Link to={`/product/${id}`} className="block">
          {img ? (
            <div className="w-full aspect-[4/3] bg-base-200 overflow-hidden flex items-center justify-center">
              <img src={img} alt={title} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-base-200" />
          )}

          {/* Row 2: title */}
          <div className="px-2 pt-3">
            <h3 className="text-sm md:text-base font-semibold truncate">{title}</h3>
          </div>

          {/* Row 3: price */}
          <div className="px-2 pt-1 pb-2">
            <div className="text-base font-medium text-base-content/90">${price}</div>
          </div>
        </Link>

        {/* Row 4: actions - two columns */}
        <div className="px-2 pb-2 pt-1 border-t border-base-200">
          <div className="grid grid-cols-2 gap-2">
            <button className="btn btn-ghost btn-sm w-full" aria-label={`Buy ${title}`}>
              Buy
            </button>
            <button className="btn btn-primary btn-sm w-full" onClick={handleAdd} aria-label={`Add ${title} to cart`}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
