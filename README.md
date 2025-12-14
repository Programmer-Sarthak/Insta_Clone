# Instagram Mini Clone 📸

![React](https://img.shields.io/badge/React-17-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

A full-stack, single-page application (SPA) replicating Instagram's core functionalities: user authentication, post interactions, social graph, and personalized feed. Built to demonstrate API design, database modeling, and front-end state management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Backend Setup](#backend-setup-backend)
- [Frontend Setup](#frontend-setup-frontend)
- [Security and Access Control](#security-and-access-control)
- [Running the Application](#running-the-application)

---

## Features

- **User Authentication:** Secure signup, login, and JWT token authentication for all protected routes.  
- **Post Interactions:** Users can create posts with images and captions, like/unlike posts, and comment.  
- **Social Graph:** Follow/unfollow system implemented.  
- **Feed Generation:** Home Feed displays posts only from users the logged-in user follows.  
- **UI/UX:** Dynamic data rendering and UI updates without page refresh.

---

## Tech Stack

**Backend**  
- Node.js, Express  
- MongoDB (via Mongoose)  
- JWT Authentication & bcrypt.js for password hashing  
- Multer for image uploads  

**Frontend**  
- React with Vite  
- React Router DOM (Protected & Guest routes)  
- Axios for API requests  

---

## Prerequisites

- Node.js v18+  
- MongoDB (local or Atlas)  
- Git  

---

## Project Setup

Clone the repository:

bash
git clone <YOUR_REPOSITORY_URL>
cd instagram-mini-clone
Backend Setup (/backend)
bash
Copy code
cd backend
npm install
Create a .env file in /backend with your MongoDB URI and JWT secret:

env
Copy code
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
JWT_SECRET="your_strong_secret_key"
BASE_URL="http://localhost:5000"
Create required folders for uploads and assets:

bash
Copy code
mkdir uploads
mkdir assets
Place default-user.png in /backend/assets/.

Start the backend server:



bash
Copy code
npm start
# or
npm run dev
The server runs at http://localhost:5000

Frontend Setup (/frontend)
bash
Copy code
cd ../frontend
npm install
npm run dev
The app launches at http://localhost:5173

Security and Access Control
Protected Routes: Home, Profile, Post Detail, and Create Post pages require authentication.

Unauthorized Access: Users without a token are redirected to /login.

Login & Signup: Secure token storage with automatic redirect on success.

Running the Application
Visit http://localhost:5173

Sign up a new user

Log in with credentials

Create posts using the Create Post form

Like, comment, and interact with posts to see dynamic UI updates