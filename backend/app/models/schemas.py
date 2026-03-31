from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class Tempo(str, Enum):
    slow = "Slow"
    medium = "Medium"
    fast = "Fast"


class Mood(str, Enum):
    positive = "Positive"
    neutral = "Neutral"
    serious = "Serious"


class Industry(str, Enum):
    tech = "Tech"
    entertainment = "Entertainment"
    automotive = "Automotive"
    retail = "Retail"
    fb = "F&B"
    finance = "Finance"
    healthcare = "Healthcare"


class Genre(str, Enum):
    electronic = "Electronic"
    chiptune = "Chiptune"
    sound_art = "Sound Art"
    rock = "Rock"
    punk = "Punk"
    metal = "Metal"
    post_punk = "Post-Punk"
    post_rock = "Post-Rock"
    pop = "Pop"
    indie_rock = "Indie-Rock"
    psych_rock = "Psych-Rock"
    folk = "Folk"
    psych_folk = "Psych-Folk"
    old_time_historic = "Old-Time / Historic"
    hip_hop = "Hip-Hop"
    trip_hop = "Trip-Hop"
    jazz = "Jazz"
    blues = "Blues"
    classical = "Classical"
    soundtrack = "Soundtrack"
    international = "International"
    kid_friendly = "Kid-Friendly"
    compilation = "Compilation"


class LyricsPreference(str, Enum):
    lyrics = "Lyrics"
    no_lyrics = "No Lyrics"
    no_preference = "No Preference"


class RecommendationRequest(BaseModel):
    adDescription: str = Field(..., min_length=5, max_length=1500)
    energy: int = Field(..., ge=1, le=5)
    tempo: Tempo
    mood: Mood
    industry: Industry
    genreOverride: Optional[List[Genre]] = None
    lyricsPreference: LyricsPreference = LyricsPreference.no_preference
    limit: int = Field(5, ge=1, le=10)


class RecommendedSong(BaseModel):
    artist: str
    title: str
    genre: str
    fmaUrl: str
    matchScore: float = Field(..., ge=0)
    popularity: str


class RecommendationResponse(BaseModel):
    recommendations: List[RecommendedSong]
