import { Router } from "express";
import { body } from "express-validator";
import { fetchAllProjects, createProject } from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.get("/", fetchAllProjects);


//   const { projectName, description, startDate, endDate } = req.body;
projectRouter.post("/",  
    [
      body('projectName').isString().isLength({min : 3}).withMessage('project name must be at least 3 characters long'),
      body('description').isString().isLength({min : 6}).withMessage('description must be more than 6 characters').optional(),
      body('startDate').isDate().withMessage('start date is required'),
      body('endDate').isDate().withMessage('end date is required'),
    ], 
    createProject
);

export default projectRouter;