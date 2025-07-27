import streamlit as st

# Page configuration
st.set_page_config(
    page_title="Rohtak Grievance System Admin Panel",
    layout="wide",
    page_icon="📋"
)

# Sidebar navigation
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Complaints", "Departments"])

if page == "Complaints":
    from pages import Complaints
    st.rerun()  # Force page reload
elif page == "Departments":
    from pages import Departments
    st.rerun()