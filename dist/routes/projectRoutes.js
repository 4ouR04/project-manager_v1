import { Router } from "express";
import { deleteProject, getProject, getProjects, insertProject, updateProject, } from "../controllers/projectController";
const router = Router();
router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", insertProject);
router.put("/update/:id", updateProject);
router.delete("/:id", deleteProject);
export default router;
