import { useRef } from 'react'

export default function SearchBar({
  query, onQueryChange,
  categories, selectedCategory, onCategoryChange,
}) {
  const inputRef = useRef(null)

  return (
    <section className="search-section">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search by product name, brand, or description…"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            className="clear-btn"
            onClick={() => { onQueryChange(''); inputRef.current?.focus() }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="category-filters">
        <button
          className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => onCategoryChange('')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  )
}
