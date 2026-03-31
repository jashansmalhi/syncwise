# SyncWise

SyncWise is a music-to-ad matching web app that recommends FMA tracks for ad briefs using a FastAPI backend, local model artifacts, and Ollama Cloud feature extraction.

Users can:
- Submit ad details on the main page
- Receive ranked song recommendations from the backend
- Refine the sound direction with campaign controls such as energy, tempo, mood, lyrics preference, and preferred genre

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS + React Router
- Backend: FastAPI + Pydantic + Pandas + scikit-learn
- LLM provider: Ollama Cloud
- Architecture: split `frontend/` and `backend/`, env-driven API URL, artifact-backed recommendation service

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
    artifacts/
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

Required artifacts for the backend live in `backend/artifacts/`:

- `scaler_v3.pkl`
- `pca_v3.pkl`
- `v4_weights.json`
- `fma_pre_z_filtered_avail.csv`

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
MODEL_ARTIFACT_DIR=./backend/artifacts
OLLAMA_API_KEY=
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=ministral-3:3b
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
  "genreOverride": ["Electronic"],
  "lyricsPreference": "No Lyrics",
  "limit": 5
}
```

Returns:

- `recommendations`
- `llmFallbackUsed`

Each recommendation includes:

- `title`
- `artist`
- `genre`
- `fmaUrl`
- `matchScore`
- `popularity`

## Recommendation Runtime

The backend recommendation flow lives in:

- `backend/app/services/recommendation_service.py`

It uses:

- campaign controls from the request
- Ollama Cloud to estimate `danceability` and `acousticness`
- local model artifacts from `backend/artifacts/`
- a fallback of `0.5 / 0.5` if the Ollama request fails or no API key is configured

## Deployment Notes (Free Hosting)

### Frontend

- Vercel
- Build command: `npm run build`
- Output dir: `dist`
- Root directory: `frontend`
- Set `VITE_API_BASE_URL` to the deployed backend URL

### Backend

- Render Web Service
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Backend artifacts are committed in `backend/artifacts/`
- Set env vars from `backend/.env.example`

## Deployment Environment Variables

### Vercel

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

### Render

```env
APP_NAME=SyncWise API
APP_ENV=production
FRONTEND_URLS=https://your-vercel-app.vercel.app
MODEL_ARTIFACT_DIR=/opt/render/project/src/backend/artifacts
OLLAMA_API_KEY=your_ollama_key
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=ministral-3:3b
```

## Current Feature Checklist

- Home page with hero, ad form, and recommendations section
- V4 recommendation backend with artifact-backed ranking
- Ollama-backed ad feature extraction with neutral fallback
- Responsive startup-style UI
- Loading, empty, and error states
- API-driven recommendation cards with live FMA links
- GitHub-connected deployment path via Vercel and Render
