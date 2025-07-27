// server.js
const express = require('express');
const app = express();
const db = require('./db');
const cors=require('cors')

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:8501'],
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  credentials: true
}));

const whatsappWebhook = require('./twilio/webhook');
app.post('/whatsapp-webhook', whatsappWebhook.handleIncomingMessage);
// Routes
const complaintsRoutes = require('./admin/routes/complaints');
const departmentsRoutes = require('./admin/routes/departments');

app.use('/admin', complaintsRoutes);
app.use('/admin/departments', departmentsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  db.initializeDatabase().catch(err => {
    console.error('Database initialization failed:', err);
  });
});