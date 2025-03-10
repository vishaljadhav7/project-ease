"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const task_controller_1 = require("../controllers/task.controller");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const taskRouter = (0, express_1.Router)();
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
taskRouter.get("/tasks", verifyUser_1.default, task_controller_1.fetchAllTasks);
taskRouter.post("/create-task", [
    (0, express_validator_1.body)('taskName').isString().isLength({ min: 3 }).withMessage("task name must be at least 3 characters long"),
    (0, express_validator_1.body)('description').isString().isLength({ min: 6 }).withMessage("task name must be at least 6 characters long"),
    (0, express_validator_1.body)('status').isIn(Object.values(Status)).withMessage("invalid status"),
    (0, express_validator_1.body)('priority').isIn(Object.values(Priority)).withMessage("invalid status"),
    (0, express_validator_1.body)('tags').isLength({ min: 3 }).isString().optional(),
    (0, express_validator_1.body)('startDate').isDate().withMessage('start date is required'),
    (0, express_validator_1.body)('dueDate').isDate().withMessage('due Date is required'),
    (0, express_validator_1.body)('points').isNumeric().optional(),
    (0, express_validator_1.body)('projectId').isUUID().withMessage("project id required"),
    (0, express_validator_1.body)('createdById').isUUID().withMessage("createdBy id required"),
    (0, express_validator_1.body)('assignedToId').isUUID().withMessage("assignedTo id required")
], verifyUser_1.default, task_controller_1.createTask);
taskRouter.patch("/task/:taskId/status", [
    (0, express_validator_1.param)('taskId').isUUID().withMessage("task id required"),
    (0, express_validator_1.body)('status').isIn(Object.values(Status)).withMessage("invalid status"),
], verifyUser_1.default, task_controller_1.modifyTaskStatus);
taskRouter.get("/tasks/user/:userId", [
    (0, express_validator_1.param)('userId').isUUID().withMessage("user id required"),
], verifyUser_1.default, task_controller_1.fetchUserTasks);
taskRouter.patch("/edit-task/:taskId", [
    (0, express_validator_1.param)('taskId').isUUID().withMessage("task id required"),
    (0, express_validator_1.body)('taskName').isString().isLength({ min: 3 }).withMessage("task name must be at least 3 characters long"),
    (0, express_validator_1.body)('description').isString().isLength({ min: 6 }).withMessage("task name must be at least 6 characters long"),
    (0, express_validator_1.body)('status').isIn(Object.values(Status)).withMessage("invalid status"),
    (0, express_validator_1.body)('priority').isIn(Object.values(Priority)).withMessage("invalid status"),
    (0, express_validator_1.body)('tags').isLength({ min: 3 }).isString().optional(),
    (0, express_validator_1.body)('startDate').isDate().withMessage('start date is required'),
    (0, express_validator_1.body)('dueDate').isDate().withMessage('due Date is required'),
    (0, express_validator_1.body)('points').isNumeric().optional(),
    (0, express_validator_1.body)('projectId').isUUID().withMessage("project id required"),
    (0, express_validator_1.body)('createdById').isUUID().withMessage("createdBy id required"),
    (0, express_validator_1.body)('assignedToId').isUUID().withMessage("assignedTo id required")
], verifyUser_1.default, task_controller_1.editTask);
exports.default = taskRouter;
