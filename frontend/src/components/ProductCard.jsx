const ICONS = {
  Foundation: '🫧',
  Lips:       '💋',
  Skincare:   '✨',
  Eyes:       '👁️',
  Cheeks:     '🌸',
  Face:       '💎',
  default:    '🌟',
}

export default function ProductCard({ product }) {
  const icon = ICONS[product.category] ?? ICONS.default

  return (
    <article className={`product-card ${!product.in_stock ? 'out-of-stock' : ''}`}>
      <div className="card-icon">{icon}</div>

      <div className="card-body">
        <div className="card-top">
          <div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-brand">{product.brand}</p>
          </div>
          <span className="product-price">${product.price.toFixed(2)}</span>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="card-footer">
          <span className="badge category">{product.category}</span>
          <span className="badge location">📍 {product.location}</span>
          <span className={`badge stock ${product.in_stock ? 'in-stock' : 'oos'}`}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </article>
  )
}
