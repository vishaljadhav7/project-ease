"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.get("/users", user_controller_1.fetchAllUsers);
userRouter.get("/user/:userId", [
    (0, express_validator_1.param)('userId').isNumeric().isLength({ min: 1 }).withMessage("userId required")
], user_controller_1.fetchUser);
userRouter.post("/signup", [
    (0, express_validator_1.body)('userName').isString().isLength({ min: 3 }).withMessage("googleId is required"),
    (0, express_validator_1.body)('emailId').isEmail().withMessage('email is required'),
    (0, express_validator_1.body)('password').isStrongPassword().withMessage('strong password is required'),
    (0, express_validator_1.body)('profileAvatarUrl').isURL().withMessage('profile avatar url is required').optional(),
    (0, express_validator_1.body)('teamId').isLength({ min: 1 }).withMessage("team id is required").optional()
], user_controller_1.registerUser);
userRouter.post("/signin", [
    (0, express_validator_1.body)('emailId').isEmail().withMessage('email is required'),
    (0, express_validator_1.body)('password').isStrongPassword().withMessage('strong password is required'),
], user_controller_1.signInUser);
exports.default = userRouter;
