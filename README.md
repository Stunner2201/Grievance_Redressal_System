# Grievance Redressal System

[![GitHub Repo](https://img.shields.io/badge/repo-Grievance_Redressal_System-blue)](https://github.com/Stunner2201/Grievance_Redressal_System)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language](https://img.shields.io/badge/Node.js-Backend-brightgreen)](https://nodejs.org/)
[![Language](https://img.shields.io/badge/Python-AdminDashboard-blue)](https://www.python.org/)

A **WhatsApp-based Grievance Redressal System** for citizens of Rohtak, enabling easy complaint filing, tracking, and resolution through a **chatbot** and **admin dashboard**.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Database Design](#database-design)
- [Installation & Usage](#installation--usage)
- [Screenshots](#screenshots)



---

## Problem Statement

Citizens face challenges in filing grievances:

- Lack of a **centralized system**.
- Reliance on **manual processes** or fragmented portals.
- **No tracking mechanism** for complaint status.
- Poor accountability for administrators.

This causes **delays, inefficiency, and frustration** in issue resolution.

---

## Solution Overview

This project provides a **transparent, accessible, and trackable** grievance handling system:

- Citizens file complaints via **WhatsApp chatbot**.
- Complaints are stored in **PostgreSQL** with unique **ticket IDs**.
- **Admins** manage and update complaints via a **Streamlit dashboard**.
- Citizens receive **real-time updates** on complaint status via WhatsApp.

---

## Features

### Citizen Side (WhatsApp Chatbot)

- **Grievance Filing**: Submit complaint details (name, category, description).  
- **Automatic Department Routing**: Complaints categorized and assigned automatically.  
- **Ticket ID & Status Updates**: Receive ticket ID and real-time status updates.

### Admin Side (Streamlit Dashboard)

- **Secure Login**: Access with admin credentials.  
- **Complaint Management**: View, filter, and update complaint status.  
- **Real-Time Notifications**: WhatsApp messages sent automatically upon status change.  
- **Analytics Dashboard**: Visualize complaints by category, resolution rate, and pending issues.

---

## Tech Stack

| Component           | Technology Used                          |
| ------------------- | ---------------------------------------- |
| Chatbot             | WhatsApp API (Twilio)                    |
| Backend             | Node.js (Express)                        |
| Database            | PostgreSQL                               |
| Admin Dashboard     | Streamlit (Python)                       |
| Deployment          | VPS Hosting (BigRock / Any cloud server) |
| Version Control     | Git + GitHub                             |

---

## System Architecture


<img width="441" height="438" alt="Screenshot 2025-09-25 at 1 06 59 AM" src="https://github.com/user-attachments/assets/1c880788-1080-4aa7-bd0a-f4527aeb8729" />

---

## Folder Structure

```text
Grievance_Redressal_System/
│   # Node.js backend
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── .env
│
├── admin-panel/         # Streamlit Admin Dashboard
│   ├── app.py
│   └── requirements.txt
│
├── database/                # PostgreSQL scripts or schema
│   └── init.sql
│
├── architecture_diagram.png # System architecture image
├── README.md
└── LICENSE
```
## Database Design
<img width="444" height="297" alt="Screenshot 2025-09-25 at 1 09 11 AM" src="https://github.com/user-attachments/assets/934da031-7d16-40c4-a8df-258235d8e6db" />

## Installation & Usage
Follow these steps to set up the District Level Grievance Redressal System locally:

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/grievance-redressal-system.git
cd grievance-redressal-system
```
### 2. Setup PostgreSQL Database
```bash
CREATE DATABASE grievance_system;
```
```bash
Example
CREATE TABLE citizens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    address TEXT
);

CREATE TABLE complaints (
    ticket_id SERIAL PRIMARY KEY,
    citizen_id INT REFERENCES citizens(id),
    department VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'Pending',
    remarks TEXT
);

```
### 3. Backend Setup (Node.js + Express)
1.Go to backend folder:
```bash
npm install
```
2.Create a .env file in the backend directory:
```bash
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886  # Sandbox or production number
DATABASE_URL=postgresql://user:password@localhost:5432/grievance_system
```
3.Run backend server:
```bash
node server.js
```
### 4.Streamlit Admin Dashboard Setup
 1.Go to dashboard folder:
 ```bash
cd admin-panel
pip install -r requirements.txt
```
2.Run dashboard:
```bash
streamlit run app.py --server.port=8501
```
3.Access in browser:
```bash
https://localhost:8501
```
### 5.Twilio Sandbox Setup (For Development)
- Login to Twilio Console

- Activate WhatsApp Sandbox.

- Send the join code (e.g., join bright-sky) to the Twilio sandbox number (+14155238886).

- After joining, type “Hello” on WhatsApp to start using the chatbot.



## Usage:
### 1.Citizen Flow 

- Send a message on WhatsApp chatbot ( “Hello”).

- If not already registered, the bot will ask for:

-Full Name 

-Email 

-Address 

- Once registered, the citizen can file a complaint by providing: 

- Department (e.g., Water, Electricity, Roads, etc.) 

- Complaint Description 

- Location of the issue 

- Complaint is stored in the system and a unique Ticket ID is generated. 

- Citizen receives a confirmation message with the Ticket ID. 

- Status updates (Pending → In Progress → Resolved) are automatically sent on WhatsApp as the complaint progresses. 

 

### 2.Admin Flow 

- Log in to Streamlit dashboard. 

- View and manage complaints.

- Update status (Pending → Resolved) and add remarks.

- Citizens are notified automatically on WhatsApp when updates are made.

## Screenshots
### Chatbot Flow
<img width="625" height="342" alt="Screenshot 2025-09-25 at 1 24 08 AM" src="https://github.com/user-attachments/assets/4c763baa-af8c-47db-abea-164c7f2896d2" />


### Admin Dashboard
<img width="623" height="295" alt="Screenshot 2025-09-25 at 1 24 25 AM" src="https://github.com/user-attachments/assets/0f5df9f2-46e2-4dc1-a833-05f973c504d0" />
<img width="626" height="155" alt="Screenshot 2025-09-25 at 1 24 39 AM" src="https://github.com/user-attachments/assets/bf1594a6-7c07-46b5-af7f-865c3f98333f" />
<img width="629" height="307" alt="Screenshot 2025-09-25 at 1 24 52 AM" src="https://github.com/user-attachments/assets/7a66713a-d37e-4791-881f-1c3f24258106" />
