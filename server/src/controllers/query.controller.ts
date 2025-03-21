import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/ApiError";

const prisma = new PrismaClient();

export const searchQuery = async (req: Request<{},{},{},{searchQuery : 'string'}>, res: Response): Promise<void> => {
  try {
    const {searchQuery} = req.query
    
  } catch (error) {
    res.status(400).json(new ApiError(400, "could not get the results query"))
  }
}