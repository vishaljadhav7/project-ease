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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeams = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
    }
});
exports.getTeams = getTeams;
//  export const getTeams = async (req: Request, res: Response): Promise<void> => {
//    try {
//      const teams = await prisma.team.findMany();
//      const teamsWithUsernames = await Promise.all(
//        teams.map(async (team: any) => {
//          const productOwner = await prisma.user.findUnique({
//            where: { userId: team.productOwnerUserId! },
//            select: { username: true },
//          });
//          const projectManager = await prisma.user.findUnique({
//            where: { userId: team.projectManagerUserId! },
//            select: { username: true },
//          });
//          return {
//            ...team,
//            productOwnerUsername: productOwner?.username,
//            projectManagerUsername: projectManager?.username,
//          };
//        })
//      );
//      res.json(teamsWithUsernames);
//    } catch (error: any) {
//      res
//        .status(500)
//        .json({ message: `Error retrieving teams: ${error.message}` });
//    }
//  };
