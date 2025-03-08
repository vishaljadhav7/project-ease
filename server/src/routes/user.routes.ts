import { Router } from "express";
import {  param, body } from "express-validator";
import { registerUser, fetchUser, fetchAllUsers, signInUser } from "../controllers/user.controller";
import authMiddleWare from "../middlewares/verifyUser";

const userRouter = Router();

userRouter.get("/users", fetchAllUsers);


userRouter.get("/user/:userId", 
  [
    param('userId').isUUID().withMessage("userId required")
  ],
 authMiddleWare,
 //@ts-ignore
  fetchUser
);

userRouter.post("/signup",  
  [
    body('userName').isString().isLength({min:3}).withMessage("username is required"),
    body('emailId').isEmail().withMessage('email is required'),
    body('password').isStrongPassword().withMessage('strong password is required'),
    body('profileAvatarUrl').isURL().withMessage('profile avatar url is required').optional(),
    body('teamId').isUUID().withMessage("team id is required").optional()
  ],
  authMiddleWare,
  registerUser
);


userRouter.post("/signin", [
  body('emailId').isEmail().withMessage('email is required'),
  body('password').isStrongPassword().withMessage('strong password is required'),
],
authMiddleWare,
signInUser)

export default userRouter;