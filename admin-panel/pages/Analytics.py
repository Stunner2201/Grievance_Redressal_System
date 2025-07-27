# admin-panel/pages/3_Analytics.py
import streamlit as st
import pandas as pd
import plotly.express as px
from utils.api_client import api_client
from utils.auth import require_auth

@require_auth()
def show():
    st.title("Analytics Dashboard")
    
    # Time period filter
    time_period = st.selectbox(
        "Time Period",
        ["7 days", "30 days", "90 days", "1 year"],
        index=1
    )
    
    # Get analytics data
    response = api_client.get_analytics(time_period)
    
    if response and response.get("success"):
        data = response["data"]
        
        # Summary cards
        st.header("Summary Statistics")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Total Complaints", data["total_complaints"])
        with col2:
            st.metric("Resolved Complaints", data["resolved_count"])
        with col3:
            resolution_rate = (
                (data["resolved_count"] / data["total_complaints"] * 100) 
                if data["total_complaints"] > 0 else 0
            )
            st.metric("Resolution Rate", f"{resolution_rate:.1f}%")
        
        # Department-wise complaints
        st.header("Complaints by Department")
        dept_df = pd.DataFrame(data["by_department"])
        fig = px.bar(
            dept_df,
            x="name",
            y="count",
            color="name",
            title=f"Complaints by Department (Last {time_period})"
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Status distribution
        st.header("Status Distribution")
        status_df = pd.DataFrame([
            {"status": "Pending", "count": data["status_counts"]["pending"]},
            {"status": "In Progress", "count": data["status_counts"]["in_progress"]},
            {"status": "Resolved", "count": data["status_counts"]["resolved"]},
            {"status": "Rejected", "count": data["status_counts"]["rejected"]}
        ])
        fig = px.pie(
            status_df,
            names="status",
            values="count",
            title=f"Complaint Status (Last {time_period})"
        )
        st.plotly_chart(fig, use_container_width=True)
        
    else:
        st.error("Failed to load analytics data")