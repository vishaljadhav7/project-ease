import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const prisma = new PrismaClient();

interface projectRequirements {
  projectName : string;
  description? : string;
  startDate : Date;
  endDate : Date;
}

export const fetchAllProjects = async (req :Request, res : Response) : Promise<void> => {
  try {
    const users = await prisma.project.findMany();
    res.status(201).json(new ApiResponse(201, users, "all projects retrieved")) 
    
  } catch (error : any) {
   const statusCode = error instanceof ApiError ? error.statusCode : 500;
   const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
   res.status(statusCode).json(new ApiError(statusCode, message));
 }
}

export const createProject = async (req :Request<{}, {}, projectRequirements>, res : Response) : Promise<void> => {
    try {
      const {projectName, description, startDate, endDate} = req.body
      const newProject = await prisma.project.create({
        data : {projectName, description, startDate, endDate} 
      });
      res.status(201).json(new ApiResponse(201, newProject, "new project created")) 
    
    } catch (error : any) {
     const statusCode = error instanceof ApiError ? error.statusCode : 500;
     const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
     res.status(statusCode).json(new ApiError(statusCode, message));
   }
  }