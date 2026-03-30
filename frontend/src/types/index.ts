export type Tempo = 'Slow' | 'Medium' | 'Fast'
export type Mood = 'Positive' | 'Neutral' | 'Serious'

export type Industry =
  | 'Tech'
  | 'Entertainment'
  | 'Automotive'
  | 'Retail'
  | 'F&B'
  | 'Finance'
  | 'Healthcare'

export type Genre =
  | 'Electronic'
  | 'Chiptune'
  | 'Sound Art'
  | 'Rock'
  | 'Punk'
  | 'Metal'
  | 'Post-Punk'
  | 'Post-Rock'
  | 'Pop'
  | 'Indie-Rock'
  | 'Psych-Rock'
  | 'Folk'
  | 'Psych-Folk'
  | 'Old-Time / Historic'
  | 'Hip-Hop'
  | 'Trip-Hop'
  | 'Jazz'
  | 'Blues'
  | 'Classical'
  | 'Soundtrack'
  | 'International'
  | 'Kid-Friendly'
  | 'Compilation'

export interface RecommendationRequest {
  adDescription: string
  energy: number
  tempo: Tempo
  mood: Mood
  industry: Industry
  genre: Genre
  limit?: number
}

export interface RecommendedSong {
  id: string
  title: string
  artist: string
  genre: string
  energy: number
  tempo: string
  mood: string
  matchScore: number
  explanation: string
  image?: string
}

export interface RecommendationResponse {
  recommendations: RecommendedSong[]
}
