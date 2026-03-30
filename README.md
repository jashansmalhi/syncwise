# SyncWise MVP

SyncWise is a local-first music-tech web app that matches ad characteristics to songs.

Users can:
- Submit ad details on the main page
- Receive 5 ranked mock song recommendations from a FastAPI backend
- Use a second page to submit song metadata (dummy UX flow)

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS + React Router
- Backend: FastAPI + Pydantic
- Architecture: split `frontend/` and `backend/`, env-driven API URL, modular recommendation service

## Folder Structure

```text
SyncWise/
  frontend/
    src/
      api/
      components/
      pages/
      types/
  backend/
    app/
      api/
      core/
      data/
      models/
      services/
  README.md
```

## Local Setup

### 1. Clone and enter project

```bash
git clone <your-repo-url>
cd SyncWise
```

### 2. Backend setup (FastAPI on port 8000)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

Expected:

```json
{"status":"ok"}
```

### 3. Frontend setup (Vite on port 5173)

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App URL:

- `http://localhost:5173`

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```env
APP_NAME=SyncWise API
APP_ENV=development
FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173
```

## API

### `GET /health`
Returns service status.

### `POST /recommendations`
Accepts:

```json
{
  "adDescription": "Fast-paced electric SUV ad with quick cuts and innovation message",
  "energy": 4,
  "tempo": "Fast",
  "mood": "Positive",
  "industry": "Automotive",
  "genre": "Electronic"
}
```

Returns top 5:

- `id`
- `title`
- `artist`
- `genre`
- `energy`
- `tempo`
- `mood`
- `matchScore`
- `explanation`
- `image`

## Mock Recommendation Logic

The backend uses a rule-based scoring service in:

- `backend/app/services/recommendation_service.py`

Scoring factors:

- Genre exact match boost
- Mood exact match boost
- Tempo exact match boost
- Energy proximity boost
- Industry tag boost
- Keyword boosts from ad description and song keyword tags

Data source:

- `backend/app/data/mock_songs.py` (20 realistic mock songs)

## Where to swap in real ML later

Keep the API contract and replace internals of:

- `RecommendationService.get_recommendations(...)`

Suggested next evolution:

1. Move mock songs to DB/vector store
2. Add feature extraction/embeddings for ad text
3. Call model inference service in `services/`
4. Keep route + schema files unchanged to avoid frontend breakage

## Deployment Notes (Free Hosting)

### Frontend

- Vercel or Netlify
- Build command: `npm run build`
- Output dir: `dist`
- Set `VITE_API_BASE_URL` to deployed backend URL

### Backend

- Render Web Service
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set env vars from `.env.example`

## MVP Feature Checklist

- Home page with hero, ad form, and recommendations section
- Music submission page with dummy success flow
- No auth/login
- Responsive startup-style UI
- Loading, empty, and error states
- API-driven recommendation cards with realistic metadata
- Local-first structure with straightforward cloud deployment path
