import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.routes.js"; 
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import dotenv from "dotenv";
import connectDB from "./db/db.js";

import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



const app = express();

// Configure CORS to allow multiple origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://twitter-clone-frontend-navy.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean); // Remove undefined/null values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Twitter Clone API is running! 🚀");
})

app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
