"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signuploginController_1 = require("../controllers/signuploginController");
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
projectRoutes_1.default.get("/signup", signuploginController_1.signupUser);
projectRoutes_1.default.post("/signin", signuploginController_1.signinUser);
