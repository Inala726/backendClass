import express from "express"
import { UserController } from "../controllers/userController.control";
import { authenticateUser } from "../middleware/auth.middleware";
const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", authenticateUser, userController.getAllUsers);
userRouter.get("/:id", authenticateUser, userController.getUserById);
userRouter.put("/:id", userController.updateUser)
userRouter.delete("/:id", authenticateUser, userController.deleteUser)
userRouter.get("/profile", authenticateUser, userController.profile)

export default userRouter;