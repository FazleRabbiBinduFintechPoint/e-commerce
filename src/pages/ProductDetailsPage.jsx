import { useParams } from 'react-router-dom'
import ProductDetails from '../components/ProductDetails'
import { getProductById } from '../api/db'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const product = getProductById(id) || { id, title: 'Unknown', price: '0.00', description: 'No description.' }

  return (
    <div className="py-8">
      <ProductDetails {...product} onAdd={(item) => console.log('Add to cart', item)} />
    </div>
  )
}
