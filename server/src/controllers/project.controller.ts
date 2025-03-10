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
   const userId = req.user?.id
    const projects = await prisma.project.findMany({
      where : {
        tasks : {
          every : {
            OR : [{
              assignedToId : userId
            }, {
              createdById : userId
            }]
          },
        }
      },
      include: {
        tasks : true
      }   
    });
    
    res.status(201).json(new ApiResponse(201, projects, "all projects retrieved")) 
  
  } catch (error : any) {
    res.status(400).json(new ApiError(400, error.message));
  } finally {
    await prisma.$disconnect(); 
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
      res.status(400).json(new ApiError(400, error.message));
    } finally {
      await prisma.$disconnect(); 
    }
  }