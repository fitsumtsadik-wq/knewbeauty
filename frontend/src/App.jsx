import { useState, useEffect, useCallback } from 'react'
import SearchBar from './components/SearchBar'
import ProductList from './components/ProductList'

export default function App() {
  const [products, setProducts]               = useState([])
  const [categories, setCategories]           = useState([])
  const [query, setQuery]                     = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState(null)

  useEffect(() => {
    fetch('/api/categories')
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
        ? `/api/products/search?${params}`
        : '/api/products'
      const res  = await fetch(url)
      const data = await res.json()
      setProducts(data)
    } catch {
      setError('Could not reach the backend. Make sure Flask is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(query, selectedCategory)
  }, [query, selectedCategory, fetchProducts])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span>💄</span>
            <h1>KnewBeauty</h1>
          </div>
          <p className="tagline">Find your perfect beauty products — and exactly where to grab them</p>
        </div>
      </header>

      <main className="main">
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
        <p>© 2025 KnewBeauty</p>
      </footer>
    </div>
  )
}
