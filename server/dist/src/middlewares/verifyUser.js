"use strict";
// import { Request, Response,  NextFunction } from "express"
// import { PrismaClient } from "@prisma/client";
// import bcrypt from 'bcrypt';
// import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
// const prisma = new PrismaClient()
// const verifyUser = async (req : Request, res : Response, next : NextFunction) => {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//   if(!token){
//     return res.status(401).json({
//         success: false,
//         message: 'Token not provided in cookies or headers',
//       });
//   }
//   try {
//     const decodedMsg : {userId : string | JwtPayload} = jwt.verify(token, process.env.SECRET_KEY!);
//     const userId = decodedMsg?.userId ;
//     const userExist = await  prisma.user.findUnique({where : {id : userId}});
//   } catch (error) {
//   }
// }
