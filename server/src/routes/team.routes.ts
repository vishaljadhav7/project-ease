import { Router } from "express";
import { getTeams } from "../controllers/team.controller";
import authMiddleWare from "../middlewares/verifyUser";

const teamRouter = Router();

teamRouter.get("/", authMiddleWare ,getTeams);

export default teamRouter;