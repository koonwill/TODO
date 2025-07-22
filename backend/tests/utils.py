from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def get_handler(path, token):
    """
    Helper function to perform GET requests with authentication.
    """
    return client.get(
        path,
        headers={"Authorization": f"Bearer {token}"}
        )
    
def post_handler(path, data, token):
    """
    Helper function to perform POST requests with authentication.
    """
    return client.post(
        path,
        json=data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
def delete_handler(path, token):
    """
    Helper function to perform DELETE requests with authentication.
    """
    return client.delete(
        path,
        headers={"Authorization": f"Bearer {token}"}
    )
    
def put_handler(path, data, token):
    """
    Helper function to perform PUT requests with authentication.
    """
    return client.put(
        path,
        json=data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
def login_handler(username, password):
    """
    Helper function to perform form POST request for login
    """
    return client.post(
        "/api/auth/login",
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )