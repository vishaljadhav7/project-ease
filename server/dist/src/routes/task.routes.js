"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const task_controller_1 = require("../controllers/task.controller");
const taskRouter = (0, express_1.Router)();
taskRouter.get("/", task_controller_1.fetchAllTasks);
const Priority = {
    Urgent: "Urgent",
    High: "High",
    Medium: "Medium",
    Low: "Low",
    Backlog: "Backlog",
};
const Status = {
    To_Do: "To_Do",
    In_Progress: "In_Progress",
    Under_Review: "Under_Review",
    Completed: "Completed",
};
taskRouter.post("/create-task", [
    (0, express_validator_1.body)('taskName').isString().isLength({ min: 3 }).withMessage("task name must be at least 3 characters long"),
    (0, express_validator_1.body)('description').isString().isLength({ min: 6 }).withMessage("task name must be at least 6 characters long"),
    (0, express_validator_1.body)('status').isIn(Object.values(Status)).withMessage("invalid status"),
    (0, express_validator_1.body)('priority').isIn(Object.values(Priority)).withMessage("invalid status"),
    (0, express_validator_1.body)('tags').isLength({ min: 3 }).isString().optional(),
    (0, express_validator_1.body)('startDate').isDate().withMessage('start date is required'),
    (0, express_validator_1.body)('dueDate').isDate().withMessage('due Date is required'),
    (0, express_validator_1.body)('points').isNumeric().optional(),
    (0, express_validator_1.body)('projectId').isLength({ min: 1 }).withMessage("project id required"),
    (0, express_validator_1.body)('createdById').isLength({ min: 1 }).withMessage("createdBy id required"),
    (0, express_validator_1.body)('assignedToId').isLength({ min: 1 }).withMessage("assignedTo id required")
], task_controller_1.createTask);
taskRouter.patch("/:taskId/status", [
    (0, express_validator_1.param)('taskId').isLength({ min: 1 }).withMessage("task id required"),
    (0, express_validator_1.body)('status').isIn(Object.values(Status)).withMessage("invalid status"),
], task_controller_1.modifyTaskStatus);
taskRouter.get("/user/:userId", [
    (0, express_validator_1.param)('userId').isLength({ min: 1 }).withMessage("user id required"),
], task_controller_1.fetchUserTasks);
exports.default = taskRouter;
