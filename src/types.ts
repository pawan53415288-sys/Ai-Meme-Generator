export interface Meme {
  id: string
  imageUrl: string
  caption: string
}

export type Category = 'bollywood' | 'cartoon' | 'viral-songs' | 'sports'

export const CATEGORIES: Category[] = [
  'bollywood',
  'cartoon',
  'viral-songs',
  'sports',
]

export interface GenerateMemesResponse {
  memes: Meme[]
}

export interface ApiError {
  error: string
}