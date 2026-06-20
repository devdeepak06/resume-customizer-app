# Resume Customizer

An AI-powered web application that tailors a candidate's resume to match a specific job description. Upload a resume (PDF/DOCX), paste a job description, and receive a customized version with keyword alignment, missing keyword suggestions, and a match score.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router), React, Tailwind CSS, Shadcn UI |
| Backend | Python, FastAPI |
| LLM | Google Gemini (`google-generativeai`) or Groq API |
| Document Parsing | `pdfplumber` (PDF), `python-docx` (DOCX) |

## Project Structure

```
.
├── frontend/          # Next.js web application
│   ├── src/
│   │   ├── app/           # App Router pages & layout
│   │   ├── components/    # UI components (Shadcn + custom)
│   │   ├── lib/           # API client & download utilities
│   │   └── types/         # TypeScript interfaces
│   └── .env.example
├── backend/           # FastAPI server
│   ├── app/
│   │   ├── main.py        # Routes & CORS
│   │   ├── config.py      # Environment settings
│   │   ├── models.py      # Pydantic response models
│   │   ├── services/      # LLM integration
│   │   └── utils/         # Document parsing & match score
│   └── .env.example
└── README.md
```

## Architecture

```
┌─────────────────┐     POST /api/customize      ┌──────────────────┐
│  Next.js UI     │ ────────────────────────────▶│  FastAPI Backend │
│  (port 3000)    │     FormData: JD + resume    │  (port 8000)     │
└─────────────────┘                              └────────┬─────────┘
                                                          │
                        ┌─────────────────────────────────┼─────────────────────┐
                        ▼                                 ▼                     ▼
                 Document Parser                   Match Score            LLM Service
                 (PDF / DOCX)                     (keyword overlap)      (Gemini / Groq)
                        │                                 │                     │
                        └─────────────────────────────────┴─────────────────────┘
                                                          │
                                                          ▼
                                              Structured JSON Response
                                              (summary, skills, experience,
                                               missing keywords, tips)
```

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- An API key for **Gemini** ([Google AI Studio](https://aistudio.google.com/)) or **Groq** ([console.groq.com](https://console.groq.com/))

## Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv            # macOS/Linux (use `python` on Windows if available)
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and set your API key
```

Start the API server:

```bash
uvicorn app.main:app --reload --port 8000
```

Verify: `curl http://localhost:8000/health`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local if the backend runs on a different URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_PROVIDER` | `gemini`, `groq`, or `openai` | `gemini` |
| `GEMINI_API_KEY` | Google Gemini API key | — |
| `GROQ_API_KEY` | Groq API key | — |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.0-flash` |
| `GROQ_MODEL` | Groq model name | `llama-3.3-70b-versatile` |
| `OPENAI_API_KEY` | OpenAI API key (when `LLM_PROVIDER=openai`) | — |
| `OPENAI_MODEL` | OpenAI model | `gpt-4o-mini` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000` |
| `MAX_UPLOAD_SIZE_MB` | Max resume file size | `10` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

## API Endpoints

### `GET /health`

Health check. Returns server status and configured LLM provider.

### `POST /api/customize`

Accepts `multipart/form-data`:

| Field | Type | Description |
|-------|------|-------------|
| `job_description` | string | Job description text (min 50 chars) |
| `resume` | file | Resume file (PDF or DOCX, max 10 MB) |

**Response:**

```json
{
  "match_analysis": {
    "match_score": 72.0,
    "matched_keywords": ["Python", "AWS", "Generative AI"],
    "suggested_missing_keywords": ["Kubernetes", "Terraform"],
    "scoring_error": null
  },
  "customized_resume": {
    "summary": "...",
    "skills": ["..."],
    "experience": [{ "title": "...", "company": "...", "duration": "...", "bullets": ["..."] }],
    "education": [{ "degree": "...", "institution": "...", "year": "..." }],
    "missing_keywords": ["..."],
    "improvement_tips": ["..."]
  },
  "original_text_length": 4521
}
```

## Features

- **Document parsing** — Extracts text from PDF and DOCX resumes
- **AI customization** — Rewrites summary, reorders skills, and rephrases experience bullets to match the JD
- **Semantic match score** — LLM-powered ATS analysis (uses the same provider as `LLM_PROVIDER`)
- **Missing keywords** — Highlights JD terms absent from the original resume
- **Download** — Export the tailored resume as a plain-text file
- **Validation** — File type, size, and minimum JD length checks on both client and server

## Development

```bash
# Backend with auto-reload
cd backend && uvicorn app.main:app --reload

# Frontend dev server
cd frontend && npm run dev

# Frontend production build
cd frontend && npm run build
```

## Deployment (Vercel + Render)

Deploy the frontend to **Vercel** and the backend to **Render**.

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | [Vercel](https://vercel.com) | Root dir: `frontend`, env: `NEXT_PUBLIC_API_URL` |
| Backend | [Render](https://render.com) | Root dir: `backend`, see `render.yaml` |

**Full step-by-step guide:** [DEPLOY.md](./DEPLOY.md)

Quick summary:
1. Push repo to GitHub
2. Deploy backend on Render using `render.yaml` (set `GROQ_API_KEY`, `CORS_ORIGINS`)
3. Deploy frontend on Vercel (set `NEXT_PUBLIC_API_URL` to your Render URL)
4. Update `CORS_ORIGINS` on Render with your Vercel URL

## License

MIT
