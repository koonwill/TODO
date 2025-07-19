from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, EmailStr

# User Model
class User(BaseModel):
    """
    Base model for user data
    """
    user_id: UUID = Field(default_factory=uuid4, unique=True)
    username: str
    email: EmailStr
    password_hash: str

class UserCreate(BaseModel):
    """
    Model for user creation, excluding password hash.
    """
    username: str
    email: EmailStr
    password: str

# Task Model
class TaskBase(BaseModel):
    """
    Base model for task data, including common fields for creation and updates.
    """
    task_id: UUID = Field(default_factory=uuid4, unique=True)
    user_id: UUID
    title: str
    description: str = Field(default="")
    completed: bool = Field(default=False)
    due_date: datetime
