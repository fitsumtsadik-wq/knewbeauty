import { useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

export default function ProductList({ products, loading, error, query }) {
  const [selected, setSelected] = useState(null)

  if (loading) return (
    <div className="state-box">
      <div className="spinner" />
      <p>Loading products…</p>
    </div>
  )

  if (error) return (
    <div className="state-box error">
      <p>⚠️ {error}</p>
      <p className="hint">Start the backend: <code>python app.py</code> inside <code>backend/</code></p>
    </div>
  )

  if (products.length === 0) return (
    <div className="state-box">
      <p className="big-icon">🔍</p>
      <p>No products found{query ? ` for "${query}"` : ''}.</p>
    </div>
  )

  return (
    <section>
      <p className="result-count">
        {products.length} product{products.length !== 1 ? 's' : ''} found — click any product for details
      </p>
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
