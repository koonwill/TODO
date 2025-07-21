from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, EmailStr

# User Model
class User(BaseModel):
    """
    Base model for user data
    """
    username: str
    email: EmailStr
    password: str
    class Config:
        json_encoders = {UUID: str, datetime: lambda dt: dt.isoformat()}
        allow_population_by_field_name = True

# Task Model
class TaskBase(BaseModel):
    """
    Base model for task data, including common fields for creation and updates.
    """
    title: str
    description: str = Field(default="")
    completed: bool = Field(default=False)
    due_date: datetime
    
    class Config:
        json_encoders = {UUID: str, datetime: lambda dt: dt.isoformat()}
        allow_population_by_field_name = True
