from controllers.task_controller import edit_task_by_id, get_all_tasks, create_task, get_task_by_id, delete_task_by_id
from fastapi import APIRouter, Depends, HTTPException
from auth.auth_handler import check_token
from model import TaskBase

router = APIRouter(
    prefix="/api/tasks",
    tags=["tasks"],
    dependencies=[Depends(check_token)],
)

@router.get("/")
async def get_tasks(
):
    """
    Get all tasks.
    """
    return await get_all_tasks()

@router.post("/")
async def create_new_task(
    task: TaskBase,
):
    """
    Create a new task.
    """
    return await create_task(task)

@router.get("/{task_id}")
async def get_task(
    task_id: str,
):
    """
    Get a task by its ID.
    """
    return await get_task_by_id(task_id)

@router.put("/{task_id}")
async def update_task(
    task_id: str,
    task: TaskBase,
):
    """
    Edit an existing task.
    """
    return await edit_task_by_id(task_id, task)

@router.delete("/{task_id}")
async def delete_task(
    task_id: str):
    """
    Delete a task by its ID.
    """
    return await delete_task_by_id(task_id)