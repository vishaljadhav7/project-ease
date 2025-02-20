import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchQuery = async (req: Request<{},{},{},{searchQuery : 'string'}>, res: Response): Promise<void> => {
  try {
    
  } catch (error) {
    
  }
}