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
exports.createProject = exports.fetchAllProjects = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const prisma = new client_1.PrismaClient();
const fetchAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.project.findMany();
        res.status(201).json(new ApiResponse_1.default(201, users, "all projects retrieved"));
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.fetchAllProjects = fetchAllProjects;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectName, description, startDate, endDate } = req.body;
        const newProject = yield prisma.project.create({
            data: { projectName, description, startDate, endDate }
        });
        res.status(201).json(new ApiResponse_1.default(201, newProject, "new project created"));
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.createProject = createProject;
