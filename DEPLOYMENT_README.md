# InternMatch AI - Deployment & Setup Guide

## Project Overview

**InternMatch AI** is a full-stack internship discovery and recommendation platform with:
- React + Vite frontend (TypeScript, Tailwind CSS)
- Flask backend REST API (Python)
- Streamlit analytics dashboard
- Persistent application tracking
- Live job data fetching from multiple sources
- ML-based demand prediction & recommendations
- Resume parsing & skill matching

---

## ✅ What's New (Latest Changes)

### 1. **Applied Applications Tracking**
- New "Applied" page in navigation (between Profile & Resume Search)
- **Server-side persistence**: Applied applications saved to `src/python/applied_applications.json`
- Syncs between frontend and backend via REST API endpoints
- Survives browser refresh and server restarts

### 2. **Applied Page Features**
- **List all applications**: Click "Applied" in navbar to view all saved internships
- **Expandable details**: Click any card to reveal:
  - Full job description
  - Duration, rating, openings, work type
  - Required skills (tagged display)
  - Direct "Apply Now" link
- **Withdraw applications**: Remove any application with one click
- **Export to CSV**: Download all applied internships as CSV file

### 3. **Backend API Endpoints**
```
GET  /api/applied              → Fetch all applied application IDs
POST /api/applied              → Add or remove an application
     { "id": <int>, "action": "add"|"remove" }
```

### 4. **Docker Support**
- `src/python/Dockerfile`: Backend (Flask on port 5000)
- `Dockerfile.frontend`: Frontend (Nginx on port 80)
- `docker-compose.yml`: Orchestrate both services

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm/yarn

### Step 1: Install Dependencies

**Backend:**
```powershell
cd src/python
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Frontend:**
```bash
npm install
```

### Step 2: Start Services

Open **3 separate terminals** in the project root:

**Terminal 1 - Backend (Flask API):**
```powershell
$env:FLASK_RUN_HOST='0.0.0.0'
$env:FLASK_RUN_PORT='5000'
python .\src\python\flask_app.py
```
→ Runs on `http://localhost:5000`

**Terminal 2 - Frontend (Vite dev server):**
```bash
npm run dev
```
→ Runs on `http://localhost:5173`

**Terminal 3 - Streamlit Dashboard (optional):**
```powershell
.\src\python\venv\Scripts\Activate.ps1
streamlit run .\src\python\streamlit_app.py --server.port 8501
```
→ Runs on `http://localhost:8501`

### Step 3: Access the Application

Open browser and go to: **http://localhost:5173**

---

## 📋 Feature Walkthrough

### Home Page
- Overview of the platform
- Quick stats and navigation
- Shows count of applied internships

### Explore Page
- Browse 30,000+ internships
- **Filters**: Domain, City, Work Type
- **Search**: By title, company, skills, domain
- **Sort**: By demand score, applications, stipend, rating
- **Apply Toggle**: Click "Apply" button to save internship
- **Applied Status**: Green checkmark shows applied positions

### Applied Page ⭐ (NEW)
1. Click **Applied** in navbar
2. See all saved internships
3. Click any card to expand and view:
   - Full description
   - Duration, rating, openings, type
   - Required skills
   - Apply Now link
4. **Withdraw**: Remove from applications
5. **Export CSV**: Download all applied jobs

### Dashboard Page
- 10+ interactive charts
- Domain distribution, city analysis
- Stipend ranges, skill demand
- Monthly trends, growth forecasts
- Radar charts for domain comparison

### Recommendations Page
- AI-powered job matching
- Personalized based on profile
- Match scores for each internship

### Predictor Page
- Demand score prediction
- Input internship details
- Get ML-based demand forecast

### Profile Page
- Set skills (with autocomplete)
- Select domain interests
- Choose location & work preferences
- Minimum stipend slider

### Resume Search Page
- Upload/paste resume
- Automatic skill extraction
- Ranked internship matches

---

## 🏗️ Architecture

```
internship-prediction-recommendation-system/
├── src/
│   ├── App.tsx                           # Main React app with routing
│   ├── main.tsx                          # Vite entry point
│   ├── components/
│   │   └── Navbar.tsx                    # Navigation (8 pages)
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── AppliedPage.tsx               # ⭐ NEW - Applied applications
│   │   ├── DashboardPage.tsx
│   │   ├── RecommendPage.tsx
│   │   ├── PredictPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── ResumeSearchPage.tsx
│   ├── data/
│   │   └── internships.ts                # Mock data generator & types
│   ├── utils/
│   │   └── cn.ts                         # Classname utility
│   └── python/
│       ├── flask_app.py                  # Main REST API
│       ├── Dockerfile                    # Backend container
│       ├── requirements.txt
│       ├── internship_data.py
│       ├── preprocessing.py
│       ├── ml_models.py
│       ├── model_training.py
│       ├── live_data_fetcher.py
│       ├── resume_parser.py
│       ├── streamlit_app.py              # Dashboard UI
│       ├── applied_applications.json     # ⭐ NEW - Persistent storage
│       └── venv/                         # Python environment
├── Dockerfile.frontend                   # Frontend container
├── docker-compose.yml                    # Multi-container orchestration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## 🔌 API Endpoints

### Internships
- `GET /api/internships` - List with pagination, filters, search
- `GET /api/domains` - Available domains
- `GET /api/cities` - Available cities
- `GET /api/skills` - Required skills across all jobs
- `GET /api/sources` - Data source distribution

### Predictions & Recommendations
- `POST /api/predict` - Demand score prediction
- `POST /api/recommend` - Personalized recommendations

### Applied Applications (NEW)
- `GET /api/applied` - Fetch all applied IDs
- `POST /api/applied` - Add/remove application

### Resume
- `POST /api/resume/parse` - Parse resume text
- `POST /api/resume/search` - Find matching internships

### Analytics
- `GET /api/analytics` - Summary stats

---

## 💾 Data Persistence

### Applied Applications
**Location:** `src/python/applied_applications.json`

**Format:**
```json
[123, 456, 789, ...]
```

**Lifecycle:**
1. User clicks "Apply" on Explore page
2. Frontend sends POST to `/api/applied`
3. Backend updates `applied_applications.json`
4. File persists on disk
5. On app reload, backend loads from file
6. Frontend fetches via GET `/api/applied`

---

## 🐳 Docker Deployment

### Build Images
```bash
docker compose build
```

### Run Containers
```bash
docker compose up
```

**Services:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000` (Nginx)

---

## 📊 Production Build

### Build Frontend
```bash
npm run build
```

Output: `dist/` directory ready for deployment

### Deployment Options

**Option 1: Vercel (Frontend)**
```bash
npm install -g vercel
vercel
```

**Option 2: Render (Full Stack)**
- Backend on Render
- Frontend on Vercel or Netlify

**Option 3: Docker Hub**
```bash
docker tag internship-prediction-recommendation-system_backend:latest <username>/internmatch-backend:latest
docker tag internship-prediction-recommendation-system_frontend:latest <username>/internmatch-frontend:latest
docker push <username>/internmatch-backend:latest
docker push <username>/internmatch-frontend:latest
```

---

## 🛠️ Development Workflow

### File Changes Made

**New Files:**
- `src/pages/AppliedPage.tsx` - Applied applications page with expandable details
- `src/python/Dockerfile` - Backend containerization
- `Dockerfile.frontend` - Frontend containerization
- `docker-compose.yml` - Multi-service orchestration

**Modified Files:**
- `src/App.tsx` - Added route for "Applied" page, sync with backend on load
- `src/components/Navbar.tsx` - Added "Applied" nav item
- `src/python/flask_app.py` - Added `/api/applied` endpoints, persistent storage

### Local Testing
1. Apply to several internships on Explore page
2. Refresh browser — applications should persist
3. Go to Applied page
4. Click cards to expand and see descriptions
5. Withdraw an application
6. Restart backend — data persists in JSON file

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Applied" page not visible | Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) |
| Applications not persisting | Check Flask is running; verify `src/python/applied_applications.json` exists |
| CORS errors | Backend is configured with CORS; ensure Flask runs on `http://localhost:5000` |
| Port conflicts | Change `FLASK_RUN_PORT` or `vite` config if ports are in use |
| Module not found (Python) | Ensure venv is activated: `. venv/Scripts/activate` (PowerShell) |
| npm install fails | Delete `node_modules` and `package-lock.json`, then `npm install` again |

---

## 📝 Recent Session Summary

**Date:** 2026-07-17

**Completed:**
- ✅ Set up local development environment (Node, Python)
- ✅ Started all three services (Flask, Vite, Streamlit)
- ✅ Implemented Applied Applications tracking page
- ✅ Added server-side persistence for applied IDs
- ✅ Synced frontend/backend with REST API
- ✅ Added expandable job descriptions in Applied page
- ✅ Implemented CSV export for applications
- ✅ Created Docker setup files
- ✅ Verified hot-reload development workflow

**Services Running:**
- Backend: http://localhost:5000 ✅
- Frontend: http://localhost:5173 ✅
- Streamlit: http://localhost:8501 ✅

---

## 📧 Support

For issues or features:
1. Check browser console (F12 → Console) for JavaScript errors
2. Check Flask terminal for Python errors
3. Verify all services are running on correct ports
4. Review this README for setup instructions

---

**Happy internship hunting! 🎯**
