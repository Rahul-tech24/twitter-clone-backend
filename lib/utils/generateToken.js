import jwt from "jsonwebtoken";
          
const generateTokenAndSetCookie = (userId, res) => {
                const token = jwt.sign({userId }, process.env.JWT_SECRET, {
                    expiresIn: "15d",
                });
    
                // In production (cross-domain), sameSite: "none" requires secure: true
                const isProduction = process.env.NODE_ENV !== "development";
                
                res.cookie("jwt", token, {
                    httpOnly: true,
                    secure: isProduction, // Must be true for sameSite: "none"
                    sameSite: isProduction ? "none" : "strict",
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    path: "/", // Ensure cookie is available for all paths
                });
             }

        

export default generateTokenAndSetCookie; 
