"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const project_controller_1 = require("../controllers/project.controller");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const projectRouter = (0, express_1.Router)();
projectRouter.get("/projects", verifyUser_1.default, project_controller_1.fetchAllProjects);
projectRouter.post("/create-project", [
    (0, express_validator_1.body)('projectName').isString().isLength({ min: 3 }).withMessage('project name must be at least 3 characters long'),
    (0, express_validator_1.body)('description').isString().isLength({ min: 6 }).withMessage('description must be more than 6 characters').optional(),
    (0, express_validator_1.body)('startDate').isDate().withMessage('start date is required'),
    (0, express_validator_1.body)('endDate').isDate().withMessage('end date is required'),
], verifyUser_1.default, project_controller_1.createProject);
exports.default = projectRouter;
