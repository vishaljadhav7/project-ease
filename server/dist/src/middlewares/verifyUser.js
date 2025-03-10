"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const authMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        if (!decoded.userId) {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
        const userInfo = yield prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!userInfo) {
            res.status(401).json({ success: false, message: "Invalid token: User not found" });
            return;
        }
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        console.error("Token Verification Middleware Error:", error.message);
        res.status(401).json({
            success: false,
            message: `Invalid token: ${error.message}`,
        });
    }
});
exports.default = authMiddleWare;
