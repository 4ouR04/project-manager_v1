"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = exports.UserSchema1 = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    Name: joi_1.default.string().required(),
    Email: joi_1.default.string().required().email(),
    Password: joi_1.default.string().required().min(8),
    Role: joi_1.default.string(),
    isAssigned: joi_1.default.boolean(),
});
exports.UserSchema1 = joi_1.default.object({
    Email: joi_1.default.string().required().email(),
    Password: joi_1.default.string().required().min(8),
});
exports.projectSchema = joi_1.default.object({
    ProjectName: joi_1.default.string().required(),
    Description: joi_1.default.string().required(),
    Due_date: joi_1.default.date(),
    Status: joi_1.default.string(),
    User: joi_1.default.string()
});
