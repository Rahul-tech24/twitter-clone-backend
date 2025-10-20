import express from "express";
import protectRoute from "../middleware/protectRoute.js";

import { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser, getFollowers, getFollowing } from "../controllers/user.controller.js";


const router = express.Router();


router.get("/profile/:username", protectRoute, getUserProfile); 
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/followers/:username", protectRoute, getFollowers);
router.get("/following/:username", protectRoute, getFollowing);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);


export default router;

 
