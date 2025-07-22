# TODO Web Application

This is a full-stack web application for managing tasks, built for a web developer test.

## Project Structure

```
TODO/
├── backend/      # FastAPI backend (API, DB, auth, tests)
├── frontend/     # React + TypeScript + Vite frontend
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md     # Project overview (this file)
```

---


## Quickstart

### Option 1: Run with Docker (Recommended)

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

   - The backend API will be available at http://localhost:8000
   - The frontend app will be available at http://localhost:5173

2. **Stop services:**

   Press `Ctrl+C` in the terminal, then run:

   ```bash
   docker-compose down
   ```

---

### Option 2: Manual Local Setup

#### 1. Backend

   ```bash
   cd backend
   pip install -r requirements.txt
   cp sample.env .env  # Edit as needed
   uvicorn main:app --reload
   ```
   API runs at http://localhost:8000

#### 2. Frontend

   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs at http://localhost:5173

---

## Testing

From the `backend` directory:

```bash
python -m unittest tests.test_auth
python -m unittest tests.test_task
```

---

## Features
- User registration & login (JWT auth)
- Create, read, update, delete tasks
- Due date & completion status
- Responsive UI with React, Tailwind CSS
