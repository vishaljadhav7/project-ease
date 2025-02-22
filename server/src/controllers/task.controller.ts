import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

const prisma = new PrismaClient();

interface projectRef {
    projectId : number
}

enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

enum Status {
  To_Do = "To_Do",
  In_Progress = "In_Progress",
  Under_Review = "Under_Review",
  Completed = "Completed",
}


interface taskRequirements {
    taskName : string;
    description : string;
    status : string;
    priority : string;
    tags? : string;
    startDate : Date;
    dueDate : Date;
    points? : number;
    projectId : number;
    createdById: number;
    assignedToId : number;
}

interface taskStatus {
  status : string;
}


export const fetchAllTasks =  async (req: Request<{},{},{}, projectRef>, res: Response): Promise<void> => {
  try {
    const {projectId} = req.query;

    const projectExist  = await prisma.project.findUnique({ 
      where : { id : projectId},
      include : {tasks : true} 
    })
    if(!projectExist){
     throw new Error("projectId does not exist!");
    }
    
    const serverResponse = new ApiResponse(201, projectExist, "task created successfully!");
    res.status(201).json(serverResponse)

  } catch (error : any) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
    res.status(statusCode).json(new ApiError(statusCode, message));
  }
}

export const createTask = async (req: Request<{}, {}, taskRequirements>, res: Response): Promise<void> => {
    try {
     const taskDetails = req.body;
     const {projectId, createdById, assignedToId} = taskDetails;
     
     const projectExist  = await prisma.project.findUnique({ where : { id : projectId} })
     if(!projectExist){
      throw new Error("projectId does not exist !");
     }

     const usersIdExist = await prisma.user.findMany({
      where : {
        id : {
          in : [createdById, assignedToId]
        }
      },
      select: {
        id: true
      }
     });

     const found_Ids = usersIdExist.map(user => user.id);
     const bothExist = found_Ids.includes(createdById) && found_Ids.includes(assignedToId);
     
     if(!bothExist){
       throw new Error("task author or assignee id does'nt exist");
     }

     const {taskName, description, status, priority, tags, startDate, dueDate, points} = taskDetails
   
     const newTask = await prisma.task.create({
      data: {
        taskName, description, status, priority, tags, startDate, dueDate, points,
        projectId, createdById, assignedToId},
    })

    if(!newTask){
      throw new Error("could not create the task!")
    }

    const serverResponse = new ApiResponse(201, newTask, "task created successfully!")
    res.status(201).json(serverResponse)
     
    } catch (error : any) {
      const statusCode = error instanceof ApiError ? error.statusCode : 500;
      const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
      res.status(statusCode).json(new ApiError(statusCode, message));
    }
  }
  

export const modifyTaskStatus = async (req: Request<{taskId : number}, {}>, res: Response): Promise<void> => {
    try {
     const { taskId } = req.params;
     const {status} = req.body;

     const taskExist = await prisma.task.update({
       where : {
        id : taskId,
       },
        data : {
        status : status,
       },
     });

     if(!taskExist){
      throw new Error("could'nt update the task!")
     }

     const serverResponse = new ApiResponse(201, taskExist, "task updated successfully!")
     res.status(201).json(serverResponse)
      
    } catch (error : any) {
      const statusCode = error instanceof ApiError ? error.statusCode : 500;
      const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
      res.status(statusCode).json(new ApiError(statusCode, message));
    }
}

export const fetchUserTasks = async (
    req: Request<{userId : number}>,
    res: Response
  ): Promise<void> => {
    try {
       const {userId} = req.params;
       const userExist = await prisma.user.findUnique({where : {id : userId}});

       if(!userExist){
        throw new Error("user not found for tasks to fetch!")
       }

       const allTasks = await prisma.task.findMany({
        where : {
            OR : [
              {createdById : userId},
              {assignedToId : userId},
            ]
        },
        include : {
          createdTask : true,
          assignedTo : true
        }
       })
      
       const serverResponse = new ApiResponse(201, allTasks, "task updated successfully!")
       res.status(201).json(serverResponse)
       
    } catch (error : any) {
      const statusCode = error instanceof ApiError ? error.statusCode : 500;
      const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
      res.status(statusCode).json(new ApiError(statusCode, message));
    }
}