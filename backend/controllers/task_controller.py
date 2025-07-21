from uuid import uuid4
from fastapi import HTTPException, Request
from model import TaskBase

from db import get_task_collection


def get_all_tasks(request: Request):
    """
    Retrieve all tasks
    """
    task_collection = get_task_collection()
    user_id = request.state.user_id
    if task_collection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        tasks = list(task_collection.find({"user_id": user_id},{"_id": 0}))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")
    return tasks

def create_task(
    task: TaskBase,
    request: Request,
):
    """
    Create a new task
    """
    task_collection = get_task_collection()
    
    if task_collection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        create_task_dict = {
            "task_id": str(uuid4()),
            "user_id": request.state.user_id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "due_date": task.due_date.isoformat(),
        }
        result = task_collection.insert_one(create_task_dict)
        return {"id": str(result.inserted_id), "message": "Task created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")
    
def get_task_by_id(
    task_id: str,
):
    """Get a task by its ID"""
    task_collection = get_task_collection()
    if task_collection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        task = task_collection.find_one({"task_id": task_id})
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching task: {str(e)}")
    
def edit_task_by_id(
    task_id: str,
    task: TaskBase,
):
    """
    Edit an existing task
    """
    task_collection = get_task_collection()
    if task_collection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        result = task_collection.update_one({"task_id": task_id}, {"$set": task.dict()})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")
    
def delete_task_by_id(
    task_id: str,
):
    """
    Delete a task by its ID
    """
    task_collection = get_task_collection()
    if task_collection is None:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        result = task_collection.delete_one({"task_id": task_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")