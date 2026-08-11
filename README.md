# Internship Prediction & Recommendation System

A full-stack internship discovery platform built with React, TypeScript, Vite, Flask, and Python. It helps users browse internships, predict demand, receive recommendations, and track applied opportunities.

## Overview

This project is designed for students and job seekers who want a smarter way to discover internships.
It includes:

- a modern dashboard for browsing internship listings
- a Flask API for predictions and recommendations
- analytics over internship listings and trends
- persistent application tracking with local and server-backed storage
- optional resume parsing and matching features

## Stealite Deployment

This repository is configured to host the Streamlit dashboard on a Stealite-compatible Python runtime.

- `Procfile` starts the dashboard with `streamlit run src/python/streamlit_app.py`
- `runtime.txt` pins Python to `python-3.11.12`
- Root `requirements.txt` installs the Python dependencies for Streamlit and the dashboard
- `.streamlit/config.toml` enables headless hosting and a dark theme

## Key Features

- Browse internships with filters for domain, city, source, and search text
- Predict internship demand using a trained ML model
- Get personalized internship recommendations based on student profile
- Save and manage applied internships from the UI
- Export applied internships as CSV
- Support live data fetching and cached datasets

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind-compatible styling

### Backend
- Python 3.10+
- Flask
- Flask-CORS
- Pandas, NumPy, Scikit-learn
- XGBoost
- Streamlit (optional dashboard)

## Project Structure

`	ext
.
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   └── python/
│       ├── app.py
│       ├── flask_app.py
│       ├── internship_data.py
│       ├── live_data_fetcher.py
│       ├── ml_models.py
│       ├── model_training.py
│       ├── preprocessing.py
│       ├── resume_parser.py
│       ├── streamlit_app.py
│       ├── requirements.txt
│       └── exports/ , live_data/ , model_output/ , preprocessing_output/
├── scripts/
│   ├── start-dev.ps1
│   └── stop-dev.ps1
├── Dockerfile.frontend
├── docker-compose.yml
├── package.json
└── README.md
`

## Prerequisites

Make sure the following are installed:

- Node.js 18+ and npm
- Python 3.10+
- Windows PowerShell (recommended for the provided scripts)
- Docker (optional)

## Setup Instructions

### 1. Clone the repository

`powershell
git clone <repo-url>
cd internship-prediction-recommendation-system
`

### 2. Install frontend dependencies

`powershell
npm install
`

### 3. Create and activate a Python virtual environment

`powershell
python -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
`

### 4. Install Python dependencies

`powershell
python -m pip install --upgrade pip
python -m pip install -r src/python/requirements.txt
`

## Running Locally

### Start the Streamlit Dashboard

If port `8501` is available:

`powershell
cd C:\Users\sunil\Downloads\internship-prediction-recommendation-system
.\.venv\Scripts\Activate.ps1
python -m streamlit run src/python/streamlit_app.py --server.port 8501 --server.address 0.0.0.0
`

If port `8501` is already in use, start on `8502` instead:

`powershell
python -m streamlit run src/python/streamlit_app.py --server.port 8502 --server.address 0.0.0.0
`

Open the dashboard in your browser at:

- `http://localhost:8501` or
- `http://localhost:8502`

### Start the backend

In one terminal:

`powershell
 =  0.0.0.0
 = 5000
python src/python/flask_app.py
`

### Start the frontend

In another terminal:

`powershell
npm run dev -- --host 0.0.0.0 --port 5173
`

Open the app at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### PowerShell helper scripts

From the repository root:

`powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-dev.ps1
`

To stop the services:

`powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-dev.ps1
`

## Permanent Local Server

For a local URL that stays available without keeping a terminal open:

### One-time setup

`powershell
npm install -g pm2
npm run build
npm install express compression
pm2 start server.js --name internship-app
pm2 save
`

### Access the app

Your app should be available at:

- http://localhost:8000

### Manage the background server

`powershell
pm2 status
pm2 restart internship-app
pm2 stop internship-app
pm2 resurrect
pm2 logs internship-app
`

## Optional: Run the Streamlit Dashboard

`powershell
streamlit run src/python/streamlit_app.py --server.port 8501
`

## How to Use the App

1. Open the frontend at http://localhost:5173
2. Browse internships on the Explore page
3. Use the Recommendation page to get tailored suggestions
4. Use the Prediction page to estimate internship demand

## Notes

- Local build and temporary files are excluded via .gitignore.
- Large local data files such as preprocessing_output/processed_data.csv and 	mp_repos_backup/ are not tracked in git.
