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
exports.signInUser = exports.registerUser = exports.fetchUser = exports.fetchAllUsers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const prisma = new client_1.PrismaClient();
function generateJWT(id) {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not configured');
    }
    return jsonwebtoken_1.default.sign({ userId: id }, secretKey, {
        expiresIn: '1h',
    });
}
const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
};
const fetchAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(201).json(new ApiResponse_1.default(201, users, "all users retrieved"));
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.fetchAllUsers = fetchAllUsers;
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.userId;
        const user = yield prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        if (!user) {
            throw new Error("could not find the user");
        }
        const resData = {
            id: user === null || user === void 0 ? void 0 : user.id,
            emailId: user === null || user === void 0 ? void 0 : user.emailId,
            userName: user.userName,
            profileAvatarUrl: user === null || user === void 0 ? void 0 : user.profileAvatarUrl,
            teamId: user === null || user === void 0 ? void 0 : user.teamId
        };
        res.status(201).json(new ApiResponse_1.default(201, {}, "user retrieved successfully"));
    }
    catch (error) {
        console.log("error.message ->>>>> ", error.message, "     ", error);
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.fetchUser = fetchUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailId, password, userName, profileAvatarUrl, teamId } = req.body;
        const userExist = yield prisma.user.findUnique({ where: { emailId: emailId } });
        if (userExist) {
            throw new Error("user already registered!");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: { emailId, password: hashedPassword, userName, profileAvatarUrl, teamId },
        });
        if (!newUser) {
            throw new Error("user could not be registered!");
        }
        const token = generateJWT(newUser.id);
        const serverResponse = new ApiResponse_1.default(200, newUser, "user registered successfully");
        res.status(201).json({ serverResponse, "token": token }).cookie("token", token, options);
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.registerUser = registerUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailId, password } = req.body;
        const userExist = yield prisma.user.findUnique({ where: { emailId: emailId } });
        if (!userExist) {
            throw new Error("invalid credentials!");
        }
        const isPasswordValid = bcrypt_1.default.compare(password, userExist.password);
        if (!isPasswordValid) {
            throw new Error("invalid credentials!");
        }
        const token = generateJWT(userExist.id);
        const serverResponse = new ApiResponse_1.default(200, userExist, "user signed in successfully");
        res.status(201).json({ serverResponse, "token": token }).cookie("token", token, options);
    }
    catch (error) {
        const statusCode = error instanceof ApiError_1.default ? error.statusCode : 500;
        const message = error instanceof ApiError_1.default ? error.message : `Server error: ${error.message}`;
        res.status(statusCode).json(new ApiError_1.default(statusCode, message));
    }
});
exports.signInUser = signInUser;
