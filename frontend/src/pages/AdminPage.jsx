import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API_BASE from '../config'

const EMPTY_PRODUCT = {
  name: '', brand: '', category: '', price: '',
  description: '', in_stock: 1, location: '', image_url: '',
}

const EMPTY_ARTICLE = {
  title: '', content: '', excerpt: '', image_url: '', published: 1,
}

const TABS = ['Analytics', 'Products', 'Suggestions', 'Blog']

export default function AdminPage() {
  const [password, setPassword]   = useState('')
  const [authed, setAuthed]       = useState(false)
  const [authError, setAuthError] = useState('')
  const [tab, setTab]             = useState('Analytics')

  // products
  const [products, setProducts]   = useState([])
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productMsg, setProductMsg] = useState('')

  // analytics
  const [analytics, setAnalytics] = useState(null)

  // suggestions
  const [suggestions, setSuggestions] = useState([])

  // blog
  const [articles, setArticles]   = useState([])
  const [articleForm, setArticleForm] = useState(EMPTY_ARTICLE)
  const [editingArticleId, setEditingArticleId] = useState(null)
  const [articleMsg, setArticleMsg] = useState('')

  const storedPw = () => sessionStorage.getItem('admin_pw') || ''

  useEffect(() => {
    const pw = storedPw()
    if (pw) checkAuth(pw, false)
  }, [])

  async function checkAuth(pw, manual = true) {
    const res = await fetch(`${API_BASE}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_pw', pw)
      setAuthed(true)
      loadAll(pw)
    } else if (manual) {
      setAuthError('Wrong password')
    }
  }

  function loadAll(pw) {
    loadProducts()
    loadAnalytics(pw)
    loadSuggestions(pw)
    loadArticles()
  }

  async function loadProducts() {
    const res = await fetch(`${API_BASE}/api/products`)
    setProducts(await res.json())
  }

  async function loadAnalytics(pw) {
    const res = await fetch(`${API_BASE}/api/admin/analytics`, {
      headers: { 'X-Admin-Password': pw || storedPw() }
    })
    if (res.ok) setAnalytics(await res.json())
  }

  async function loadSuggestions(pw) {
    const res = await fetch(`${API_BASE}/api/admin/suggestions`, {
      headers: { 'X-Admin-Password': pw || storedPw() }
    })
    if (res.ok) setSuggestions(await res.json())
  }

  async function loadArticles() {
    const res = await fetch(`${API_BASE}/api/articles`)
    setArticles(await res.json())
  }

  // ── Products ──────────────────────────────────────────────────────────────

  async function saveProduct(e) {
    e.preventDefault()
    const pw = storedPw()
    const method = editingProductId ? 'PUT' : 'POST'
    const url    = editingProductId
      ? `${API_BASE}/api/products/${editingProductId}`
      : `${API_BASE}/api/products`
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pw },
      body: JSON.stringify(productForm),
    })
    if (res.ok) {
      setProductMsg(editingProductId ? 'Product updated!' : 'Product added!')
      setProductForm(EMPTY_PRODUCT)
      setEditingProductId(null)
      loadProducts()
    }
    setTimeout(() => setProductMsg(''), 3000)
  }

  async function deleteProduct(id) {
    if (!window.confirm('Delete this product?')) return
    await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Password': storedPw() },
    })
    loadProducts()
  }

  function editProduct(p) {
    setProductForm({ ...p, price: String(p.price) })
    setEditingProductId(p.id)
    setTab('Products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Suggestions ───────────────────────────────────────────────────────────

  async function markRead(id) {
    await fetch(`${API_BASE}/api/admin/suggestions/${id}/read`, {
      method: 'PUT',
      headers: { 'X-Admin-Password': storedPw() },
    })
    loadSuggestions()
  }

  // ── Articles ──────────────────────────────────────────────────────────────

  async function saveArticle(e) {
    e.preventDefault()
    const pw = storedPw()
    const method = editingArticleId ? 'PUT' : 'POST'
    const url    = editingArticleId
      ? `${API_BASE}/api/articles/${editingArticleId}`
      : `${API_BASE}/api/articles`
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pw },
      body: JSON.stringify(articleForm),
    })
    if (res.ok) {
      setArticleMsg(editingArticleId ? 'Article updated!' : 'Article published!')
      setArticleForm(EMPTY_ARTICLE)
      setEditingArticleId(null)
      loadArticles()
    }
    setTimeout(() => setArticleMsg(''), 3000)
  }

  async function deleteArticle(id) {
    if (!window.confirm('Delete this article?')) return
    await fetch(`${API_BASE}/api/articles/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Password': storedPw() },
    })
    loadArticles()
  }

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!authed) return (
    <div className="admin-login">
      <div className="login-box">
        <span className="login-icon">🔐</span>
        <h2>Admin Login</h2>
        <input className="form-input" type="password" placeholder="Enter admin password"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkAuth(password)} />
        {authError && <p className="auth-error">{authError}</p>}
        <button className="btn-pink" onClick={() => checkAuth(password)}>Login</button>
        <Link to="/" className="back-link">← Back to store</Link>
      </div>
    </div>
  )

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <h1>💄 KnewBeauty Admin</h1>
          <Link to="/" className="btn-outline">← View Store</Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'Suggestions' && suggestions.filter(s => !s.read).length > 0
              ? `${t} (${suggestions.filter(s => !s.read).length})`
              : t}
          </button>
        ))}
      </div>

      <div className="admin-main single-col">

        {/* ── Analytics tab ── */}
        {tab === 'Analytics' && (
          <div className="analytics-section">
            {!analytics ? <p className="loading-text">Loading analytics…</p> : (
              <>
                <div className="stat-cards">
                  <div className="stat-card">
                    <p className="stat-number">{analytics.total_views}</p>
                    <p className="stat-label">Total Product Views</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-number">{analytics.total_products}</p>
                    <p className="stat-label">Products in Store</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-number">{analytics.unread_suggestions}</p>
                    <p className="stat-label">Unread Suggestions</p>
                  </div>
                </div>

                <div className="analytics-grid">
                  <div className="analytics-box">
                    <h3>🔥 Most Viewed Products</h3>
                    {analytics.top_products.map((p, i) => (
                      <div key={p.id} className="analytics-row">
                        <span className="rank">#{i + 1}</span>
                        <div className="analytics-row-info">
                          <strong>{p.name}</strong>
                          <span>{p.category} · {p.location}</span>
                        </div>
                        <span className="analytics-views">{p.views} views</span>
                      </div>
                    ))}
                  </div>

                  <div className="analytics-box">
                    <h3>📊 Views by Category</h3>
                    {analytics.category_views.map(c => (
                      <div key={c.category} className="analytics-row">
                        <div className="analytics-row-info">
                          <strong>{c.category}</strong>
                        </div>
                        <span className="analytics-views">{c.views} views</span>
                      </div>
                    ))}

                    <h3 style={{marginTop:'1.5rem'}}>💡 Placement Suggestions</h3>
                    <p className="analytics-hint">Move these top products to high-traffic areas:</p>
                    {analytics.location_suggestions.map((p, i) => (
                      <div key={p.name} className="analytics-row">
                        <span className="rank">#{i + 1}</span>
                        <div className="analytics-row-info">
                          <strong>{p.name}</strong>
                          <span>Currently: {p.location}</span>
                        </div>
                        {i < 2
                          ? <span className="badge-suggest">Move to Front</span>
                          : <span className="badge-ok">Good spot</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Products tab ── */}
        {tab === 'Products' && (
          <div className="admin-two-col">
            <div className="admin-form-section">
              <h2>{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
              {productMsg && <p className="admin-message">{productMsg}</p>}
              <form onSubmit={saveProduct} className="admin-form">
                <div className="form-grid">
                  {[['name','Product Name'],['brand','Brand'],['category','Category'],['price','Price ($)'],['location','Store Location'],['image_url','Image URL']].map(([k,l]) => (
                    <label key={k} className="form-label">{l}
                      <input className="form-input" value={productForm[k]}
                        onChange={e => setProductForm(f => ({...f, [k]: e.target.value}))}
                        required={['name','brand','category','price'].includes(k)} />
                    </label>
                  ))}
                </div>
                <label className="form-label">Description
                  <textarea className="form-input" rows={2} value={productForm.description}
                    onChange={e => setProductForm(f => ({...f, description: e.target.value}))} />
                </label>
                <label className="form-label stock-label">
                  <input type="checkbox" checked={!!productForm.in_stock}
                    onChange={e => setProductForm(f => ({...f, in_stock: e.target.checked ? 1 : 0}))} />
                  In Stock
                </label>
                {productForm.image_url && (
                  <div className="image-preview">
                    <img src={productForm.image_url} alt="preview" onError={e => e.target.style.display='none'} />
                  </div>
                )}
                <div className="form-actions">
                  <button className="btn-pink" type="submit">{editingProductId ? 'Update' : 'Add Product'}</button>
                  {editingProductId && <button className="btn-outline-dark" type="button" onClick={() => { setProductForm(EMPTY_PRODUCT); setEditingProductId(null) }}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="admin-list-section">
              <h2>All Products ({products.length})</h2>
              <div className="admin-product-list">
                {products.map(p => (
                  <div key={p.id} className="admin-product-row">
                    {p.image_url
                      ? <img className="admin-thumb" src={p.image_url} alt={p.name} onError={e => e.target.style.display='none'} />
                      : <div className="admin-thumb-placeholder">📦</div>
                    }
                    <div className="admin-row-info">
                      <strong>{p.name}</strong>
                      <span>{p.brand} · {p.category} · ${parseFloat(p.price).toFixed(2)}</span>
                      <span className={p.in_stock ? 'in-stock-text' : 'oos-text'}>{p.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button className="btn-edit" onClick={() => editProduct(p)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Suggestions tab ── */}
        {tab === 'Suggestions' && (
          <div className="admin-form-section full-width">
            <h2>Customer Suggestions ({suggestions.length})</h2>
            {suggestions.length === 0
              ? <p className="empty-state">No suggestions yet.</p>
              : suggestions.map(s => (
                <div key={s.id} className={`suggestion-card ${!s.read ? 'unread' : ''}`}>
                  <div className="suggestion-header">
                    <div>
                      <strong>{s.name || 'Anonymous'}</strong>
                      {s.email && <span className="suggestion-email">{s.email}</span>}
                    </div>
                    <div className="suggestion-meta">
                      <span className="suggestion-date">{new Date(s.submitted_at).toLocaleDateString()}</span>
                      {!s.read && <span className="badge-new">New</span>}
                    </div>
                  </div>
                  <p className="suggestion-message">{s.message}</p>
                  {!s.read && <button className="btn-edit" onClick={() => markRead(s.id)}>Mark as Read</button>}
                </div>
              ))
            }
          </div>
        )}

        {/* ── Blog tab ── */}
        {tab === 'Blog' && (
          <div className="admin-two-col">
            <div className="admin-form-section">
              <h2>{editingArticleId ? 'Edit Article' : 'Write New Article'}</h2>
              {articleMsg && <p className="admin-message">{articleMsg}</p>}
              <form onSubmit={saveArticle} className="admin-form">
                <label className="form-label">Title
                  <input className="form-input" required value={articleForm.title}
                    onChange={e => setArticleForm(f => ({...f, title: e.target.value}))} />
                </label>
                <label className="form-label">Short Excerpt
                  <input className="form-input" value={articleForm.excerpt}
                    onChange={e => setArticleForm(f => ({...f, excerpt: e.target.value}))}
                    placeholder="One sentence summary shown on blog page" />
                </label>
                <label className="form-label">Cover Image URL
                  <input className="form-input" value={articleForm.image_url}
                    onChange={e => setArticleForm(f => ({...f, image_url: e.target.value}))}
                    placeholder="Paste image link here" />
                </label>
                <label className="form-label">Content
                  <textarea className="form-input article-textarea" rows={12} required
                    value={articleForm.content}
                    onChange={e => setArticleForm(f => ({...f, content: e.target.value}))}
                    placeholder="Write your article here..." />
                </label>
                <label className="form-label stock-label">
                  <input type="checkbox" checked={!!articleForm.published}
                    onChange={e => setArticleForm(f => ({...f, published: e.target.checked ? 1 : 0}))} />
                  Published (visible to customers)
                </label>
                <div className="form-actions">
                  <button className="btn-pink" type="submit">{editingArticleId ? 'Update Article' : 'Publish Article'}</button>
                  {editingArticleId && <button className="btn-outline-dark" type="button" onClick={() => { setArticleForm(EMPTY_ARTICLE); setEditingArticleId(null) }}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="admin-list-section">
              <h2>Published Articles ({articles.length})</h2>
              <div className="admin-product-list">
                {articles.map(a => (
                  <div key={a.id} className="admin-product-row">
                    {a.image_url
                      ? <img className="admin-thumb" src={a.image_url} alt={a.title} onError={e => e.target.style.display='none'} />
                      : <div className="admin-thumb-placeholder">📝</div>
                    }
                    <div className="admin-row-info">
                      <strong>{a.title}</strong>
                      <span>{new Date(a.created_at).toLocaleDateString()}</span>
                      <span className={a.published ? 'in-stock-text' : 'oos-text'}>{a.published ? 'Published' : 'Draft'}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button className="btn-edit" onClick={() => { setArticleForm({...a}); setEditingArticleId(a.id) }}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteArticle(a.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
