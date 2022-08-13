import { Router } from "express";
import { verify } from "jsonwebtoken";
import {
  deleteProject,
  getProject,
  getCompletedProjects,
  getProjects,
  insertProject,
  updateProject,
  checkUser,
} from "../controllers/controller";
import { VerifyToken } from "../middleware/verifyToken";

const router = Router();



router.get("/check", checkUser);

router.get("/", getProjects);
router.get("/completed", getCompletedProjects);
router.get("/:id", VerifyToken, getProject);
router.post("/", VerifyToken, insertProject);
router.put("/:id", VerifyToken, updateProject);
router.delete("/:id", VerifyToken, deleteProject);

export default router;
