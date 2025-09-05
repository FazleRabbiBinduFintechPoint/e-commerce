import products from '../data/products.json'

export function getAllProducts() {
  return products
}

export function getProductById(id) {
  return products.find((p) => p.id === String(id)) || null
}

export default { getAllProducts, getProductById }
