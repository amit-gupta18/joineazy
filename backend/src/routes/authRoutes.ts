import express from "express"
const authRouter = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

import { registerUser , onboardingUser, login } from "../controllers/user.controller.js";

authRouter.post("/register", registerUser);
authRouter.post("/onboard" , authMiddleware , onboardingUser );
authRouter.post("/login" , login);

export default authRouter;
