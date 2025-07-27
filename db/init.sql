-- Safe Database Initialization Script
-- This version only creates tables if they don't exist and inserts default data safely
-- WARNING: No DROP TABLE statements included - these should only be in a separate setup.sql

-- Users table (only creates if not exists)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    ward_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table (safe creation)
CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    whatsapp_group_id VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints table (safe creation)
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    user_phone VARCHAR(20) NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(department_id),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location_details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255)
);

-- Status updates history (safe creation)
CREATE TABLE IF NOT EXISTS status_updates (
    update_id SERIAL PRIMARY KEY,
    complaint_id INTEGER NOT NULL REFERENCES complaints(complaint_id),
    status VARCHAR(50) NOT NULL,
    officer_notes TEXT,
    updated_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ table (safe creation)
CREATE TABLE IF NOT EXISTS faqs (
    faq_id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial departments (only if they don't exist)
INSERT INTO departments (department_id, department_name, description) VALUES
(1, 'Public Works Department', 'Handles roads, bridges, and public infrastructure'),
(2, 'Municipal Corporation', 'Handles sanitation, water supply, and city maintenance'),
(3, 'Electricity Department', 'Handles power supply and electrical issues'),
(4, 'Health Department', 'Handles hospitals and public health concerns'),
(5, 'Police Department', 'Handles law and order issues')
ON CONFLICT (department_id) DO UPDATE SET
    department_name = EXCLUDED.department_name,
    description = EXCLUDED.description;

-- Insert sample FAQs (only if they don't exist)
INSERT INTO faqs (faq_id, question, answer, category) VALUES
(1, 'How do I file a complaint?', 'Send "COMPLAINT" to this number and follow the instructions.', 'general'),
(2, 'How long for resolution?', 'Typically 3-7 working days depending on department.', 'general'),
(3, 'Can officers contact me?', 'Yes, they may call you on your registered number.', 'general'),
(4, 'How to check status?', 'Send "STATUS [your-ticket-id]" to this number.', 'tracking')
ON CONFLICT (faq_id) DO UPDATE SET
    question = EXCLUDED.question,
    answer = EXCLUDED.answer,
    category = EXCLUDED.category;

-- Create indexes for better performance (safe creation)
CREATE INDEX IF NOT EXISTS idx_complaints_ticket_id ON complaints(ticket_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user_phone ON complaints(user_phone);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);

-- Add any missing columns (safe alteration)
DO $$
BEGIN
    -- Example: Add column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='complaints' AND column_name='priority'
    ) THEN
        ALTER TABLE complaints ADD COLUMN priority VARCHAR(20) DEFAULT 'Normal';
    END IF;
    
    -- Add more columns as needed
END $$;

-- Create or update database functions
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to keep timestamps updated
DO $$
BEGIN
    -- For complaints table
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_complaints_modtime'
    ) THEN
        CREATE TRIGGER update_complaints_modtime
        BEFORE UPDATE ON complaints
        FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
    END IF;
    
    -- Add triggers for other tables as needed
END $$;