## Backend Setup & Usage

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Set up environment variables

Copy `sample.env` to `.env` and update values as needed:

```bash
cp sample.env .env
```

### 3. Run the FastAPI server

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000 by default.

---

## Running Tests

From the `backend` directory, run:


```bash
python -m unittest tests.test_auth
python -m unittest tests.test_task
```

---

## Project Structure

- `main.py` - FastAPI app entry point
- `model.py` - Schema of user/tasks endpoint
- `db.py` - Database connection
- `router/` - API route definitions
- `controllers/` - Business logic
- `auth/` - Authentication logic
- `tests/` - Unit tests
