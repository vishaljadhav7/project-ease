import { Request, Response,  NextFunction } from "express"
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient()

interface User {
    id: string;
}
declare module 'express' {
    export interface Request {
        user?: User;
    }
}


async function authMiddleWare(req: Request, res: Response, next: NextFunction) {
    // Get the authorization header
    const authHeader = req.headers['authorization'] || req.cookies.token;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).send('No token provided');
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!);
        
        if (typeof decoded === 'object' && 'id' in decoded) {  
            const userInfo = await prisma.user.findUnique({where : { id : decoded.id}})
            if(!userInfo) throw new Error("not a vaild token!")
                
            req.user = decoded as User;
            next();
        } else {
            return res.status(401).send('Invalid token');
        }
    } catch (error : any) {

         console.error('Token Verification Middleware Error:', error.message);
         return res.status(500).json({
          success: false,
          message: 'Internal Server Error: ' + error.message,
        });
    }
}

export default authMiddleWare;