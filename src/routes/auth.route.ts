import { AuthController } from "../controllers/auth.controller";
import express from "express";
import passport from "passport";

const authController = new AuthController();
const authRouter = express.Router();

authRouter.post("/", authController.login);

export default authRouter;
