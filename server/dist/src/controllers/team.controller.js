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
exports.getTeams = void 0;
const client_1 = require("@prisma/client");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const prisma = new client_1.PrismaClient();
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield prisma.team.findMany();
        const userIds = [
            ...new Set([
                ...teams.map(t => t.productOwnerUserId),
                ...teams.map(t => t.projectManagerUserId),
            ].filter(id => id !== null)),
        ];
        const users = yield prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, userName: true },
        });
        const userMap = new Map(users.map(u => [u.id, u.userName]));
        const teamsWithUsernames = teams.map(team => {
            var _a, _b;
            return (Object.assign(Object.assign({}, team), { productOwnerUsername: team.productOwnerUserId ? (_a = userMap.get(team.productOwnerUserId)) !== null && _a !== void 0 ? _a : null : null, projectManagerUsername: team.projectManagerUserId ? (_b = userMap.get(team.projectManagerUserId)) !== null && _b !== void 0 ? _b : null : null }));
        });
        res.status(200).json(new ApiResponse_1.default(200, teamsWithUsernames, "teams retrieved successfully"));
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving teams: ${error.message}` });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getTeams = getTeams;
