import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";



const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let img = req.body.img || null;
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!text && !img) {
            return res.status(400).json({ message: "Post cannot be empty" });
        }

        if (img) {
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img, {
                    resource_type: "image",
                    folder: "posts",
                });
                img = uploadedResponse.secure_url;
            } catch (e) {
                console.error("Cloudinary upload failed:", e?.message || e);
                return res.status(400).json({ message: "Image upload failed", error: e?.message || "Cloudinary error" });
            }
        }
        const newPost = new Post({
            user: req.user._id,
            text: text,
            img,
        }); 
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id.toString();

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }
        if (post.img) {
            try {
                await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0], { resource_type: "image", folder: "posts" });
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }

        await Post.findByIdAndDelete(postId);
        
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const commentOnPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id.toString();
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = {
            user: userId,
            text,
            createdAt: new Date(),
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        console.error("Error commenting on post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id.toString();     

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            const updatedLikes = post.likes.filter(id => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $addToSet: { likedPosts: postId } });
            await post.save();
            const notification = new Notification({
                from: userId,
                to: post.user,
                post: postId,
                type: "like"
            });
            await notification.save();
            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ message: "Internal server error" });
    }

};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            });

            if (posts.length === 0) {
                return res.status(200).json({ message: "No posts available", posts: [] });
            }
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            });
        if (likedPosts.length === 0) {
            return res.status(200).json({ message: "No liked posts available", likedPosts: [] });
        }

        res.status(200).json(likedPosts);
    } catch (error) {
        console.error("Error fetching user likes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followingPosts = await Post.find({ user: { $in: user.following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            });
        if (followingPosts.length === 0) {
            return res.status(200).json({ message: "No following posts available", followingPosts: [] });
        }

        res.status(200).json(followingPosts);
    } catch (error) {
        console.error("Error fetching following posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userPosts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            }).populate({
                path: "comments.user",
                select: "-password"
            });
        if (userPosts.length === 0) {
            return res.status(200).json({ message: "No posts available for this user", userPosts: [] });
        }

        res.status(200).json(userPosts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const post = await Post.findById(postId)
            .populate({
                path: "user",
                select: "-password -email"
            })
            .populate({
                path: "comments.user",
                select: "-password -email"
            });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts, getPostById };
