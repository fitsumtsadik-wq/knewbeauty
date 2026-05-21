import { useEffect } from 'react'
import API_BASE from '../config'

const ICONS = {
  Foundation: '🫧', Lips: '💋', Skincare: '✨',
  Eyes: '👁️', Cheeks: '🌸', Face: '💎', default: '🌟',
}

export default function ProductModal({ product, onClose }) {
  const icon = ICONS[product.category] ?? ICONS.default

  // track view
  useEffect(() => {
    fetch(`${API_BASE}/api/products/${product.id}/view`, { method: 'POST' }).catch(() => {})
  }, [product.id])

  // close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-image">
          {product.image_url
            ? <img src={product.image_url} alt={product.name}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
            : null
          }
          <div className="modal-icon-fallback" style={{ display: product.image_url ? 'none' : 'flex' }}>
            {icon}
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-header">
            <div>
              <span className="modal-category">{product.category}</span>
              <h2 className="modal-title">{product.name}</h2>
              <p className="modal-brand">by {product.brand}</p>
            </div>
            <p className="modal-price">${product.price.toFixed(2)}</p>
          </div>

          <p className="modal-description">{product.description}</p>

          <div className="modal-location-box">
            <span className="modal-location-label">📍 Find it in store</span>
            <span className="modal-location-value">{product.location}</span>
          </div>

          <span className={`modal-stock ${product.in_stock ? 'in-stock' : 'oos'}`}>
            {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  )
}
