import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API_BASE from '../config'

const EMPTY = {
  name: '', brand: '', category: '', price: '',
  description: '', in_stock: 1, location: '', image_url: '',
}

export default function AdminPage() {
  const [password, setPassword]     = useState('')
  const [authed, setAuthed]         = useState(false)
  const [authError, setAuthError]   = useState('')
  const [products, setProducts]     = useState([])
  const [form, setForm]             = useState(EMPTY)
  const [editingId, setEditingId]   = useState(null)
  const [saving, setSaving]         = useState(false)
  const [message, setMessage]       = useState('')

  const storedPw = () => sessionStorage.getItem('admin_pw') || ''

  useEffect(() => {
    const pw = storedPw()
    if (pw) checkAuth(pw)
  }, [])

  async function checkAuth(pw) {
    const res  = await fetch(`${API_BASE}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_pw', pw)
      setAuthed(true)
      loadProducts(pw)
    } else {
      setAuthError('Wrong password')
    }
  }

  async function loadProducts(pw) {
    const res = await fetch(`${API_BASE}/api/products`)
    const data = await res.json()
    setProducts(data)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const pw = storedPw()
    const method = editingId ? 'PUT' : 'POST'
    const url    = editingId
      ? `${API_BASE}/api/products/${editingId}`
      : `${API_BASE}/api/products`
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pw },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setMessage(editingId ? 'Product updated!' : 'Product added!')
      setForm(EMPTY)
      setEditingId(null)
      loadProducts(pw)
    } else {
      setMessage('Something went wrong.')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    const pw = storedPw()
    await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Password': pw },
    })
    loadProducts(pw)
  }

  function startEdit(p) {
    setForm({ ...p, price: String(p.price) })
    setEditingId(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setForm(EMPTY)
    setEditingId(null)
  }

  function field(key, label, type = 'text', extra = {}) {
    return (
      <label className="form-label">
        {label}
        <input
          className="form-input"
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          {...extra}
        />
      </label>
    )
  }

  if (!authed) return (
    <div className="admin-login">
      <div className="login-box">
        <span className="login-icon">🔐</span>
        <h2>Admin Login</h2>
        <input
          className="form-input"
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkAuth(password)}
        />
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

      <div className="admin-main">

        {/* ── Form ── */}
        <section className="admin-form-section">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          {message && <p className="admin-message">{message}</p>}
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-grid">
              {field('name',        'Product Name', 'text',   { required: true })}
              {field('brand',       'Brand',        'text',   { required: true })}
              {field('category',    'Category',     'text',   { required: true, placeholder: 'e.g. Skincare, Lips' })}
              {field('price',       'Price ($)',     'number', { required: true, step: '0.01', min: '0' })}
              {field('location',    'Store Location','text',  { placeholder: 'e.g. Aisle 3, Shelf B' })}
              {field('image_url',   'Image URL',    'url',    { placeholder: 'Paste a photo link here' })}
            </div>
            <label className="form-label">
              Description
              <textarea
                className="form-input"
                rows={2}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label className="form-label stock-label">
              <input
                type="checkbox"
                checked={!!form.in_stock}
                onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked ? 1 : 0 }))}
              />
              In Stock
            </label>
            {form.image_url && (
              <div className="image-preview">
                <img src={form.image_url} alt="preview" onError={e => e.target.style.display='none'} />
              </div>
            )}
            <div className="form-actions">
              <button className="btn-pink" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button className="btn-outline" type="button" onClick={cancelEdit}>Cancel</button>
              )}
            </div>
          </form>
        </section>

        {/* ── Product list ── */}
        <section className="admin-list-section">
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
                  <span className={p.in_stock ? 'in-stock-text' : 'oos-text'}>
                    {p.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="admin-row-actions">
                  <button className="btn-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
