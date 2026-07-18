# 🚀 SkillMatch AI

> An AI-powered recruitment platform that analyzes GitHub profiles and ranks candidates against job requirements.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

# 📖 Overview

SkillMatch AI helps recruiters and hiring managers evaluate software engineering candidates by analyzing their GitHub profiles, projects, skills, and repositories.

The system automatically:

* Collects GitHub profile information
* Matches candidate skills against job requirements
* Generates AI-powered candidate analysis
* Ranks candidates based on compatibility scores
* Provides dashboards and recruitment analytics

---

# ✨ Features

## 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

## 📊 Dashboard

* Total Projects
* Total Candidates
* Total Analyses
* Average Candidate Score
* Top Candidate Score
* Strong Matches
* Weak Matches
* Recent Activity

## 📁 Project Management

* Create Projects
* View Projects
* Update Projects
* Delete Projects
* Search Projects

## 👥 Candidate Management

* Add Candidate
* Update Candidate
* Delete Candidate
* View Candidate Details

## 🐙 GitHub Analysis

* GitHub Profile Preview
* GitHub Profile Overview
* Repository Analysis
* Technology Detection
* AI-Powered Candidate Ranking

## 🤖 AI Analysis

* Candidate Scoring
* Strength Analysis
* Gap Analysis
* Candidate Summary
* Ranking System

---

# 🛠 Technologies Used

## Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React Icons

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* GitHub API

## Tools

* Git
* GitHub
* Postman
* VS Code

---

# 🏗 System Architecture

```text
Frontend (React)
        ↓
REST API (Express)
        ↓
MongoDB Database
        ↓
GitHub API
        ↓
AI Analysis Engine
```


## Frontend Folder Structure

```bash
FRONTEND/
├── .vscode/
├── node_modules/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── GitHubVisualizer.jsx
│   │   ├── Login.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── Projects.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.css
│   └── App.jsx
│
└── README.md
```

## Backend Folder Structure

```bash
BACKEND/
├── config/
│   └── db.js
│
├── controllers/
│   ├── analysisController.js
│   ├── authController.js
│   ├── candidateController.js
│   ├── dashboardController.js
│   ├── githubController.js
│   └── projectController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Project.js
│   └── User.js
│
├── node_modules/
│
├── routes/
│   ├── authRoutes.js
│   ├── candidateRoutes.js
│   ├── dashboardRoutes.js
│   ├── githubRoutes.js
│   └── projectRoutes.js
│
├── services/
│   ├── githubService.js
│   ├── groqService.js
│   └── rankingService.js
│
├── .env
├── .gitignore
└── app.js
```





















# 🔗 API Endpoints

## Authentication

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register user    |
| POST   | /api/auth/login    | Login user       |
| GET    | /api/auth/me       | Get current user |

---

## Dashboard

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | /api/dashboard | Dashboard analytics |

---

## Projects

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/projects     |
| GET    | /api/projects/:id |
| POST   | /api/projects     |
| PUT    | /api/projects/:id |
| DELETE | /api/projects/:id |

---

## Candidates

| Method | Endpoint                                        |
| ------ | ----------------------------------------------- |
| GET    | /api/projects/:projectId/candidate              |
| POST   | /api/projects/:projectId/candidate              |
| PUT    | /api/projects/:projectId/candidate/:candidateId |
| DELETE | /api/projects/:projectId/candidate/:candidateId |

---

## GitHub

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /api/github/preview  |
| POST   | /api/github/analyze  |

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/SkillMatch_AI.git
cd SkillMatch_AI
```

---

## Backend Setup

```bash
cd Backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
GITHUB_TOKEN=
```

## Frontend

```env
VITE_API_URL=
```


# 🚀 Future Improvements

* Resume Parsing
* PDF Report Generation
* Email Notifications
* Interview Scheduling
* Team Collaboration
* AI Resume Screening
* Export Candidate Reports
* Advanced Analytics

---

# 👨‍💻 Author

Mesandu Gunawardhana

---


