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
      <div className="card-image">
        {product.image_url
          ? <img
              src={product.image_url}
              alt={product.name}
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          : null
        }
        <div
          className="card-icon-fallback"
          style={{ display: product.image_url ? 'none' : 'flex' }}
        >
          {icon}
        </div>
      </div>

      <div className="card-body">
        <div className="card-top">
          <div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-brand">{product.brand}</p>
          </div>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="card-footer">
          <span className="badge category">{product.category}</span>
          {product.location && <span className="badge location">📍 {product.location}</span>}
          <span className={`badge stock ${product.in_stock ? 'in-stock' : 'oos'}`}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </article>
  )
}
