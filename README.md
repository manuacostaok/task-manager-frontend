# 🚀 Task Manager App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 📌 Overview

Fullstack Task Manager App con autenticación JWT, CRUD de tareas y UI moderna tipo SaaS.

Proyecto diseñado para **portfolio profesional (Junior / Trainee Fullstack)**.

---

## ✨ Features

- 🔐 Registro y login de usuarios
- 🛡️ Autenticación con JWT
- 📋 CRUD completo de tareas
- 👤 Tareas por usuario
- 🌙 Dark / Light mode
- 📱 Responsive design
- ⚡ UI moderna tipo SaaS
- 💾 Persistencia con localStorage
- 🎨 Glassmorphism + animaciones suaves

---

## 🧰 Tech Stack

### Frontend
- React
- Vite
- CSS moderno
- Fetch API

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcrypt

---

## 📁 Project Structure

Frontend:

task-manager-frontend/
src/
App.jsx
Login.jsx
Tasks.jsx
styles.css
main.jsx

Backend:

task-manager-api/
src/
routes/
controllers/
models/
middleware/
config/

---

## 🚀 Installation

### 1. Clone repository

git clone https://github.com/tu-usuario/task-manager-frontend.git

### 2. Install dependencies

npm install

### 3. Run project

npm run dev

---

## 🌐 API Base URL

http://localhost:3000/api

---

## 🔐 Authentication Flow

Token stored in:

localStorage.getItem("token")

Sent in requests as:

Authorization: Bearer <token>

---

## 📡 API Endpoints

### Auth

POST /api/auth/register → Register user  
POST /api/auth/login → Login user  

### Tasks

GET /api/tasks → Get user tasks  
POST /api/tasks → Create task  
PUT /api/tasks/:id → Update task  
DELETE /api/tasks/:id → Delete task  

---

## 🎨 UI / UX Highlights

- Smooth dark/light mode toggle
- Glassmorphism cards
- Animated background glow
- Responsive layout
- Clean SaaS-style interface

---

## 📸 Preview

### 🌞 Light Mode
Minimal, clean dashboard style

### 🌙 Dark Mode
Modern SaaS aesthetic (Notion/Linear inspired)

---

## 🌍 Live Demo

👉 Frontend: https://your-vercel-link.vercel.app  
👉 Backend: https://your-render-link.onrender.com  

---

## 💼 Author

Made with 💻 by **Manu Acosta**

Fullstack Developer in progress 🚀

---

## 📊 Status

🟢 Functional  
🟢 Responsive  
🟢 Auth system implemented  
🟢 Ready for portfolio  
🟢 Production-style UI  

---

## 🔥 Bonus

This project simulates a real SaaS application:

- real authentication
- multi-user system
- full CRUD
- modern UI/UX
- scalable backend architecture

Ideal for **junior fullstack job applications**.

---

## 🚀 Next Improvements

- refresh tokens
- task categories
- drag & drop tasks
- advanced dashboard
- notifications system