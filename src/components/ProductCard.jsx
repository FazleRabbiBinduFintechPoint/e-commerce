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
      <div className="card card-compact w-full p-2 bg-base-100 shadow">
        <Link to={`/product/${id}`} className="block">
          {img && (
            <div className="w-full h-56 flex items-center justify-center bg-base-200 overflow-hidden">
              <img src={img} alt={title} className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <div className="card-body">
            <h3 className="card-title">{title}</h3>
            <p className="text-sm text-base-content/70">${price}</p>
          </div>
        </Link>

        <div className="card-body pt-0">
          <div className="card-actions justify-end">
            <button className="btn btn-ghost btn-sm">Buy</button>
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}
