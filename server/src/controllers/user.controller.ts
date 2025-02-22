import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";


const prisma = new PrismaClient();

function generateJWT (id : number) {
  const secretKey = process.env.SECRET_KEY;
  
  if (!secretKey) {
    throw new Error('JWT secret key is not configured');
  }

  return jwt.sign({ userId : id }, secretKey, {
    expiresIn: '1h', 
  });
}

interface FetchUserParams {userId: number;}

interface RegisterUserBody {
    emailId: number;
    password: string;
    userName: string;
    profileAvatarUrl: string;
    teamId?: number;
}  

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 1000 * 60 * 60 , // 1 hour in milliseconds
} 

export const fetchAllUsers = async (req : Request, res : Response) : Promise<void> => {
 try {
   const users = await prisma.user.findMany();
   res.status(201).json(new ApiResponse(201, users, "all users retrieved")) 
   
 } catch (error : any) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
  res.status(statusCode).json(new ApiError(statusCode, message));
}
}


export const fetchUser = async (req : Request<FetchUserParams>, res : Response) => {

    try {
      const userId = req.params?.userId
      const user = await prisma.user.findUnique({
        where : {
          id : Number(userId)
        }
      })

      if(!user){
        throw new Error("could not find the user");
      }

      const resData = {
        id : user?.id ,
        emailId : user?.emailId ,
        userName : user.userName  ,
        profileAvatarUrl : user?.profileAvatarUrl, 
        teamId : user?.teamId 
      } 
      
      res.status(201).json(new ApiResponse(201, {}, "user retrieved successfully"))

    } catch (error : any) {
      console.log("error.message ->>>>> ",error.message, "     " , error)
      const statusCode = error instanceof ApiError ? error.statusCode : 500;
      const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
      res.status(statusCode).json(new ApiError(statusCode, message));
    }
}

export const registerUser = async (req : Request<{}, {}, RegisterUserBody>, res : Response) : Promise<void> => {
    try {
      const {emailId, password, userName, profileAvatarUrl, teamId} : RegisterUserBody =  req.body;

      const userExist = await prisma.user.findUnique({where : {emailId : emailId}})
     
      if (userExist) {
        throw new Error("user already registered!") 
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {emailId, password : hashedPassword, userName , profileAvatarUrl, teamId},
      });

      if (!newUser) {
        throw new Error("user could not be registered!") 
      }

      const token = generateJWT(newUser.id) ;
      
      const serverResponse = new ApiResponse(200, newUser, "user registered successfully");

      res.status(201).json({serverResponse, "token" : token} ).cookie("token" , token, options);

    } catch (error : any) {
      const statusCode = error instanceof ApiError ? error.statusCode : 500;
      const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
      res.status(statusCode).json(new ApiError(statusCode, message));
    }
}

export const signInUser = async (req : Request<{}, {}, {emailId : number, password : string}> , res : Response) : Promise<void> => {
  try {
    const {emailId , password} = req.body
    const userExist = await prisma.user.findUnique({where : {emailId : emailId}})

    if (!userExist) {
      throw new Error("invalid credentials!") 
    }
    
    const isPasswordValid = bcrypt.compare(password, userExist.password);

    if(!isPasswordValid){
      throw new Error("invalid credentials!") 
    }
    
    const token = generateJWT(userExist.id) ;
      
    const serverResponse = new ApiResponse(200, userExist, "user signed in successfully");

    res.status(201).json({serverResponse, "token" : token} ).cookie("token" , token, options);

  } catch (error : any) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof ApiError ? error.message : `Server error: ${error.message}`;
    res.status(statusCode).json(new ApiError(statusCode, message));
  }
}