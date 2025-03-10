"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserTasks = exports.editTask = exports.modifyTaskStatus = exports.createTask = exports.fetchAllTasks = void 0;
const client_1 = require("@prisma/client");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// import { Status, Priority } from "@prisma/client";
const prisma = new client_1.PrismaClient();
var Priority;
(function (Priority) {
    Priority["Urgent"] = "Urgent";
    Priority["High"] = "High";
    Priority["Medium"] = "Medium";
    Priority["Low"] = "Low";
    Priority["Backlog"] = "Backlog";
})(Priority || (Priority = {}));
var Status;
(function (Status) {
    Status["To_Do"] = "To_Do";
    Status["In_Progress"] = "In_Progress";
    Status["Under_Review"] = "Under_Review";
    Status["Completed"] = "Completed";
})(Status || (Status = {}));
const fetchAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.query;
        const projectExist = yield prisma.project.findUnique({
            where: { id: projectId },
            include: { tasks: { include: { createdTask: true,
                        assignedTo: true,
                        userComments: true,
                        uploadedFiles: true
                    } } }
        });
        if (!projectExist) {
            throw new Error("projectId does not exist!");
        }
        const serverResponse = new ApiResponse_1.default(201, projectExist, "task created successfully!");
        res.status(201).json(serverResponse);
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        res.status(statusCode).json(new ApiError_1.default(statusCode, error.message));
    }
    finally {
        yield prisma.$disconnect(); // Ensure Prisma client disconnects
    }
});
exports.fetchAllTasks = fetchAllTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskDetails = req.body;
        const { projectId, createdById, assignedToId } = taskDetails;
        const projectExist = yield prisma.project.findUnique({ where: { id: projectId } });
        if (!projectExist) {
            throw new Error("projectId does not exist !");
        }
        const usersIdExist = yield prisma.user.findMany({
            where: {
                id: {
                    in: [createdById, assignedToId]
                }
            },
            select: {
                id: true
            }
        });
        const found_Ids = usersIdExist.map(user => user.id);
        const bothExist = found_Ids.includes(createdById) && found_Ids.includes(assignedToId);
        if (!bothExist) {
            throw new Error("task author or assignee id does'nt exist");
        }
        const { taskName, description, status, priority, tags, startDate, dueDate, points } = taskDetails;
        const newTask = yield prisma.task.create({
            data: {
                taskName, description, status, priority, startDate, dueDate, points,
                projectId, createdById, assignedToId
            },
        });
        if (!newTask) {
            throw new Error("could not create the task!");
        }
        const serverResponse = new ApiResponse_1.default(201, newTask, "task created successfully!");
        res.status(201).json(serverResponse);
    }
    catch (error) {
        console.log("(createTask) =>>>  ", error.message);
        res.status(400).json(new ApiError_1.default(400, error.message));
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.createTask = createTask;
const modifyTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const taskExist = yield prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                status: status,
            },
        });
        if (!taskExist) {
            throw new Error("could'nt update the task!");
        }
        const serverResponse = new ApiResponse_1.default(201, taskExist, "task updated successfully!");
        res.status(201).json(serverResponse);
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        res.status(statusCode).json(new ApiError_1.default(statusCode, error.message));
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.modifyTaskStatus = modifyTaskStatus;
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editDetails = req.body;
        const { taskId } = req.params;
        if (!editDetails)
            throw new Error("Edit details not available!");
        const allowedEditFields = ["taskName", "assignedToId", "description", "points", "priority", "status", "projectId", "startDate", "dueDate", "tags"];
        const isValid = Object.keys(editDetails).every((item) => allowedEditFields.includes(item));
        if (!isValid)
            throw new Error("Invalid edit field not allowed");
        const updatedTask = yield prisma.task.update({
            where: {
                id: taskId,
            },
            data: Object.assign({}, editDetails),
        });
        res.status(200).json(new ApiResponse_1.default(200, updatedTask, "task updated successfully"));
    }
    catch (error) {
        console.log("(editTask) ==>> ", error, error.message);
        res.status(400).json(new ApiError_1.default(400, `Could not update the task : Error ${error.message}`));
    }
    finally {
        prisma.$disconnect();
    }
});
exports.editTask = editTask;
const fetchUserTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const allTasks = yield prisma.task.findMany({
            where: {
                OR: [
                    { createdById: userId },
                    { assignedToId: userId },
                ]
            },
            include: {
                createdTask: true,
                assignedTo: true
            }
        });
        const serverResponse = new ApiResponse_1.default(201, allTasks, "task updated successfully!");
        res.status(201).json(serverResponse);
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        res.status(statusCode).json(new ApiError_1.default(statusCode, error.message));
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.fetchUserTasks = fetchUserTasks;
