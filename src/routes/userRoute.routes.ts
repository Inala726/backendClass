import express from "express";
import { UserController } from "../controllers/userController.control";
import { authenticateUser } from "../middleware/auth.middleware";
import { uploadToCloudinaryProfileImage } from "../config/cloudinary.config";
const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", authenticateUser, userController.getAllUsers);
userRouter.get("/:id", authenticateUser, userController.getUserById);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", authenticateUser, userController.deleteUser);
userRouter.get("/profile", authenticateUser, userController.profile);
userRouter.patch(
  "/profile-pic",
  authenticateUser,
  uploadToCloudinaryProfileImage,
  userController.updateProfilePic
);
export default userRouter;
