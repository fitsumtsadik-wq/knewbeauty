import { useState, useEffect } from 'react'

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1400&q=80',
    caption: 'Celebrating Every Shade of Beautiful',
  },
  {
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1400&q=80',
    caption: 'Luxury Beauty for Every Skin Tone',
  },
  {
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80',
    caption: 'Your Glow. Your Story.',
  },
  {
    url: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1400&q=80',
    caption: 'Radiant in Every Tone',
  },
  {
    url: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?auto=format&fit=crop&w=1400&q=80',
    caption: 'Beauty Has No Limits',
  },
]

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${3 + Math.random() * 4}s`,
  size: `${3 + Math.random() * 5}px`,
  color: i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#b76e79' : '#fff',
}))

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading]   = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % SLIDES.length)
        setFading(false)
      }, 600)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero">
      {/* background image */}
      <div
        className={`hero-bg ${fading ? 'fading' : ''}`}
        style={{ backgroundImage: `url(${SLIDES[current].url})` }}
      />

      {/* dark overlay */}
      <div className="hero-overlay" />

      {/* particles */}
      <div className="particles">
        {PARTICLES.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* text */}
      <div className={`hero-text ${fading ? 'fading' : ''}`}>
        <p className="hero-sub">Welcome to</p>
        <h1 className="hero-title">KnewBeauty</h1>
        <p className="hero-caption">{SLIDES[current].caption}</p>
      </div>

      {/* dots */}
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}
