import express from "express";
const router = express.Router();

import { createPost,deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts,getFollowingPosts,getUserPosts, getPostById } from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";



router.get("/all", protectRoute, getAllPosts);
router.get("/post/:id", protectRoute, getPostById);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);

 router.post("/like/:id", protectRoute, likeUnlikePost);
 router.post("/comment/:id", protectRoute, commentOnPost);

 router.delete("/delete/:id", protectRoute, deletePost);

export default router;
