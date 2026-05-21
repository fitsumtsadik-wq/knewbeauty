import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API_BASE from '../config'

export default function BlogPage() {
  const [articles, setArticles] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/api/articles`)
      .then(r => r.json())
      .then(data => { setArticles(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-knew">Knew</span><span className="nav-logo-beauty">Beauty</span>
        </Link>
        <Link to="/" className="nav-back-link">← Back to Store</Link>
      </nav>

      <div className="blog-hero">
        <p className="blog-hero-sub">Beauty Knowledge</p>
        <h1 className="blog-hero-title">Beauty Articles</h1>
        <p className="blog-hero-desc">Tips, guides, and inspiration for every shade of beautiful</p>
      </div>

      <main className="blog-main">
        {selected ? (
          <article className="article-full">
            <button className="back-btn" onClick={() => setSelected(null)}>← All Articles</button>
            {selected.image_url && (
              <img className="article-cover" src={selected.image_url} alt={selected.title}
                onError={e => e.target.style.display='none'} />
            )}
            <h1 className="article-title">{selected.title}</h1>
            <p className="article-date">{new Date(selected.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
            <div className="article-content">
              {selected.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <button className="back-btn" onClick={() => setSelected(null)}>← Back to Articles</button>
          </article>
        ) : (
          <>
            {loading && <p className="loading-text">Loading articles…</p>}
            {!loading && articles.length === 0 && (
              <p className="empty-state">No articles yet. Check back soon!</p>
            )}
            <div className="blog-grid">
              {articles.map(a => (
                <div key={a.id} className="blog-card" onClick={() => setSelected(a)}>
                  <div className="blog-card-image">
                    {a.image_url
                      ? <img src={a.image_url} alt={a.title} onError={e => e.target.style.display='none'} />
                      : <div className="blog-card-icon">✦</div>
                    }
                  </div>
                  <div className="blog-card-body">
                    <p className="blog-card-date">{new Date(a.created_at).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}</p>
                    <h3 className="blog-card-title">{a.title}</h3>
                    <p className="blog-card-excerpt">{a.excerpt}</p>
                    <span className="blog-read-more">Read Article →</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p className="footer-logo">
          <span className="nav-logo-knew">Knew</span><span className="nav-logo-beauty">Beauty</span>
        </p>
        <p>© 2025 KnewBeauty. Celebrating beauty in every shade.</p>
      </footer>
    </div>
  )
}
