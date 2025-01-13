import express from "express"
import { UserController } from "../controllers/userController.control";
import { AuthController } from "../controllers/auth.controller";
const userController = new UserController();
const authController = new AuthController()
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/", authController.login)
userRouter.put("/:id", userController.updateUser)
userRouter.delete("/:id", userController.deleteUser)

export default userRouter;