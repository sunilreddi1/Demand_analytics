# Internship Prediction & Recommendation System

This repository contains a web application and accompanying Python services for collecting internship listings, preprocessing data, training machine learning models, and offering recommendations and predictions for internship seekers.

## Features
- Web frontend built with Vite + React + TypeScript
- Backend Python services for data collection, preprocessing, and ML modeling (Flask/Streamlit components)
- Data ingestion from multiple job boards (Adzuna, Indeed, GitHub Jobs, Internshala, RemoteOK)
- Model training and evaluation artifacts under `python/model_output`
- Preprocessed datasets stored under `preprocessing_output` and `python/preprocessing_output`
- Resume parsing and resume search utilities
- Docker support and docker-compose for deployment

## Repository Layout

- `src/` — Frontend React app (TypeScript)
  - `components/` — Reusable UI components
  - `pages/` — App pages (Explore, Recommend, Predict, Dashboard, etc.)
  - `python/` — Python services and ML pipeline

- `python/` — Python scripts and services
  - `app.py`, `flask_app.py` — Flask apps and API endpoints
  - `ml_models.py`, `model_training.py` — Model training and evaluation
  - `preprocessing.py`, `preprocessing_output/` — Data preparation
  - `live_data_fetcher.py` — Collect data from job boards
  - `resume_parser.py`, `resume_search` — Resume utilities
  - `requirements.txt` — Python dependencies

- `preprocessing_output/`, `model_output/`, `eda_output/` — Generated artifacts
- `docker-compose.yml`, `Dockerfile.frontend`, `python/Dockerfile` — Containerization

## Setup (Development)

Prerequisites:
- Node >= 16, npm or Yarn
- Python 3.10+ and virtual environment
- Docker (optional for containers)

1. Clone the repo

	git clone <repo-url>
	cd internship-prediction-recommendation-system

2. Frontend install

	npm install

3. Python environment

	python -m venv venv
	# Windows PowerShell
	Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
	.\\venv\\Scripts\\Activate.ps1
	pip install -r python/requirements.txt

4. Environment variables

	- Create `.env` or set variables required by `python/app.py` or `python/flask_app.py` (API keys for data sources if used).

## Run Locally

Frontend (dev):

	npm run dev

Python API (development):

	# from repository root with venv active
	python python/flask_app.py

Streamlit (optional):

	streamlit run python/streamlit_app.py

## Docker / Production

Build and start with docker-compose:

	docker-compose up --build

This will build the frontend and the Python service containers defined in `docker-compose.yml`.

## Data & Model Artifacts

- Preprocessed data: `preprocessing_output/` and `python/preprocessing_output/`
- Model outputs and reports: `model_output/` and `python/model_output/`
- Live data caches: `live_data/` and `python/live_data/`

If you want to retrain models, inspect `python/model_training.py` and `python/ml_models.py` to see required inputs and hyperparameters. Training outputs are saved to `python/model_output/`.

## Troubleshooting

- If front-end dev server fails: ensure correct Node version and run `npm install` again.
- If Python deps fail: activate venv and `pip install -r python/requirements.txt`.
- For permission errors on Windows PowerShell, run the `Set-ExecutionPolicy` command shown above with Administrator rights as needed.

## Contributing

1. Fork and create a feature branch
2. Run tests and linters (if present)
3. Submit a pull request with a clear description

## Contact

Maintainer: Sunil (project owner)

If you'd like, I can also:
- Add a quick start script that sets up the venv and installs deps
- Document API endpoints in `python/flask_app.py`
- Add a CONTRIBUTING.md and CODE_OF_CONDUCT

---
Generated and updated README on behalf of repository maintainer.

