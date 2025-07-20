from auth.auth_handler import authenticate_user, create_user
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from db import get_user_collection
from model import User

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    User login endpoint.
    """
    try:
        token = await authenticate_user(form_data.username, form_data.password)
        return {
            "access_token": token.access_token,
            "refresh_token": token.refresh_token,
        }
    except HTTPException as e:
        raise e

@router.post("/register")
async def register(user: User):
    """
    User registration endpoint.
    """
    return await create_user(user)