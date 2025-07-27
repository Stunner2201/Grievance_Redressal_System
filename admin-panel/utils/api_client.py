import requests
import streamlit as st

API_BASE = "http://localhost:3000/admin"

def get_complaints(filters=None):
    try:
        response = requests.get(
            f"{API_BASE}/complaints",
            params=filters or {},
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {str(e)}")
        return None

def get_complaint(ticket_id):
    try:
        response = requests.get(
            f"{API_BASE}/complaints/{ticket_id}",
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {str(e)}")
        return None

# def update_status(ticket_id, status):
#     try:
#         response = requests.put(
#             f"{API_BASE}/complaints/{ticket_id}/status",
#             json={"status": status},
#             timeout=10
#         )
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         st.error(f"API Error: {str(e)}")
#         return None

def get_department_stats():
    try:
        response = requests.get(
            f"{API_BASE}/departments/stats/all",
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {str(e)}")
        return None
    

def update_status(ticket_id, update_data):
    try:
        response = requests.put(
            f"{API_BASE}/complaints/{ticket_id}/status",
            json=update_data
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Failed to update status: {str(e)}")
        return None