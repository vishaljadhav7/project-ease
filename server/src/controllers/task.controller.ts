import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
// import { Status, Priority } from "@prisma/client";
const prisma = new PrismaClient();

interface projectRef {
    projectId : string
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
    projectId : string;
    createdById: string;
    assignedToId : string;
}

interface taskStatus {
  status : string;
}


export const fetchAllTasks =  async (req: Request<{},{},{}, projectRef>, res: Response): Promise<void> => {
  try {
    const {projectId} = req.query;

    const projectExist  = await prisma.project.findUnique({ 
      where : { id : projectId},
      include : {tasks : 
        {include : 
          { createdTask : true, 
            assignedTo : true, 
            userComments : true, 
            uploadedFiles :  true
          }}} 
    })

    if(!projectExist){
     throw new Error("projectId does not exist!");
    }
    
    const serverResponse = new ApiResponse(201, projectExist, "task created successfully!");
    res.status(201).json(serverResponse)

  } catch (error : any) {

    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    res.status(statusCode).json(new ApiError(statusCode, error.message));
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

     const {taskName, description, status, priority, tags, startDate, dueDate, points} = taskDetails;
   
     console.log("{taskName, description, status, priority, tags, startDate, dueDate, points}  =>>>> ", {taskName, description, status, priority, tags, startDate, dueDate, points} )
     
     const newTask = await prisma.task.create({
      data: {
        //@ts-ignore
        taskName, description, status , priority, startDate, dueDate, points,
        projectId, createdById, assignedToId},
    });

    if(!newTask){
      throw new Error("could not create the task!")
    }

    const serverResponse = new ApiResponse(201, newTask, "task created successfully!")
    res.status(201).json(serverResponse)
     
    } catch (error : any) {  
      res.status(400).json(new ApiError(400, error.message));
    }
  }
  

export const modifyTaskStatus = async (req: Request<{taskId : number}, {}>, res: Response): Promise<void> => {
    try {
     const { taskId } = req.params;
     const {status} = req.body;

     const taskExist = await prisma.task.update({
       where : {
        id : Number(taskId),
       },
        data : {
        status : status ,
       },
     });

     if(!taskExist){
      throw new Error("could'nt update the task!")
     }

     const serverResponse = new ApiResponse(201, taskExist, "task updated successfully!")
     res.status(201).json(serverResponse)
      
    } catch (error : any) {
      const statusCode = error instanceof ApiError ? error.statusCode : 500;
      res.status(statusCode).json(new ApiError(statusCode, error.message));
    }
}

export const fetchUserTasks = async (
    req: Request<{userId : number}>,
    res: Response
  ): Promise<void> => {
    try {
       const {userId} = req.params;

       const userExist = await prisma.user.findUnique({where : {id : Number(userId)}});
       
       if(!userExist){
        throw new Error("user not found for tasks to fetch!")
       }

       const allTasks = await prisma.task.findMany({
        where : {
            OR : [
              {createdById : Number(userId)},
              {assignedToId : Number(userId)},
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
   
      res.status(statusCode).json(new ApiError(statusCode, error.message));
    }
}