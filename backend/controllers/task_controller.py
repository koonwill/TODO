from fastapi import Depends, HTTPException
from model import TaskBase

from db import get_task_collection


async def get_all_tasks(
    task_collection=Depends(get_task_collection)
):
    """
    Retrieve all tasks
    """
    if not task_collection:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        tasks = await task_collection.find().to_list(length=None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")
    return tasks

async def create_task(
    task: TaskBase,
    task_collection=Depends(get_task_collection)
):
    """
    Create a new task
    """
    if not task_collection:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        task_dict = task.dict()
        result = await task_collection.insert_one(task_dict)
        return {"id": str(result.inserted_id), "message": "Task created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")
    
async def get_task_by_id(
    task_id: str,
    task_collection=Depends(get_task_collection)
):
    """Get a task by its ID"""
    if not task_collection:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        task = await task_collection.find_one({"task_id": task_id})
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching task: {str(e)}")
    
async def edit_task_by_id(
    task_id: str,
    task: TaskBase,
    task_collection=Depends(get_task_collection)
):
    """
    Edit an existing task
    """
    if not task_collection:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        result = await task_collection.update_one({"task_id": task_id}, {"$set": task.dict()})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")
    
async def delete_task_by_id(
    task_id: str,
    task_collection=Depends(get_task_collection)
):
    """
    Delete a task by its ID
    """
    if not task_collection:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        result = await task_collection.delete_one({"task_id": task_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")