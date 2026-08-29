# 🎟️ CodeAlpha Event Registration System

A full-stack **Event Registration System** that allows users to discover upcoming events, explore event details, and register easily. Administrators can securely manage events and view registered participants.

## 🚀 Live Demo

👉 https://codealpha-event-registration-qq5z.onrender.com

---

## ✨ Features

### 👤 User Features

- View upcoming events
- Explore detailed event information
- Register for events
- Team name – Optional
- Number of members – Optional
- Duplicate registration prevention
- Event capacity validation
- Registration confirmation email

### 🔐 Admin Features

- Secure admin login
- JWT-based authentication
- Create events
- Edit events
- Delete events
- View event registrations
- View participant details
- View team name and number of members
- Admin logout

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)

### Email Service

- Nodemailer
- Gmail SMTP

### Deployment

- Render
- GitHub

---

## 📁 Project Structure

```text
CodeAlpha_Event-Registration/
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Event.js
│   └── Registration.js
│
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── registrationRoutes.js
│
├── services/
│   └── emailService.js
│
├── public/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── admin-login.html
│   ├── admin-login.js
│   ├── admin.html
│   └── admin.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
