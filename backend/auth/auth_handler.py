from datetime import timedelta, datetime, timezone
from uuid import uuid4
import bcrypt
import jwt
from decouple import config
from fastapi import HTTPException, Request

from db import get_user_collection
from model import User

access_token_expiry = config('ACCESS_TOKEN_EXPIRE_MINUTES', cast=int)
refresh_token_expiry = config('REFRESH_TOKEN_EXPIRE_MINUTES', cast=int)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bool(
        bcrypt.checkpw(plain_password.encode('utf-8'),
                       hashed_password.encode('utf-8'))
    )


def create_access_token(user_id: str, username: str):
    """
    Create a JWT access token for the user.
    """
    expire_delta = datetime.now(timezone.utc) + \
        timedelta(minutes=access_token_expiry)
    json_payload = {
        "user_id": user_id,
        "username": username,
        "exp": expire_delta
    }
    return jwt.encode(
        json_payload,
        config('JWT_ACCESS_TOKEN_SECRET_KEY', cast=str),
        algorithm=config('JWT_ALGORITHM', cast=str),
    )


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
        "access_token": create_access_token(user['user_id'], user['username']),
    }


def check_token(request: Request):
    """
    Dependency to check the token in the request.
    """
    token = request.headers.get("Authorization").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")
    try:
        payload = jwt.decode(
            token,
            config('JWT_ACCESS_TOKEN_SECRET_KEY', cast=str),
            algorithms=[config('JWT_ALGORITHM', cast=str)],
        )
        user_id = get_user_collection().find_one({"username": payload.get("username")})
        request.state.user_id = user_id['user_id']
        request.state.username = payload.get("username")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")


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
        user_schema = {
            "user_id": str(uuid4()),
            "username": user.username,
            "email": user.email,
            "password_hash": bcrypt.hashpw(user.password.encode('utf-8'),
                                           bcrypt.gensalt()).decode('utf-8')
        }
        result = user_collection.insert_one(user_schema)
        return {"id": str(result.inserted_id), "message": "User created successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error creating user: {str(e)}")
