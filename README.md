Instagram Mini Clone 📸
Project Overview

This is a full-stack, single-page application (SPA) built to replicate the core functionalities of Instagram, focusing on user authentication, post interactions (likes/comments), and a personalized feed based on user following.

The project demonstrates proficiency in API design, database modeling, and front-end state management in a secure and scalable manner.

Task: Instagram Mini Clone

✨ Features Implemented
Category	Feature
User Authentication	Secure signup, login, password hashing, and JWT token authentication for all protected routes
Social Graph	Users can follow and unfollow other users
Post Creation	Authenticated users can create posts with an image URL and a caption
Post Interactions	Users can like/unlike posts and comment on posts
Feed Generation	Home Feed displays posts created by users whom the logged-in user follows
🛠️ Tech Stack

Backend

Runtime: Node.js

Framework: Express

Database: MongoDB (via Mongoose ODM)

Authentication: JWT (JSON Web Tokens), bcrypt.js (Password Hashing)

File Uploads: Multer (for handling image files)

Frontend

Framework: React

Tooling: Vite

Routing: React Router DOM

API Calls: Axios

⚙️ Prerequisites

Before running the project, ensure you have the following installed:

Node.js (v18+)

MongoDB (running locally or via MongoDB Atlas)

Git

🚀 Project Setup and Installation
1. Clone the Repository
git clone <YOUR_REPOSITORY_URL>
cd instagram-mini-clone

2. Backend Setup (/backend)

Navigate to the backend folder and install dependencies:

cd backend
npm install

A. Configuration (Database & Secrets)

Create a .env file in /backend and add your MongoDB connection string and JWT secret:

MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
JWT_SECRET="your_strong_secret_key"
BASE_URL="http://localhost:5000"

B. Database Setup

The app uses MongoDB and automatically creates collections (users, posts, etc.) upon first request.
Make sure your MongoDB instance is running and MONGO_URI points to a valid database.

C. Create Necessary Folders

Create folders for file persistence:

mkdir uploads
mkdir assets


Place the default profile picture (default-user.png) inside /backend/assets/.

D. Start Backend Server
npm start
# or
npm run dev


The backend server will run at http://localhost:5000
.

3. Frontend Setup (/frontend)

Navigate to the frontend folder and install dependencies:

cd ../frontend
npm install

A. Start Frontend Server
npm run dev


The frontend will launch in your browser, usually at http://localhost:5173
.

💻 Running the Application

Open the frontend in your browser: http://localhost:5173

Sign Up: Create a new account on the /signup page

Login: Log in with your credentials; you will be redirected to the Home Feed

Create Content: Upload an image and add a caption using the Create Post form

Test Interaction: Like and comment on posts to see dynamic UI updates