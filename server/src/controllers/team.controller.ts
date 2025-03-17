import { Request, Response } from "express";
import { PrismaClient, Team } from "@prisma/client";
import ApiResponse from "../utils/ApiResponse";

const prisma = new PrismaClient();

 export const getTeams = async (req: Request, res: Response): Promise<void> => {
   try {
     const teams = await prisma.team.findMany();

     const userIds = [
      ...new Set([
        ...teams.map(t => t.projectManagerUserId),
      ].filter(id => id !== null)),
    ] as string[];
 
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, userName: true },
    });

    const userMap = new Map(users.map(u => [u.id, u.userName]));

    const teamsWithUsernames = teams.map(team => ({
      ...team,
      projectManagerUsername: team.projectManagerUserId ? userMap.get(team.projectManagerUserId) ?? null : null,
    }));

    res.status(200).json(new ApiResponse(200, teamsWithUsernames, "teams retrieved successfully"))
  
    

   } catch (error: any) {
     res
       .status(500)
       .json({ message: `Error retrieving teams: ${error.message}` });
   } finally {
      await prisma.$disconnect();
    }
 };