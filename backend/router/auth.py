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
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    User login endpoint.
    """
    try:
        token = authenticate_user(form_data.username, form_data.password)
        return token
    except HTTPException as e:
        raise e

@router.post("/register")
def register(user: User):
    """
    User registration endpoint.
    """
    return create_user(user)