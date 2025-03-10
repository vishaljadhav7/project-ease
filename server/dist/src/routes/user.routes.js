"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const userRouter = (0, express_1.Router)();
userRouter.get("/users", user_controller_1.fetchAllUsers);
userRouter.get("/user/:userId", [
    (0, express_validator_1.param)('userId').isUUID().withMessage("userId required")
], verifyUser_1.default, user_controller_1.fetchUser);
userRouter.post("/signup", [
    (0, express_validator_1.body)('userName').isString().isLength({ min: 3 }).withMessage("username is required"),
    (0, express_validator_1.body)('emailId').isEmail().withMessage('email is required'),
    (0, express_validator_1.body)('password').isStrongPassword().withMessage('strong password is required'),
    (0, express_validator_1.body)('profileAvatarUrl').isURL().withMessage('profile avatar url is required').optional(),
    (0, express_validator_1.body)('teamId').isUUID().withMessage("team id is required").optional()
], user_controller_1.registerUser);
userRouter.post("/signin", [
    (0, express_validator_1.body)('emailId').isEmail().withMessage('email is required'),
    (0, express_validator_1.body)('password').isStrongPassword().withMessage('strong password is required'),
], user_controller_1.signInUser);
userRouter.post("/signout", user_controller_1.signOut);
exports.default = userRouter;
