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
        <span className="nav-logo">💄 KnewBeauty</span>
        <Link to="/admin" className="nav-admin">Admin</Link>
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
        <p className="footer-logo">💄 KnewBeauty</p>
        <p>© 2025 KnewBeauty. Celebrating beauty in every shade.</p>
      </footer>
    </div>
  )
}
