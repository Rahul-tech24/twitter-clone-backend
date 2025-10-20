import jwt from "jsonwebtoken";
          
const generateTokenAndSetCookie = (userId, res) => {
                const token = jwt.sign({userId }, process.env.JWT_SECRET, {
                    expiresIn: "15d",
                });
    
                // Check if in production - Render sets NODE_ENV or we can check for production domain
                const isProduction = process.env.NODE_ENV === "production" || 
                                   process.env.RENDER === "true" ||
                                   process.env.NODE_ENV !== "development";
                
                res.cookie("jwt", token, {
                    httpOnly: true,
                    secure: true, // Always true in production for sameSite: "none" to work
                    sameSite: isProduction ? "none" : "lax", // "lax" is more compatible than "strict"
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    path: "/", // Ensure cookie is available for all paths
                });
                
                // Debug log (remove after testing)
                console.log('Cookie settings:', { isProduction, secure: true, sameSite: isProduction ? "none" : "lax" });
             }

        

export default generateTokenAndSetCookie; 
