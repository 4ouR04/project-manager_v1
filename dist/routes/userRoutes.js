import { Router } from "express";
import { deleteUser, getUser, getUsers, insertUser, updateUser, } from "../controllers/userController";
const router = Router();
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", insertUser);
router.put("/update/:id", updateUser);
router.delete("/:id", deleteUser);
export default router;
