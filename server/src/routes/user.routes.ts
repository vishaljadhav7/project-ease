import { Router } from "express";
import {  param, body } from "express-validator";
import { registerUser, fetchUser, fetchAllUsers, signInUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/users", fetchAllUsers);


userRouter.get("/user/:userId", 
  [
    param('userId').isLength({min:1}).withMessage("userId required")
  ],
fetchUser
);

userRouter.post("/signup",  
  [
    body('userName').isString().isLength({min:3}).withMessage("googleId is required"),
    body('emailId').isEmail().withMessage('email is required'),
    body('password').isStrongPassword().withMessage('strong password is required'),
    body('profileAvatarUrl').isURL().withMessage('profile avatar url is required').optional(),
    body('teamId').isLength({min:1}).withMessage("team id is required").optional()
  ],
  registerUser
);


userRouter.post("/signin", [
  body('emailId').isEmail().withMessage('email is required'),
  body('password').isStrongPassword().withMessage('strong password is required'),
],
signInUser)

export default userRouter;