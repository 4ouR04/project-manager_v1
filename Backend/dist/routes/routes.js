"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controllers/controller");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
router.post("/login", controller_1.signin);
router.post("/signup", controller_1.signup);
router.get("/check", verifyToken_1.VerifyToken, controller_1.checkUser);
router.get("/", controller_1.getProjects);
router.get("/completed", controller_1.getCompletedProjects);
// router.get("/:id", VerifyToken, getProject);
router.put("/complete/:id", controller_1.completeProject);
router.post("/", controller_1.insertProject);
router.put("/:id", controller_1.updateProject);
router.delete("/:id", controller_1.deleteProject);
exports.default = router;
