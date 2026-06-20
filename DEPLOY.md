# Deploy: Vercel (Frontend) + Render (Backend)

Step-by-step guide to deploy Resume Customizer to production.

```
User → https://your-app.vercel.app (Frontend)
              ↓
       https://resume-customizer-api.onrender.com (Backend)
              ↓
            Groq / Gemini / OpenAI
```

---

## Prerequisites

1. GitHub account with this repo pushed (recommended)
2. [Render](https://render.com) account (free tier works)
3. [Vercel](https://vercel.com) account (free tier works)
4. LLM API key (Groq recommended — `LLM_PROVIDER=groq`)

> **Never commit `.env` files.** Use platform secret env vars only.

---

## Part 1: Deploy Backend on Render

### Option A — Blueprint (fastest)

1. Push `resume-customizer-app/` to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render detects `render.yaml` at the repo root — click **Apply**
5. When prompted, enter secret values:
   - `GROQ_API_KEY` (or keys for your chosen provider)
   - `CORS_ORIGINS` — temporarily set to `http://localhost:3000` (update after Vercel deploy)

### Option B — Manual Web Service

1. **New** → **Web Service** → connect GitHub repo
2. Settings:

   | Field | Value |
   |-------|-------|
   | Name | `resume-customizer-api` |
   | Root Directory | `backend` |
   | Runtime | Python 3 |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
   | Health Check Path | `/health` |

3. **Environment Variables** (Render dashboard → Environment):

   ```env
   LLM_PROVIDER=groq
   GROQ_API_KEY=gsk_your_key_here
   CORS_ORIGINS=https://your-app.vercel.app
   MAX_UPLOAD_SIZE_MB=10
   PYTHON_VERSION=3.11.9
   ```

4. Click **Create Web Service** and wait for deploy (~2–5 min)

5. Copy your backend URL, e.g. `https://resume-customizer-api.onrender.com`

6. Verify:
   ```bash
   curl https://resume-customizer-api.onrender.com/health
   ```

---

## Part 2: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. **Import** your GitHub repository
3. Configure project:

   | Field | Value |
   |-------|-------|
   | Framework Preset | Next.js |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` (default) |
   | Output Directory | `.next` (default) |

4. **Environment Variables**:

   ```env
   NEXT_PUBLIC_API_URL=https://resume-customizer-api.onrender.com
   ```

   > Use your actual Render URL — no trailing slash.

5. Click **Deploy**

6. After deploy, copy your Vercel URL, e.g. `https://resume-customizer.vercel.app`

---

## Part 3: Connect Frontend ↔ Backend

1. **Update Render `CORS_ORIGINS`** with your Vercel URL:
   ```env
   CORS_ORIGINS=https://resume-customizer.vercel.app
   ```
   For multiple origins (local + prod):
   ```env
   CORS_ORIGINS=http://localhost:3000,https://resume-customizer.vercel.app
   ```

2. Render will auto-redeploy after env change

3. **Redeploy Vercel** if you changed `NEXT_PUBLIC_API_URL` (required — it's baked in at build time)

4. Open your Vercel URL and test:
   - Paste a job description
   - Upload a PDF/DOCX resume
   - Click **Customize Resume**

---

## Monorepo note

If your GitHub repo root is `App/` (parent folder), set these root directories in each platform:

| Platform | Root Directory |
|----------|----------------|
| Render | `resume-customizer-app/backend` |
| Vercel | `resume-customizer-app/frontend` |

Move or copy `render.yaml` to the GitHub repo root and update `rootDir`:

```yaml
rootDir: resume-customizer-app/backend
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| **CORS error** in browser | Set `CORS_ORIGINS` to exact Vercel URL (`https://`, no trailing `/`) |
| **Network error / failed fetch** | Check `NEXT_PUBLIC_API_URL` in Vercel env vars, then redeploy |
| **502 / timeout** | Render free tier has ~30s request limit; LLM calls can be slow on cold start. Retry or upgrade Render plan |
| **Cold start delay** | Render free tier sleeps after 15 min inactivity — first request takes ~30s |
| **API key error** | Verify `GROQ_API_KEY` (or your provider key) in Render Environment tab |
| **Build fails on Render** | Ensure `PYTHON_VERSION=3.11.9` is set |

---

## Production checklist

- [ ] `.env` files are NOT in git
- [ ] `GROQ_API_KEY` set in Render (not in code)
- [ ] `CORS_ORIGINS` includes production Vercel URL
- [ ] `NEXT_PUBLIC_API_URL` points to Render backend URL
- [ ] `/health` returns `{"status":"healthy"}`
- [ ] End-to-end test: upload resume + JD on live site

---

## Custom domain (optional)

**Vercel:** Project → Settings → Domains → add your domain

**Render:** Service → Settings → Custom Domains

Then update:
- `CORS_ORIGINS=https://yourdomain.com`
- Redeploy both services
