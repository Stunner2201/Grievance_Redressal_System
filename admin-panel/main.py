import streamlit as st

# Page configuration
st.set_page_config(
    page_title="Rohtak Grievance System Admin Panel",
    layout="wide",
    page_icon="📋"
)

# Home Page Content
# Display logo (make sure "logo.png" is in your project folder or adjust path)
# st.image("logo.png", width=120)

# Title
st.markdown("## **Grievance Redressal System**")

# Short welcome message
st.markdown("""
Welcome to the Admin Panel.  
Use the sidebar to navigate to **Complaints** and **Departments**.
""")
