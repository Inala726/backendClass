import { AuthController } from "../controllers/auth.controller";
import express from "express";

const authController = new AuthController();
const authRouter = express.Router();

authRouter.post("/", authController.login);

authRouter.post("/", authController.login);

authRouter.post("/sign-up", authController.createUser);

authRouter.post("/verify-email", authController.verifyEmail);
export default authRouter;
