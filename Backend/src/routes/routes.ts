import { Router } from "express";
import { verify } from "jsonwebtoken";
import {
//   deleteProject,
//   getProject,
//   getCompletedProjects,
  getProjects,
  insertProject,
//   updateProject,
  signin,
  signup,
  checkUser,
} from "../controllers/controller";
import { VerifyToken } from "../middleware/verifyToken";

const router = Router();


router.post("/login", signin);
router.post("/signup", signup);
router.get("/check",VerifyToken,checkUser);

router.get("/", getProjects);
// router.get("/completed", getCompletedProjects);
// router.get("/:id", VerifyToken, getProject);
router.post("/", insertProject);
// router.put("/:id", VerifyToken, updateProject);
// router.delete("/:id", VerifyToken, deleteProject);

export default router;
