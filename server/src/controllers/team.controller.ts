import { Request, Response } from "express";
import { PrismaClient, Team, User } from "@prisma/client";
import ApiResponse from "../utils/ApiResponse";

const prisma = new PrismaClient();

type  IteamsWithUsernames = {
  id: string;
  teamName: string;
  projectManagerUserId: string | null;
  projectManagerUsername: string | null
} 

 export const getTeams = async (req: Request, res: Response): Promise<void> => {
   try {
     const teams = await prisma.team.findMany();

     const userIds = [
      ...new Set([
        ...teams.map( (t : Team) => t.projectManagerUserId ),
      ].filter(id => id !== null)),
    ] as string[];
 
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, userName: true },
    });

    const userMap = new Map(users.map((u : {id : string; userName : string}) => [u.id, u.userName]));

    const teamsWithUsernames: IteamsWithUsernames[] = teams.map((team: Team) => ({
      id: team.id,
      teamName: team.teamName,
      projectManagerUserId: team.projectManagerUserId,
      projectManagerUsername: team.projectManagerUserId ? userMap.get(team.projectManagerUserId) ?? null : null,
    }));

    res.status(200).json(new ApiResponse(200, teamsWithUsernames, "teams retrieved successfully"))
  
    return

   } catch (error: any) {
     res
       .status(500)
       .json({ message: `Error retrieving teams: ${error.message}` });
       return
   } finally {
      await prisma.$disconnect();
    }
 };