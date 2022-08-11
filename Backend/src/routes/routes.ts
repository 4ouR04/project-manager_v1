import { Router } from "express";
import { verify } from "jsonwebtoken";
import {
  deleteProject,
  getProject,
  getProjects,
  insertProject,
  signinUser,
  signupUser,
  updateProject,
  checkUser,
} from "../controllers/controller";
import { VerifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/check", checkUser);
router.get("/projects", VerifyToken, getProjects);
router.get("/projects/:id", VerifyToken, getProject);
router.post("/projects", VerifyToken, insertProject);
router.put("/projects/update/:id", VerifyToken, updateProject);
router.delete("/projects/:id", VerifyToken, deleteProject);

export default router;
