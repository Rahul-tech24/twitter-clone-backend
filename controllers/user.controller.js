import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Get actual post count for this user
        const postCount = await Post.countDocuments({ user: user._id });
        
        // Add post count to user object
        const userWithPostCount = {
            ...user.toObject(),
            postCount
        };
        
        res.status(200).json(userWithPostCount);
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        if(!userToModify || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing) {
           await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed successfully" });
        }    
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}


const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                },
            },
            { $sample: { size: 5 } },
        ])
        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id)); 
        const suggestedUsers = filteredUsers.map(user => ({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profileImg: user.profileImg
            
        }))
        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

const getFollowers = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).populate({
            path: "followers",
            select: "-password -email -bio -link -coverImg -likedPosts -createdAt -updatedAt"
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user.followers);
    } catch (error) {
        console.error("Error in getFollowers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getFollowing = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).populate({
            path: "following",
            select: "-password -email -bio -link -coverImg -likedPosts -createdAt -updatedAt"
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user.following);
    } catch (error) {
        console.error("Error in getFollowing:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateUser = async (req, res) => {
        const { username, fullName, email, currentPassword, newPassword, bio, link } = req.body;
        let { profileImg, coverImg } = req.body;
       try { 
           const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
           }
           
           // Check if username is being changed and if it's already taken
           if (username && username !== user.username) {
               const existingUser = await User.findOne({ username });
               if (existingUser) {
                   return res.status(400).json({ message: "Username is already taken" });
               }
           }
           
           // Check if email is being changed and if it's already taken
           if (email && email !== user.email) {
               const existingEmail = await User.findOne({ email });
               if (existingEmail) {
                   return res.status(400).json({ message: "Email is already taken" });
               }
           }
           
           // Password update validation
           if (newPassword && currentPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "New password must be at least 6 characters" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
           } else if (newPassword || currentPassword) {
            return res.status(400).json({ message: "Both current password and new password are required" });
           }

           if (profileImg) {
               if (user.profileImg) {
                   await cloudinary.uploader.destroy(user.profileImg .split("/").pop().split(".")[0]);
               }

               const uploadedResponse = await cloudinary.uploader.upload(profileImg)
               profileImg = uploadedResponse.secure_url;

           }
           if (coverImg) {
               if (user.coverImg) {
                   await cloudinary.uploader.destroy(user.coverImg .split("/").pop().split(".")[0]);
               }
               const uploadedResponse = await cloudinary.uploader.upload(coverImg)
               coverImg = uploadedResponse.secure_url;
            
           }

           user.username = username || user.username;
           user.fullName = fullName || user.fullName;
           user.email = email || user.email;
           user.bio = bio !== undefined ? bio : user.bio;
           user.link = link !== undefined ? link : user.link;
           user.profileImg = profileImg || user.profileImg;
           user.coverImg = coverImg || user.coverImg;
           
           await user.save();
           user.password = null;
           return res.status(200).json(user);
         
         } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser, getFollowers, getFollowing }; 
