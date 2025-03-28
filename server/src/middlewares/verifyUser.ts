import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface User {
  id: string;
  userName?: string; // Optional fields from your user.json
  emailId?: string;
}

// Extend Express Request type to include user
declare module "express" {
  export interface Request {
    user?: User;
  }
}

const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const authHeader = req.headers["authorization"] || req.cookies.token;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }


  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  try {
  
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { userId: string };

    if (!decoded.userId) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    const userInfo = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!userInfo) {
      res.status(401).json({ success: false, message: "Invalid token: User not found" });
      return;
    }

    req.user = { id: decoded.userId }; 
    next();
  } catch (error: any) {
    console.error("Token Verification Middleware Error:", error.message);
    res.status(401).json({
      success: false,
      message: `Invalid token: ${error.message}`,
    });
  }
};

export default authMiddleWare;