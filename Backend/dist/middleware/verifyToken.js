"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const VerifyToken = (req, res, next) => {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.json({ message: "You are Not allowed to access this Route" });
        }
        const data = jsonwebtoken_1.default.verify(token, process.env.KEY);
        req.info = data;
    }
    catch (Error) {
        return res.json({ Error });
    }
    next();
};
exports.VerifyToken = VerifyToken;
