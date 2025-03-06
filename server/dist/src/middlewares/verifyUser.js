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
function authMiddleWare(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the authorization header
        const authHeader = req.headers['authorization'] || req.cookies.token;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Unauthorized');
        }
        // Extract the token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('No token provided');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            if (typeof decoded === 'object' && 'id' in decoded) {
                const userInfo = yield prisma.user.findUnique({ where: { id: decoded.id } });
                if (!userInfo)
                    throw new Error("not a vaild token!");
                req.user = decoded;
                next();
            }
            else {
                return res.status(401).send('Invalid token');
            }
        }
        catch (error) {
            console.error('Token Verification Middleware Error:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error: ' + error.message,
            });
        }
    });
}
exports.default = authMiddleWare;
