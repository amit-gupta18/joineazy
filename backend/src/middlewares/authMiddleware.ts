import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req: any, res: any, next: any) => { 
    console.log("in the auth middleware "); 
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token is : " , token);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    if(!process.env.JWT_SECRET_KEY) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err: any, decoded: any) => {
        console.log("decoded is : " , decoded)
        console.log("decoded id is : " , decoded.id);
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }
        // console.log("decoded is : " , decoded)
        // console.log("decoded id is : " , decoded.id);
        req.userId = decoded.id;
        next();
    });
}