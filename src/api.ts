import type { ApiError, Category, GenerateMemesResponse } from './types'

export class MemeApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MemeApiError'
  }
}

export async function generateMemes(category: Category): Promise<GenerateMemesResponse> {
  let response: Response

  try {
    response = await fetch('/api/memes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    })
  } catch {
    throw new MemeApiError('Could not reach the server. Is it running?')
  }

  if (!response.ok) {
    let message = 'Failed to generate memes'
    try {
      const body = (await response.json()) as ApiError
      if (body.error) {
        message = body.error
      }
    } catch {
      // fall back to the default message
    }
    throw new MemeApiError(message)
  }

  return (await response.json()) as GenerateMemesResponse
}