import { Router } from "express";
import { verify } from "jsonwebtoken";
import {
  deleteProject,
  getProject,
  getCompletedProjects,
  getProjects,
  insertProject,
  updateProject,
  signin,
  signup,
  checkUser,
  completeProject
} from "../controllers/controller";
import { VerifyToken } from "../middleware/verifyToken";

const router = Router();


router.post("/login", signin);
router.post("/signup", signup);
router.get("/check",VerifyToken,checkUser);

router.get("/", getProjects);
router.get("/completed", getCompletedProjects);
router.get("/:id", getProject);
router.put("/complete/:id",completeProject)
router.post("/", insertProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
