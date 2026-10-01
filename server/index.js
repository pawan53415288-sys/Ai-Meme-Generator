// ─────────────────────────────────────────────────────────────────────────────
//  LOCAL DEV BACKEND  —  not part of the Week 1 frontend curriculum.
//
//  In the bootcamp, students receive the backend as a ready-made repo (Week 1,
//  Slide 3). Its only job is to keep the secret AI key OFF the browser
//  (Week 1, Slide 23: "secrets live on the server, never in the frontend").
//
//  This process only runs locally (`npm run dev`), where Vite proxies /api to
//  it. In production the same logic is served by api/memes.js as a Vercel
//  Function — both share server/memes-core.js.
//
//  Contract the frontend depends on:
//    POST /api/memes   body: { category }   ->   { memes: [{ id, imageUrl, caption }] }
// ─────────────────────────────────────────────────────────────────────────────
import 'dotenv/config'
import express from 'express'
import { createMemes } from './memes-core.js'

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 8787

app.post('/api/memes', async (req, res) => {
  try {
    const memes = await createMemes(req.body?.category)
    res.json({ memes })
  } catch (err) {
    if (err.status) {
      res.status(err.status).json({ error: err.message })
      return
    }

    console.error('[/api/memes] failed:', err.message)

    // 504 = we gave up waiting on the model, which is retryable and worth
    // telling apart from a hard failure.
    const timedOut = /within \d+s|out of time/.test(err.message)
    res.status(timedOut ? 504 : 502).json({
      error: timedOut
        ? 'The meme generator took too long. Please try again.'
        : 'Failed to generate memes',
    })
  }
})

app.listen(PORT, () => {
  console.log(`🔥 Meme backend listening on http://localhost:${PORT}`)
})
