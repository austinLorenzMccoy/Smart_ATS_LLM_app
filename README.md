<div align="center">

# 🚀 AI Career Copilot

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![PNPM](https://img.shields.io/badge/PNPM-9+-f69220)](https://pnpm.io/)
[![Google Generative AI](https://img.shields.io/badge/Gemini-API-4285F4)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Commercial-orange)](./LICENSE-commercial)

<img src="https://img.icons8.com/color/96/000000/resume.png" alt="AI Career Copilot Logo" width="120"/>

**Full-stack platform for AI-driven resume intelligence, career coaching, and job-market insights**

</div>

AI Career Copilot combines a FastAPI backend with a Next.js frontend to deliver resume rewriting, skill-gap analysis, role-fit scoring, career coaching, job alerts, and progress tracking powered by Google Gemini. The project now supports a multi-step analyzer wizard, persistent dashboards, and commercial licensing.

---

## 📦 Monorepo Structure

```
.
├── backend/
│   ├── src/
│   │   ├── api/api.py            # FastAPI application with 20+ endpoints
│   │   ├── models/gemini.py      # Gemini model wrappers
│   │   └── utils/prompts.py      # Prompt builders for all features
│   ├── requirements.txt
│   └── tests/
│       ├── test_api.py
│       ├── test_prompts.py
│       └── ...
├── frontend/
│   └── smart-ats-ui/
│       ├── app/
│       │   ├── dashboard/
│       │   │   ├── page.tsx          # Dashboard home
│       │   │   ├── analyzer/page.tsx # 5-step wizard (new)
│       │   │   ├── analyze/page.tsx  # Legacy single-page analyzer
│       │   │   ├── coach/page.tsx    # Career coach chat
│       │   │   └── jobs/page.tsx     # Job alerts & tracker
│       │   └── page.tsx              # Landing page
│       ├── components/
│       │   ├── analyzer/
│       │   ├── dashboard/
│       │   ├── jobs/
│       │   └── visualizations/
│       ├── store/useCareerCopilotStore.ts  # Zustand persistence
│       ├── package.json
│       └── pnpm-lock.yaml
├── LICENSE-commercial
├── README.md (this file)
└── .gitignore
```

---

## ✨ Feature Overview

### Backend API (FastAPI)
- 20+ endpoints covering resume intelligence, coaching, job insights, analytics, and progress tracking
- Google Gemini integration with structured prompt outputs
- PDF parsing, ATS simulation, orchestration planning, knowledge graph prompts, and more
- Test suite with pytest + httpx

### Frontend App (Next.js + shadcn/ui)
- **Analyzer Wizard**: 5-step guided flow with resume upload, job description, module selection, progress, and results
- **Results Dashboard**: Tabbed interface with Recharts visualizations (skill heatmap, keyword cloud, radar)
- **Career Coach**: Persistent chat with suggested prompts and resume context
- **Job Search Hub**: AI job alerts, application tracker, saved searches
- **Dashboard Home**: Quick actions, live stats, recent activity, progress tracker
- Zustand store for cross-page persistence (analysis history, job data, coach conversation)

---

## 🔐 Licensing

- The project ships with a **commercial license** (`LICENSE-commercial`).
- Contact the maintainers to obtain rights for redistribution or resale.
- Open-source dependencies retain their respective licenses.

---

## ⚙️ Environment Setup

### Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env            # create if needed
echo "GOOGLE_API_KEY=your_key" >> .env

# Run API
uvicorn src.api.api:app --reload
```

The API serves Swagger docs at `http://localhost:8000/docs` and ReDoc at `/redoc`.

### Frontend (Next.js)

```bash
cd frontend/smart-ats-ui
pnpm install

# Set API base URL
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" >> .env.local

# Start dev server
pnpm dev
```

Visit `http://localhost:3000` for the landing page and `/dashboard` for the app.

---

## 📊 Analyzer Wizard Flow

1. **Upload** – PDF drag/drop and/or paste resume text
2. **Job Description** – paste full JD (min length validation)
3. **Pick Analyses** – select modules or use quick picks
4. **Processing** – live progress bar and status updates
5. **Results** – tabbed insights, overall score badge, before/after comparison, visualizations

Results persist to the dashboard via the Zustand store (`useCareerCopilotStore`).

---

## 📈 Dashboard Metrics & Persistence

`frontend/smart-ats-ui/store/useCareerCopilotStore.ts` stores:

- Aggregate stats (total analyses, average match, skills improved)
- Recent analyses (for dashboard activity feed)
- Job applications + saved searches (for job tracker)
- Career coach conversation history

State persists in localStorage so browser refreshes keep context.

---

## 🧪 Testing

### Backend

```bash
cd backend
source venv/bin/activate
python -m pytest
```

### Frontend

Add React Testing Library / Playwright suites as needed. Current focus is on end-to-end flows once backend endpoints are stable.

---

## ♻️ Git Workflow & Ignore Rules

`.gitignore` has been updated to exclude:

- Python venvs (`venv/`, `.venv/`, etc.)
- Next.js build artifacts (`.next/`, `node_modules/`)
- Environment files (`backend/.env`, `frontend/.env.local`)
- Logs, coverage reports, temporary assets

Before committing:

```bash
git status
```

Ensure only relevant source changes are staged.

---

## 🚀 Deployment Notes

- Backend can be containerized with Uvicorn/Gunicorn for cloud deployment (AWS, GCP, Azure).
- Frontend supports Next.js static export or server rendering. Configure `NEXT_PUBLIC_API_BASE_URL` accordingly.
- Add CI/CD pipelines to run backend tests and lint frontend before deploys.

---

## 📄 Legal

- Commercial usage governed by `LICENSE-commercial`.
- Evaluate third-party API terms (Google Gemini) before production use.
- Do not commit API keys or customer data.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/awesome`
3. Commit changes with context-rich messages
4. Run backend tests and lint frontend
5. Open a pull request detailing changes and testing steps

---

## 📞 Support

For licensing, enterprise support, or feature requests, contact the maintainers with project context and timelines.

---

Enjoy building with AI Career Copilot! 🌟
