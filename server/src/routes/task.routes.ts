import { Router } from "express";
import { body, param } from "express-validator";
import { createTask, editTask, fetchAllTasks, fetchUserTasks, modifyTaskStatus } from "../controllers/task.controller";
import authMiddleWare from "../middlewares/verifyUser";

const taskRouter = Router();

const Priority = {
 Urgent : "Urgent",
 High : "High",
 Medium : "Medium",
 Low : "Low",
 Backlog : "Backlog",
}

const Status = {
 To_Do : "To_Do",          
 In_Progress : "In_Progress",
 Under_Review : "Under_Review",
 Completed : "Completed",
}

taskRouter.get("/tasks", authMiddleWare , fetchAllTasks);


taskRouter.post("/create-task", [
 body('taskName').isString().isLength({min : 3}).withMessage("task name must be at least 3 characters long"),
 body('description').isString().isLength({min : 6}).withMessage("task name must be at least 6 characters long"),
 body('status').isIn(Object.values(Status)).withMessage("invalid status"),
 body('priority').isIn(Object.values(Priority)).withMessage("invalid status"),
 body('tags').isLength({min:3}).isString().optional(),
 body('startDate').isDate().withMessage('start date is required'),
 body('dueDate').isDate().withMessage('due Date is required'),
 body('points').isNumeric().optional(),
 body('projectId').isUUID().withMessage("project id required"),
 body('createdById').isUUID().withMessage("createdBy id required"),
 body('assignedToId').isUUID().withMessage("assignedTo id required")
] , 
authMiddleWare,
createTask
);

taskRouter.patch("/task/:taskId/status", 
    [
      param('taskId').isUUID().withMessage("task id required"),
      body('status').isIn(Object.values(Status)).withMessage("invalid status"), 
    ], 
    authMiddleWare,
    modifyTaskStatus
);


taskRouter.get("/tasks/user/:userId", 
    [
       param('userId').isUUID().withMessage("user id required"), 
    ], 
    authMiddleWare,
    fetchUserTasks
);

taskRouter.patch("/edit-task/:taskId", [
  param('taskId').isUUID().withMessage("task id required"),
  body('taskName').isString().isLength({min : 3}).withMessage("task name must be at least 3 characters long"),
  body('description').isString().isLength({min : 6}).withMessage("task name must be at least 6 characters long"),
  body('status').isIn(Object.values(Status)).withMessage("invalid status"),
  body('priority').isIn(Object.values(Priority)).withMessage("invalid status"),
  body('tags').isLength({min:3}).isString().optional(),
  body('startDate').isDate().withMessage('start date is required'),
  body('dueDate').isDate().withMessage('due Date is required'),
  body('points').isNumeric().optional(),
  body('projectId').isUUID().withMessage("project id required"),
  body('createdById').isUUID().withMessage("createdBy id required"),
  body('assignedToId').isUUID().withMessage("assignedTo id required")
 ] , 
 authMiddleWare,
 editTask
 );



export default taskRouter;