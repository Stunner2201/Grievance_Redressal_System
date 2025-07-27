import streamlit as st
import pandas as pd
import plotly.express as px
from utils.api_client import get_complaints, update_status
import time
import hashlib

def show():
    st.title("Complaints Management")
    
    # Initialize session state for tracking updates
    if 'last_update' not in st.session_state:
        st.session_state.last_update = None
    
    # Filters and data loading (keep your existing code)
    col1, col2 = st.columns(2)
    with col1:
        status_filter = st.selectbox(
            "Filter by Status",
            ["All", "Pending", "In Progress", "Resolved"],
            index=0
        )
    with col2:
        search_query = st.text_input("Search by Ticket ID or Description")
    
    filters = {}
    if status_filter != "All":
        filters["status"] = status_filter
    if search_query:
        filters["search"] = search_query
    
    complaints = get_complaints(filters)
    
    if complaints:
        df = pd.DataFrame(complaints)
        df['created_at'] = pd.to_datetime(df['created_at'])
        df['updated_at'] = pd.to_datetime(df['updated_at'])
        
        # Display stats and table (keep your existing code)
        st.subheader("Complaints Overview")
        col1, col2, col3 = st.columns(3)
        col1.metric("Total Complaints", len(df))
        col2.metric("Pending", len(df[df['status'] == "Pending"]))
        col3.metric("Resolved", len(df[df['status'] == "Resolved"]))
        
        st.subheader("Status Distribution")
        status_counts = df['status'].value_counts().reset_index()
        status_counts.columns = ['Status', 'Count']
        fig = px.pie(status_counts, values='Count', names='Status')
        st.plotly_chart(fig, use_container_width=True)
        
        st.subheader("All Complaints")
        st.dataframe(
            df[['ticket_id', 'department_name', 'status', 'created_at', 'description']],
            column_config={
                "ticket_id": "Ticket ID",
                "department_name": "Department",
                "status": "Status",
                "created_at": "Created At",
                "description": "Description"
            },
            hide_index=True,
            use_container_width=True
        )
        
        # Status update section with improved flow
        st.subheader("Update Complaint Status")
        selected_ticket = st.selectbox(
            "Select Complaint",
            df['ticket_id'].tolist()
        )
        
        # Get current status of selected complaint
        current_status = df[df['ticket_id'] == selected_ticket]['status'].values[0]
        
        new_status = st.selectbox(
            "New Status",
            ["Pending", "In Progress", "Resolved"],
            index=["Pending", "In Progress", "Resolved"].index(current_status)
        )
        
        notes = st.text_area("Resolution Notes (optional)")
        officer_name = st.text_input("Officer Name", "Admin Officer")
        
        # Only show update button if status is different
        if current_status != new_status:
            if st.button("Update Status"):
                try:
                    request_hash = hashlib.md5((selected_ticket + str(time.time())).encode()).hexdigest()
                    
                    update_data = {
                        "status": new_status,
                        "notes": notes,
                        "officer": officer_name,
                        "request_id": request_hash
                    }
                    
                    result = update_status(selected_ticket, update_data)
                    if result:
                        st.session_state.last_update = {
                            'ticket_id': selected_ticket,
                            'status': new_status,
                            'time': time.time()
                        }
                        st.success(f"Status updated to {new_status} for ticket {selected_ticket}")
                        
                        # Show notification preview
                        with st.expander("Notification Preview"):
                            status_messages = {
                                'Pending': f"🔄 Complaint #{selected_ticket} is now PENDING\n\n"
                                         f"Our team has received your complaint and will review it shortly.",
                                'In Progress': f"🛠️ Complaint #{selected_ticket} is IN PROGRESS\n\n"
                                             f"Officer {officer_name} is working on your case.\n"
                                             "Expected resolution within 3-5 working days.",
                                'Resolved': f"✅ Complaint Resolved ({df[df['ticket_id'] == selected_ticket].iloc[0]['department_name']})\n\n"
                                           f"Ticket ID: {selected_ticket}\n"
                                           f"Status: Resolved\n"
                                           f"Resolved by: {officer_name}\n"
                                           f"Resolution Details:\n{notes if notes else 'Completed'}\n\n"
                                           "Thank you for using Rohtak Grievance System.\n\n"
                                           f"Rate our service: https://example.com/feedback/{selected_ticket}"
                            }
                            
                            notification_message = status_messages.get(new_status)
                            st.code(notification_message)
                        
                        # Rerun to refresh the interface
                        st.experimental_rerun()
                
                except Exception as e:
                    st.error(f"Error updating status: {str(e)}")
        else:
            st.info("Select a different status to update this complaint")
    
    else:
        st.warning("No complaints found matching your criteria")

if __name__ == "__main__":
    show()