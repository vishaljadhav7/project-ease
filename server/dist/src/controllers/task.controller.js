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
exports.fetchUserTasks = exports.modifyTaskStatus = exports.createTask = exports.fetchAllTasks = void 0;
const client_1 = require("@prisma/client");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
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
        console.log("(fetchAllTasks) => ", projectId);
        const projectExist = yield prisma.project.findUnique({
            where: { id: Number(projectId) },
            include: { tasks: { include: { createdTask: true,
                        assignedTo: true,
                        userComments: true,
                        uploadedFiles: true
                    } } }
        });
        console.log("(fetchAllTasks) => ", projectExist);
        if (!projectExist) {
            throw new Error("projectId does not exist!");
        }
        const serverResponse = new ApiResponse_1.default(201, projectExist, "task created successfully!");
        res.status(201).json(serverResponse);
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.fetchAllTasks = fetchAllTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskDetails = req.body;
        const { projectId, createdById, assignedToId } = taskDetails;
        const projectExist = yield prisma.project.findUnique({ where: { id: Number(projectId) } });
        if (!projectExist) {
            throw new Error("projectId does not exist !");
        }
        const usersIdExist = yield prisma.user.findMany({
            where: {
                id: {
                    in: [Number(createdById), Number(assignedToId)]
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
        console.log("{taskName, description, status, priority, tags, startDate, dueDate, points}  =>>>> ", { taskName, description, status, priority, tags, startDate, dueDate, points });
        const newTask = yield prisma.task.create({
            data: {
                taskName, description, status, priority, startDate, dueDate, points,
                projectId, createdById, assignedToId
            },
        });
        console.log("(createTask ctrlr) =>>>>> ", newTask);
        if (!newTask) {
            throw new Error("could not create the task!");
        }
        const serverResponse = new ApiResponse_1.default(201, newTask, "task created successfully!");
        res.status(201).json(serverResponse);
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(400).json(new ApiError_1.default(400, error.message));
    }
});
exports.createTask = createTask;
const modifyTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const taskExist = yield prisma.task.update({
            where: {
                id: Number(taskId),
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
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.modifyTaskStatus = modifyTaskStatus;
const fetchUserTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userExist = yield prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!userExist) {
            throw new Error("user not found for tasks to fetch!");
        }
        const allTasks = yield prisma.task.findMany({
            where: {
                OR: [
                    { createdById: Number(userId) },
                    { assignedToId: Number(userId) },
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
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.fetchUserTasks = fetchUserTasks;
