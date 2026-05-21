import ProductCard from './ProductCard'

export default function ProductList({ products, loading, error, query }) {
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
        {products.length} product{products.length !== 1 ? 's' : ''} found
      </p>
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
