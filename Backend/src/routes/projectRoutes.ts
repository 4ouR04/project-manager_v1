import { Router } from "express";
import {
  deleteProject,
  getProject,
  getProjects,
  insertProject,
  signinUser,
  signupUser,
  updateProject,
} from "../controllers/projectController";

const router = Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/projects", getProjects);
router.get("/projects/:id", getProject);
router.post("/projects", insertProject);
router.put("/projects/update/:id", updateProject);
router.delete("/projects/:id", deleteProject);

export default router;
