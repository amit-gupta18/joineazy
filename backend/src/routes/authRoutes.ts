import express from "express"
const authRouter = express.Router();
// import { authMiddleware } from "../middlewares/authMiddleware";

import { registerUser , loginUser } from "../controllers/user.controller.js";
console.log("control reached in authrouter")
authRouter.post("/register", registerUser);
authRouter.post("/login" , loginUser);
// authRouter.post("/onboard" , authMiddleware , onboardingUser );

export default authRouter;
