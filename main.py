from db import get_database,get_task_collection, get_user_collection
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from router import task, auth

app = FastAPI()
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """
    Startup event to initialize the application.
    """
    if get_database() is not None:
        print("Database connection established successfully.")
    if get_task_collection() is not None:
        print("Task collection is ready.")
    if get_user_collection() is not None:
        print("User collection is ready.")
    else:
        raise HTTPException(status_code=500, detail="Database connection error")

app.include_router(task.router)
app.include_router(auth.router)

app.get("/")
async def root():
    return {"message": "Welcome to the To-Do API!"}