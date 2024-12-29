import express from "express";
import { CourseController } from "../controllers/courseController.controllers";
const courseController = new CourseController();
const courseRouter = express.Router();

courseRouter.post("/", courseController.createCourse);
courseRouter.get("/", courseController.getAllCourses);
courseRouter.get("/:id", courseController.getCourseById);

courseRouter.put("/:id", courseController.updateCourse);
courseRouter.delete("/:id", courseController.deleteCourse);

export default courseRouter;
