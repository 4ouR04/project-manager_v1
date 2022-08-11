"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema2 = exports.UserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UserSchema = joi_1.default.object({
    Email: joi_1.default.string().required().email(),
    Password: joi_1.default.string().required().min(8),
    Name: joi_1.default.string().required(),
});
exports.UserSchema2 = joi_1.default.object({
    Email: joi_1.default.string().required().email(),
    Password: joi_1.default.string().required().min(8),
});
