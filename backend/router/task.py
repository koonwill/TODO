from controllers.task_controller import edit_task_by_id, get_all_tasks, create_task, get_task_by_id, delete_task_by_id
from fastapi import APIRouter, Depends, Request
from auth.auth_handler import check_token
from model import TaskBase

router = APIRouter(
    prefix="/api/tasks",
    tags=["tasks"],
    dependencies=[Depends(check_token)],
)

@router.get("/")
def get_tasks(request: Request):
    """
    Get all tasks for the current user.
    """
    return get_all_tasks(request)

@router.post("/")
def create_new_task(
    task: TaskBase,
    request: Request,
):
    """
    Create a new task.
    """
    return create_task(task, request)

@router.get("/{task_id}")
def get_task(
    task_id: str,
):
    """
    Get a task by its ID.
    """
    return get_task_by_id(task_id)

@router.put("/{task_id}")
def update_task(
    task_id: str,
    task: TaskBase,
):
    """
    Edit an existing task.
    """
    return edit_task_by_id(task_id, task)

@router.delete("/{task_id}")
def delete_task(
    task_id: str):
    """
    Delete a task by its ID.
    """
    return delete_task_by_id(task_id)