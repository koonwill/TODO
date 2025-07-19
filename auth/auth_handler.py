from fastapi import HTTPException, Request
from model import User
from db import get_user_collection
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bool(
        bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    )

def create_access_token(user_id: str):
    """
    Create a JWT access token for the user.
    """
    # This is a placeholder for JWT creation logic
    return "fake_access_token"

def create_refresh_token(user_id: str):
    """
    Create a JWT refresh token for the user.
    """
    # This is a placeholder for JWT creation logic
    return "fake_refresh_token"

def authenticate_user(username: str, password: str):
    """
    Authenticate user by username and password.
    """
    user_collection = get_user_collection()
    user = user_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {
        "access_token": create_access_token(user['user_id']),
        "refresh_token": create_refresh_token(user['user_id']),
    }

def check_token(request: Request):
    """
    Dependency to check the token in the request.
    """
    token = request.headers.get("Authorization").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")
    if token != "valid_token":
        raise HTTPException(status_code=403, detail="Invalid token")
    return "Token is valid"

def create_user(user: User):
    """
    Function to create a new user.
    """
    user_collection = get_user_collection()
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    try:
        user_dict = user.dict()
        result = user_collection.insert_one(user_dict)
        return {"id": str(result.inserted_id), "message": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")