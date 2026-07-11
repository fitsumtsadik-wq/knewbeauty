import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

const PER_PAGE = 24

export default function ProductList({ products, loading, error, query }) {
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [products])

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

  const totalPages = Math.ceil(products.length / PER_PAGE)
  const start = (page - 1) * PER_PAGE
  const visible = products.slice(start, start + PER_PAGE)

  return (
    <section>
      <p className="result-count">
        Showing {start + 1}–{Math.min(start + PER_PAGE, products.length)} of {products.length} product{products.length !== 1 ? 's' : ''} — click any for details
      </p>
      <div className="product-grid">
        {visible.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button
            className="page-btn"
            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
