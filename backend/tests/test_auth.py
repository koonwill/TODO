import unittest
from .utils import get_handler, login_handler, post_handler
from db import get_user_collection


class TestAuth(unittest.TestCase):
    """Test cases for API authentication"""

    def setUp(self):
        """Test valid login"""
        response = login_handler("admin", "admin")
        self.assertEqual(response.status_code, 200)
        self.token = response.json().get("access_token")
        self.assertIsNotNone(self.token)

    def test_login_invalid(self):
        """Test login with invalid credentials"""
        response = login_handler("admin", "wrongpassword")
        self.assertEqual(response.status_code, 401)

    def test_access_protected_route_without_token(self):
        """Test access to a protected route without token"""
        response = get_handler("/api/tasks", "")
        self.assertEqual(response.status_code, 401)

    def test_access_protected_route_with_expired_token(self):
        """Test access to a protected route with an expired token, 
        all tasks route is covered with dependency to check_token 
        before making a request"""
        expired_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTRkOTZlMDctM2JiMy00YTExLTk1Y2ItYWJjNWYxYzRhNDEzIiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTc1MzE5NDA5OX0.onSIopcRSPbG4AuL6QbplRkAICRKXLJMTauLPQI6FlY"
        response = get_handler("/api/tasks", expired_token)
        self.assertEqual(response.status_code, 401)

    def test_register_user(self):
        """Test user registration"""
        response = post_handler("/api/auth/register", {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword"
        }, None)
        self.assertEqual(response.status_code, 200)

        """Test existing username registration"""
        response = post_handler("/api/auth/register", {
            "username": "testuser",
            "email": "test1@example.com",
            "password": "testpassword"
        }, None)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Username already taken",
                      response.json().get("detail", ""))

        """Test existing email registration"""
        response = post_handler("/api/auth/register", {
            "username": "testuser1",
            "email": "test@example.com",
            "password": "testpassword"
        }, None)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email already registered",
                      response.json().get("detail", ""))

        """Clean up registered user"""
        user_collection = get_user_collection()
        user_collection.delete_one({"username": "testuser"})
