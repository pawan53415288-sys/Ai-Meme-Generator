import { useState } from 'react'
import { generateMemes } from './api'
import { CATEGORIES } from './types'
import type { Category, Meme } from './types'
import './App.css'

function App() {
  const [category, setCategory] = useState<Category>('bollywood')
  const [memes, setMemes] = useState<Meme[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const { memes } = await generateMemes(category)
      setMemes(memes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setMemes([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Meme Generator</h1>
        <p className="app-subtitle">
          Pick a category, hit generate, and get fresh AI-written memes in
          seconds.
        </p>
      </header>

      <section className="controls">
        <div className="category-picker" role="group" aria-label="Meme category">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={item === category ? 'chip chip-active' : 'chip'}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Memes'}
        </button>
      </section>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <div className="loading" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <p>Thinking up some savage Hinglish humour...</p>
        </div>
      )}

      {!loading && memes.length > 0 && (
        <section className="meme-grid" aria-label="Generated memes">
          {memes.map((meme) => (
            <figure className="meme-card" key={meme.id}>
              <img src={meme.imageUrl} alt={meme.caption} loading="lazy" />
              <figcaption>{meme.caption}</figcaption>
            </figure>
          ))}
        </section>
      )}

      {!loading && !error && memes.length === 0 && (
        <p className="empty">No memes yet — choose a category and generate.</p>
      )}
    </div>
  )
}

export default App