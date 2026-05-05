🚀 Project Manager (MERN Stack)

A full-stack Project & Task Management Web App built using the MERN stack (MongoDB, Express, React, Node.js).
This app allows users to manage projects, assign tasks, track progress, and collaborate efficiently.

---

🌐 Live Demo

Frontend: https://your-frontend-url.vercel.app
Backend API: https://your-backend-url.up.railway.app

---

✨ Features

🔐 Authentication

* User Signup & Login (JWT-based)
* Role-based access (Admin / Member)

📁 Project Management

* Create and manage projects
* View all projects in sidebar
* Assign users to projects

✅ Task Management

* Create tasks with:

  * Title
  * Assigned user
  * Project
  * Due date
* Update task status:

  * Todo
  * In Progress
  * Done
* Edit & delete tasks

📊 Dashboard

* Kanban-style board (Trello-like)
* Tasks grouped by status
* Overdue task highlighting
* Search & filter tasks

🎨 UI/UX

* Modern Glassmorphism design
* Responsive layout
* Smooth animations
* Toast notifications

---

🛠 Tech Stack

Frontend

* React.js
* Axios
* React Router
* React Hot Toast

Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

Deployment

* Frontend: Vercel
* Backend: Railway
* Database: MongoDB Atlas

---

📂 Project Structure

project-manager/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
│
└── README.md

---

⚙️ Installation & Setup

1️⃣ Clone Repository

git clone https://github.com/your-username/project-manager.git
cd project-manager

---

2️⃣ Backend Setup

cd backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
ADMIN_SECRET=your_admin_secret

Run backend:

npm start

---

3️⃣ Frontend Setup

cd frontend
npm install

Create .env:

REACT_APP_API_URL=https://your-backend-url/api

Run frontend:

npm start

---

🚀 Deployment

Backend (Railway)

* Connect GitHub repo
* Add environment variables
* Deploy
* Generate public domain

Frontend (Vercel)

* Import GitHub repo
* Set root directory = frontend
* Add environment variable:
  REACT_APP_API_URL
* Deploy

---

🧪 API Endpoints

Auth

* POST /api/auth/signup
* POST /api/auth/login

Users

* GET /api/users

Projects

* GET /api/projects
* POST /api/projects

Tasks

* GET /api/tasks
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

---

🔐 Security

* JWT-based authentication
* Protected routes
* Environment variables for secrets
* Password hashing using bcrypt

---

📸 Screenshots

* Login Page
* Dashboard
* Kanban Board
* Task Cards

---

🤝 Contribution

Contributions are welcome!

Fork → Create Branch → Commit → Push → Pull Request

---

🧑‍💻 Author

Rohan Choudhary

---

📄 License

This project is licensed under the MIT License.

---

⭐ Acknowledgements

* MongoDB Atlas
* Railway
* Vercel
* React Community

---

🚀 Future Improvements

* Drag & Drop tasks
* Notifications system
* Dark/Light theme toggle
* Real-time updates (Socket.io)
* File attachments

---
