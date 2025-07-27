# admin-panel/utils/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API configuration
    API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000/admin")
    API_TIMEOUT = 30
    
    # Auth configuration
    LOGIN_ENDPOINT = "/auth/login"
    TOKEN_REFRESH_ENDPOINT = "/auth/refresh"
    
    # Streamlit config
    PAGE_TITLE = "Rohtak Grievance Admin"
    PAGE_ICON = "📋"
    LAYOUT = "wide"