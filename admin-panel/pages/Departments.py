import streamlit as st
import pandas as pd
import plotly.express as px
from utils.api_client import get_department_stats

def show():
    st.title("Department Statistics")
    
    # Get department stats
    stats = get_department_stats()
    
    if stats:
        df = pd.DataFrame(stats)
        
        # Calculate accurate totals
        total_complaints = int(df['total_complaints'].sum())
        total_resolved = int(df['resolved'].sum())
        resolution_rate = (total_resolved / total_complaints * 100) if total_complaints > 0 else 0
        
        # Summary metrics
        st.subheader("Summary")
        col1, col2, col3 = st.columns(3)
        col1.metric("Total Departments", len(df))
        col2.metric("Total Complaints", total_complaints)
        col3.metric("Avg Resolution Rate", 
                   f"{resolution_rate:.1f}%")
        
        # Department-wise stats
        st.subheader("Department Performance")
        
        # Sortable table with proper numeric types
        display_df = df.copy()
        display_df['resolution_rate'] = display_df['resolution_rate'].apply(lambda x: f"{x:.1f}%")
        
        st.dataframe(
            display_df[['department', 'total_complaints', 'pending', 'resolved', 'resolution_rate']],
            column_config={
                "department": "Department",
                "total_complaints": st.column_config.NumberColumn("Total Complaints", format="%d"),
                "pending": st.column_config.NumberColumn("Pending", format="%d"),
                "resolved": st.column_config.NumberColumn("Resolved", format="%d"),
                "resolution_rate": "Resolution Rate"
            },
            hide_index=True,
            use_container_width=True
        )
        
        # Visualizations
        tab1, tab2 = st.tabs(["Complaint Volume", "Resolution Rates"])
        
        with tab1:
            fig = px.bar(
                df,
                x='department',
                y='total_complaints',
                title="Total Complaints by Department",
                labels={'total_complaints': 'Number of Complaints', 'department': 'Department'}
            )
            st.plotly_chart(fig, use_container_width=True)
        
        with tab2:
            fig = px.bar(
                df.sort_values('resolution_rate'),
                x='department',
                y='resolution_rate',
                title="Resolution Rate by Department (%)",
                labels={'resolution_rate': 'Resolution Rate %', 'department': 'Department'}
            )
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.error("Failed to load department statistics")

if __name__ == "__main__":
    show()