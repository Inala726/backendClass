import { AuthController } from "../controllers/auth.controller";
import express from "express";
import passport from "passport";

const authController = new AuthController();
const authRouter = express.Router();

// Local login route
authRouter.post("/", authController.login);

// Google OAuth route
authRouter.get("/google", authController.googleLogin);

// Google OAuth callback route
authRouter.get(
  "/google/callback",
  (req, res, next) => authController.googleCallback(req, res, next)
);

export default authRouter;
