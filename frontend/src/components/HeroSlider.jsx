import { useState, useEffect } from 'react'

const SLIDES = [
  {
    url: 'https://images.pexels.com/photos/13734819/pexels-photo-13734819.jpeg',
    caption: 'Celebrating Every Shade of Beautiful',
  },
  {
    url: 'https://images.pexels.com/photos/6923561/pexels-photo-6923561.jpeg',
    caption: 'Luxury Beauty for Every Skin Tone',
  },
  {
    url: 'https://images.pexels.com/photos/17043160/pexels-photo-17043160.jpeg',
    caption: 'Your Glow. Your Story.',
  },
  {
    url: 'https://images.pexels.com/photos/27987128/pexels-photo-27987128.jpeg',
    caption: 'Radiant in Every Tone',
  },
  {
    url: 'https://images.pexels.com/photos/2301283/pexels-photo-2301283.jpeg',
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
