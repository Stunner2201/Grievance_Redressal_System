module.exports = {
  createUser: `
    INSERT INTO users (phone_number, name, email, location)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (phone_number)
    DO UPDATE SET name = $2, email = $3, location = $4
    RETURNING *`,
  getUserByPhone: `
    SELECT * FROM users WHERE phone_number = $1;
  `,
   createComplaint: `
    INSERT INTO complaints (
      ticket_id, user_id, user_phone, department_id,
      category, description, location_details
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  getComplaintByTicket: `
    SELECT c.*, d.department_name, u.name as user_name, u.phone_number
    FROM complaints c
    JOIN departments d ON c.department_id = d.department_id
    JOIN users u ON c.user_id = u.user_id
    WHERE c.ticket_id = $1;
  `,
  getFaqs: `
    SELECT * FROM faqs WHERE is_active = true;
  `,
  getDepartments: `
    SELECT * FROM departments;
  `,
  updateComplaintStatus: `
    UPDATE complaints 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE ticket_id = $2
    RETURNING *;
  `,
  addStatusUpdate: `
    INSERT INTO status_updates (complaint_id, status, officer_notes, updated_by)
    VALUES ($1, $2, $3, $4);
  `,



getComplaintsByDepartment: `
    SELECT c.*, u.name as user_name, u.phone_number 
    FROM complaints c
    JOIN users u ON c.user_id = u.user_id
    WHERE c.department_id = $1
    ORDER BY c.created_at DESC
    LIMIT $2
  `,
  
  getComplaintDetails: `
    SELECT 
      c.*, 
      d.department_name,
      u.name as user_name, u.phone_number, u.email,
      json_agg(su) as status_updates
    FROM complaints c
    JOIN departments d ON c.department_id = d.department_id
    JOIN users u ON c.user_id = u.user_id
    LEFT JOIN status_updates su ON su.complaint_id = c.complaint_id
    WHERE c.ticket_id = $1
    GROUP BY c.complaint_id, d.department_name, u.name, u.phone_number, u.email
  `


};