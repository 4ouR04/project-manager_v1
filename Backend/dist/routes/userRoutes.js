"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes"));
const controller_1 = require("../controllers/controller");
routes_1.default.post("/signup", controller_1.signupUser);
routes_1.default.post("/signin", controller_1.signinUser);
routes_1.default.get("/check", controller_1.checkUser);
