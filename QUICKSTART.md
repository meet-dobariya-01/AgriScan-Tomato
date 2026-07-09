# Quick Start Guide

## Setup

1. Open a terminal and go to the project root:

```bash
cd Tomato_Disease_Classification
```

2. Install backend dependencies:

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Run

Start the backend:

```bash
cd ../backend
uvicorn main:app --reload --port 8000
```

Start the frontend:

```bash
cd ../frontend
npm run dev
```

Open the browser at:

```text
http://localhost:5173
```

## Model file

Make sure this file exists before running the backend:

```text
backend/models/best_model.h5
```

## Notes

- Use JPG or PNG images.
- The app is for local testing and review.
- If the backend cannot load the model, place the model file in `backend/models/`.
