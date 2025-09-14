import streamlit as st

# Page configuration
st.set_page_config(
    page_title="Rohtak Grievance System Admin Panel",
    layout="wide",
    page_icon="📋"
)

# Use columns to center the content
# We create three columns: a blank one on the left, a central one for content,
# and another blank one on the right. The central column is wider.
col1, col2, col3 = st.columns([1, 3, 1])

# Content is placed inside the central column (col2)
with col2:
    # Display logo
    st.image("logo.jpeg", width=500)

    # Title
    st.markdown("## **Grievance Redressal System**")

    # Short welcome message
    st.markdown("""
    Welcome to the Admin Panel.  
    Use the sidebar to navigate to **Complaints** and **Departments**.
    """)
