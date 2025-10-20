import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
         if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("protectRoute error:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
};

export default protectRoute;