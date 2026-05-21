import { useState } from 'react'
import API_BASE from '../config'

export default function SuggestionBox() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [status, setStatus]   = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    const res = await fetch(`${API_BASE}/api/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setStatus('Thank you! Your suggestion has been sent.')
      setForm({ name: '', email: '', message: '' })
    } else {
      setStatus('Something went wrong. Please try again.')
    }
    setSending(false)
    setTimeout(() => setStatus(''), 5000)
  }

  return (
    <section className="suggestion-section">
      <div className="suggestion-inner">
        <div className="suggestion-text">
          <p className="suggestion-sub">Your Voice Matters</p>
          <h2 className="suggestion-title">Share Your Thoughts</h2>
          <p className="suggestion-desc">
            Tell us what products you'd love to see, what we can do better,
            or anything on your mind. We read every single message.
          </p>
        </div>
        <form className="suggestion-form" onSubmit={handleSubmit}>
          <div className="suggestion-row">
            <input className="sug-input" placeholder="Your name (optional)"
              value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            <input className="sug-input" placeholder="Email (optional)" type="email"
              value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <textarea className="sug-input sug-textarea" rows={4} required
            placeholder="What would you like to see at KnewBeauty? Any product requests, feedback, or ideas..."
            value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
          {status && <p className="sug-status">{status}</p>}
          <button className="btn-pink sug-btn" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send Suggestion ✦'}
          </button>
        </form>
      </div>
    </section>
  )
}
