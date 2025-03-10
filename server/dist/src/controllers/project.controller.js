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
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const projects = yield prisma.project.findMany({
            where: {
                tasks: {
                    every: {
                        OR: [{
                                assignedToId: userId
                            }, {
                                createdById: userId
                            }]
                    },
                }
            },
            include: {
                tasks: true
            }
        });
        res.status(201).json(new ApiResponse_1.default(201, projects, "all projects retrieved"));
    }
    catch (error) {
        res.status(400).json(new ApiError_1.default(400, error.message));
    }
    finally {
        yield prisma.$disconnect();
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
        res.status(400).json(new ApiError_1.default(400, error.message));
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.createProject = createProject;
