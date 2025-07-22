from datetime import datetime
import unittest
from .utils import get_handler, login_handler, post_handler, delete_handler, put_handler

class TestTask(unittest.TestCase):
    """Test cases for Task API"""

    def setUp(self):
        """Setup: login and ensure at least one task exists, then store its id."""
        # Login and get token
        response = login_handler("admin", "admin")
        self.assertEqual(response.status_code, 200)
        self.token = response.json().get("access_token")
        self.assertIsNotNone(self.token)

        # Get all tasks
        response = get_handler("/api/tasks", self.token)
        self.assertEqual(response.status_code, 200)
        tasks = response.json()

        # If no tasks, create one
        if tasks == []:
            create_resp = post_handler("/api/tasks", {
                "title": "Initial Task",
                "description": "This is the initial task.",
                "due_date": datetime.now().isoformat(),
            }, self.token)
            self.assertEqual(create_resp.status_code, 200)
            response = get_handler("/api/tasks", self.token)
            self.assertEqual(response.status_code, 200)
            tasks = response.json()

        self.assertIsInstance(tasks, list)
        self.assertGreater(len(tasks), 0)
        self.task_id = tasks[0].get("task_id")
        
    def test_create_task(self):
        """Test creating a new task"""
        response = post_handler("/api/tasks", {
            "title": "Test Task",
            "description": "This is a test task.",
            "due_date": datetime.now().isoformat(),
        }, self.token)
        self.assertEqual(response.status_code, 200)

    def test_get_task_by_id(self):
        """Test getting a task by ID"""
        response = get_handler(f"/api/tasks/{self.task_id}", self.token)
        self.assertEqual(response.status_code, 200)

    def test_update_task(self):
        """Test updating an existing task"""
        response = put_handler(f"/api/tasks/{self.task_id}", {
            "title": "Updated Task",
            "description": "This is an updated test task.",
            "due_date": datetime.now().isoformat()
        }, self.token)
        self.assertEqual(response.status_code, 200)

    def test_delete_task(self):
        """Test deleting a task by ID"""
        response = delete_handler(f"/api/tasks/{self.task_id}", self.token)
        self.assertEqual(response.status_code, 200)