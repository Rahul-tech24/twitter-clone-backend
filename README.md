# Twitter Clone - Backend API 🚀

A full-featured Twitter clone backend API built with Node.js, Express, MongoDB, and Cloudinary.

## 🌟 Features

- **Authentication & Authorization**
  - JWT-based authentication with httpOnly cookies
  - Secure password hashing with bcrypt
  - Protected routes middleware

- **User Management**
  - User profiles with customizable bio, links, and images
  - Follow/Unfollow functionality
  - Followers and Following lists
  - Suggested users algorithm

- **Posts & Interactions**
  - Create posts with text and images
  - Like/Unlike posts
  - Comment on posts
  - Delete own posts
  - View user feeds (all, following, user-specific)

- **Notifications**
  - Real-time notifications for follows, likes, and comments
  - Mark notifications as read
  - Delete notifications

- **Media Management**
  - Image upload via Cloudinary
  - Profile and cover image support
  - Post images with optimization

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT & bcrypt
- **File Upload:** Cloudinary
- **Security:** CORS, cookie-parser

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account for image uploads

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/twitter-clone-backend.git
cd twitter-clone-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/twitter-clone?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CLIENT_URL=http://localhost:3000
```

**Important:** Never commit the `.env` file to version control!

### 4. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
Development: http://localhost:8000
Production: https://your-backend-url.com
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new account | No |
| POST | `/api/auth/login` | Login to account | No |
| POST | `/api/auth/logout` | Logout from account | No |
| GET | `/api/auth/user` | Get current user | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile/:username` | Get user profile | Yes |
| GET | `/api/users/suggested` | Get suggested users | Yes |
| GET | `/api/users/followers/:username` | Get user followers | Yes |
| GET | `/api/users/following/:username` | Get user following | Yes |
| POST | `/api/users/follow/:id` | Follow/Unfollow user | Yes |
| POST | `/api/users/update` | Update own profile | Yes |

### Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts/all` | Get all posts | Yes |
| GET | `/api/posts/post/:id` | Get single post | Yes |
| GET | `/api/posts/following` | Get following posts | Yes |
| GET | `/api/posts/user/:username` | Get user posts | Yes |
| GET | `/api/posts/likes/:id` | Get liked posts | Yes |
| POST | `/api/posts/create` | Create new post | Yes |
| POST | `/api/posts/like/:id` | Like/Unlike post | Yes |
| POST | `/api/posts/comment/:id` | Comment on post | Yes |
| DELETE | `/api/posts/delete/:id` | Delete own post | Yes |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get all notifications | Yes |
| DELETE | `/api/notifications` | Delete all notifications | Yes |
| DELETE | `/api/notifications/:id` | Delete one notification | Yes |

## 🔒 Security Features

- ✅ JWT authentication with httpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation
- ✅ Protected routes
- ✅ Ownership verification for delete/update operations
- ✅ Rate limiting ready (implement in production)

## 📁 Project Structure

```
backend/
├── controllers/        # Request handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── post.controller.js
│   └── notification.controller.js
├── db/                # Database connection
│   └── db.js
├── middleware/        # Custom middleware
│   └── protectRoute.js
├── models/            # Mongoose schemas
│   ├── user.model.js
│   ├── post.model.js
│   └── notification.model.js
├── routes/            # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── post.routes.js
│   └── notification.routes.js
├── .env              # Environment variables (not in git)
├── .env.example      # Example environment variables
├── .gitignore        # Git ignore rules
├── package.json      # Dependencies
└── server.js         # Application entry point
```

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Use these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables from `.env.example`
5. Deploy!

### Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku:
```bash
heroku login
```
3. Create a new app:
```bash
heroku create your-app-name
```
4. Set environment variables:
```bash
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... set all other variables
```
5. Deploy:
```bash
git push heroku main
```

## 🔧 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `8000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `min_32_characters_long` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_secret` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🧪 Testing

Test the API health:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-20T12:00:00.000Z",
  "uptime": 123.456
}
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Rahul**
- GitHub: [@Rahul-tech24](https://github.com/Rahul-tech24)

## 🙏 Acknowledgments

- Express.js community
- MongoDB team
- Cloudinary
- All open-source contributors

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by Rahul
