export type Tempo = 'Slow' | 'Medium' | 'Fast'
export type Mood = 'Positive' | 'Neutral' | 'Serious'
export type LyricsPreference = 'Lyrics' | 'No Lyrics' | 'No Preference'

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
  genreOverride?: Genre[]
  lyricsPreference?: LyricsPreference
  limit?: number
}

export interface RecommendedSong {
  artist: string
  title: string
  genre: string
  fmaUrl: string
  matchScore: number
  popularity: string
}

export interface RecommendationResponse {
  recommendations: RecommendedSong[]
}
