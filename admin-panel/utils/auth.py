# admin-panel/utils/auth.py
import streamlit as st
import requests
import base64
from utils.config import Config

def login(username, password):
    """Authenticate with the backend API"""
    try:
        # Encode credentials for Basic Auth
        auth_string = f"{username}:{password}"
        base64_auth = base64.b64encode(auth_string.encode()).decode()
        
        response = requests.post(
            f"{Config.API_BASE_URL}/auth/login",  # You'll need to add this endpoint
            headers={"Authorization": f"Basic {base64_auth}"},
            timeout=Config.API_TIMEOUT
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Login error: {e}")
        return None

def logout():
    """Clear authentication data"""
    if 'auth_token' in st.session_state:
        del st.session_state.auth_token
    if 'user' in st.session_state:
        del st.session_state.user

def is_authenticated():
    """Check if user is authenticated"""
    return 'auth_token' in st.session_state

def get_auth_token():
    """Get the current auth token"""
    return st.session_state.get('auth_token', '')

def require_auth():
    """Decorator to protect routes"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            if not is_authenticated():
                st.warning("Please login to access this page")
                return login_page()
            return func(*args, **kwargs)
        return wrapper
    return decorator

def login_page():
    """Render the login page"""
    st.title("Admin Login")
    
    with st.form("login_form"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        submitted = st.form_submit_button("Login")
        
        if submitted:
            if login(username, password):
                st.success("Login successful!")
                st.experimental_rerun()
            else:
                st.error("Invalid username or password")
    
    return False