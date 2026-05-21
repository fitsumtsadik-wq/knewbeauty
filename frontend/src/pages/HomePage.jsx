import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import StoreBanner from '../components/StoreBanner'
import SearchBar from '../components/SearchBar'
import ProductList from '../components/ProductList'
import API_BASE from '../config'

export default function HomePage() {
  const [products, setProducts]                 = useState([])
  const [categories, setCategories]             = useState([])
  const [query, setQuery]                       = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  const fetchProducts = useCallback(async (q, cat) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (q)   params.set('q', q)
      if (cat) params.set('category', cat)
      const url = (q || cat)
        ? `${API_BASE}/api/products/search?${params}`
        : `${API_BASE}/api/products`
      const res  = await fetch(url)
      const data = await res.json()
      setProducts(data)
    } catch {
      setError('Could not reach the backend.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(query, selectedCategory)
  }, [query, selectedCategory, fetchProducts])

  return (
    <div className="app">
      <nav className="navbar">
        <span className="nav-logo">
          <span className="nav-logo-knew">Knew</span><span className="nav-logo-beauty">Beauty</span>
        </span>
        <div className="nav-search-wrapper">
          <span className="nav-brush-hint">💄</span>
          <div className="nav-search-bar">
            <span className="nav-search-icon">✦</span>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Find your perfect product…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className="nav-clear-btn" onClick={() => setQuery('')}>✕</button>
            )}
          </div>
        </div>
      </nav>

      <HeroSlider />

      <StoreBanner />

      <main className="main">
        <div className="section-heading">
          <h2>Find Your Products</h2>
          <p>Search by name, brand, or category — we'll tell you exactly where to find it in store</p>
        </div>

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductList
          products={products}
          loading={loading}
          error={error}
          query={query}
        />
      </main>

      <footer className="footer">
        <div className="footer-grid">

          <div className="footer-col">
            <p className="footer-logo">
              <span className="nav-logo-knew">Knew</span><span className="nav-logo-beauty">Beauty</span>
            </p>
            <p className="footer-tagline">Celebrating beauty in every shade.</p>
            <a
              href="https://www.instagram.com/knewbeautyDC"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              @knewbeautyDC
            </a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Visit Us</h4>
            <p className="footer-address">
              📍 5227 Georgia Ave NW<br />
              Washington, DC
            </p>
            <a
              href="https://www.google.com/maps/search/5227+Georgia+Ave+NW+Washington+DC"
              target="_blank"
              rel="noopener noreferrer"
              className="directions-link"
            >
              Get Directions →
            </a>
          </div>

          <div className="footer-col footer-map-col">
            <h4 className="footer-col-title">Find Us</h4>
            <a
              href="https://www.google.com/maps/search/5227+Georgia+Ave+NW+Washington+DC"
              target="_blank"
              rel="noopener noreferrer"
              className="map-wrapper"
              title="Open in Google Maps"
            >
              <iframe
                title="KnewBeauty Location"
                src="https://maps.google.com/maps?q=5227+Georgia+Ave+NW+Washington+DC&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="footer-map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-click-overlay">
                <span>Open in Google Maps ↗</span>
              </div>
            </a>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2025 KnewBeauty. All rights reserved.</p>
          <Link to="/admin" className="footer-admin-link">admin</Link>
        </div>
      </footer>
    </div>
  )
}
