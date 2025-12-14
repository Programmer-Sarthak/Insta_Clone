# Database & API Design

## 1. Database Schema (MongoDB)

### Users Collection
- **_id**: ObjectId (Auto-generated)
- **username**: String (Unique)
- **email**: String (Unique)
- **password**: String (Hashed)
- **followers**: Array of User ObjectIds
- **following**: Array of User ObjectIds

### Posts Collection
- **_id**: ObjectId (Auto-generated)
- **user**: ObjectId (Ref: User)
- **image**: String (URL)
- **caption**: String
- **likes**: Array of User ObjectIds
- **comments**: Array of Objects
  - **user**: ObjectId (Ref: User)
  - **text**: String
  - **createdAt**: Date
- **createdAt**: Date

---

## 2. API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Posts
- `POST /api/posts` - Create a new post (Auth required)
- `GET /api/posts/feed` - Get posts from followed users (Auth required)
- `GET /api/posts/user/:id` - Get all posts by specific user
- `GET /api/posts/:id` - Get single post details
- `PUT /api/posts/like/:id` - Like/Unlike a post
- `POST /api/posts/comment/:id` - Add a comment

### Users
- `GET /api/users/:id` - Get user profile details
- `PUT /api/users/follow/:id` - Follow a user
- `PUT /api/users/unfollow/:id` - Unfollow a user