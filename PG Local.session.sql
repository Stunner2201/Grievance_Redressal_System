-- Add these to your existing init.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(complaint_id),
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_success BOOLEAN DEFAULT FALSE
);

-- ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    department_id INTEGER REFERENCES departments(department_id),
    is_superadmin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DEPARTMENT TEMPLATES
CREATE TABLE IF NOT EXISTS status_templates (
    template_id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(department_id),
    status VARCHAR(50) NOT NULL,
    template_text TEXT NOT NULL,
    UNIQUE(department_id, status)
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, is_superadmin)
VALUES ('admin', crypt('admin123', gen_salt('bf')), TRUE)
ON CONFLICT (username) DO NOTHING;

-- Insert default status templates
INSERT INTO status_templates (department_id, status, template_text) VALUES
(NULL, 'Pending', '🔄 Complaint #{ticketId} is now PENDING\n\nWe have received your complaint.'),
(NULL, 'In Progress', '🛠️ Complaint #{ticketId} is IN PROGRESS\n\nOfficer: {officer}\nEst. Resolution: {eta}'),
(NULL, 'Resolved', '✅ Complaint #{ticketId} RESOLVED\n\nResolution: {notes}'),
(NULL, 'Rejected', '❌ Complaint #{ticketId} REJECTED\n\nReason: {reason}');