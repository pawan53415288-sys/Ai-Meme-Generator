import type { CategoryId, Meme } from '../types'

// The server walks a list of free models before giving up, and the working ones
// are reasoning models that take 25-35s each, so this has to sit above the
// server's own 90s budget or we'd abort requests that were about to land.
const CLIENT_TIMEOUT_MS = 120_000

export async function generateMemes(category: CategoryId): Promise<Meme[]> {
  let response: Response
  try {
    response = await fetch('/api/memes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new Error('That took too long. Please try again.')
    }
    throw new Error("Couldn't reach the server. Is it running?")
  }

  if (!response.ok) {
    // The server sends { error } with a human-readable reason — read it instead
    // of replacing it with a generic message, so the UI can say what's wrong.
    throw new Error(await readError(response))
  }

  const { memes } = await response.json()
  if (!Array.isArray(memes) || memes.length === 0) {
    throw new Error('The generator returned no memes. Please try again.')
  }
  return memes as Meme[]
}

async function readError(response: Response): Promise<string> {
  const fallback = `Couldn't generate memes (HTTP ${response.status}).`
  try {
    const body = await response.json()
    return typeof body?.error === 'string' && body.error ? body.error : fallback
  } catch {
    return fallback
  }
}
