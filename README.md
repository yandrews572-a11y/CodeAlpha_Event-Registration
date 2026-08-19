# 🎟️ CodeAlpha Event Registration System

A full-stack event registration platform that allows users to discover upcoming events, explore event details, and register individually or as a team. Administrators can securely manage events and view registered participants.

## 🚀 Live Demo

https://codealpha-event-registration-oq5z.onrender.com

## ✨ Features

### 👤 User Features

- View upcoming events
- Explore detailed event information
- Register for events
- Team Name — Optional
- Number of Members — Optional
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

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)

### Email
- Nodemailer
- Gmail App Password

### Deployment
- Render
- GitHub

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
└── server.js
