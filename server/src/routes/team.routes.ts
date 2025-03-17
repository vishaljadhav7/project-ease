import { Router } from "express";
import { getTeams } from "../controllers/team.controller";
import authMiddleWare from "../middlewares/verifyUser";

const teamRouter = Router();

teamRouter.get("/teams", authMiddleWare ,getTeams);

export default teamRouter;