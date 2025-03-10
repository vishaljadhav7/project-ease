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
exports.signOut = exports.signInUser = exports.registerUser = exports.fetchUser = exports.fetchAllUsers = void 0;
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 // 1 day
};
const fetchAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(201).json(new ApiResponse_1.default(201, users, "all users retrieved"));
    }
    catch (error) {
        res.status(401).json(new ApiError_1.default(401, error.message));
    }
    finally {
        prisma.$disconnect();
    }
});
exports.fetchAllUsers = fetchAllUsers;
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.userId;
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
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
        res.status(401).json(new ApiError_1.default(401, error.message));
    }
    finally {
        yield prisma.$disconnect();
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
        const registerUser = yield prisma.user.create({
            data: { emailId, password: hashedPassword, userName, profileAvatarUrl, teamId },
        });
        if (!registerUser) {
            throw new Error("user could not be registered!");
        }
        const token = generateJWT(registerUser.id);
        const newUser = {
            id: registerUser.id,
            emailId: registerUser.emailId,
            userName: registerUser.userName,
            teamId: registerUser === null || registerUser === void 0 ? void 0 : registerUser.teamId,
            profileAvatarUrl: registerUser.profileAvatarUrl
        };
        const serverResponse = new ApiResponse_1.default(200, newUser, "user registered successfully");
        res.status(201).json({ serverResponse, "token": token }).cookie("token", token, options);
    }
    catch (error) {
        res.status(400).json(new ApiError_1.default(400, error.message));
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.registerUser = registerUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailId, password } = req.body;
        const userData = yield prisma.user.findUnique({ where: { emailId } });
        if (!userData) {
            throw new Error("invalid credentials!");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, userData.password);
        if (!isPasswordValid) {
            throw new Error("invalid credentials!");
        }
        const token = generateJWT(userData.id);
        const userExist = {
            id: userData.id,
            emailId: userData.emailId,
            userName: userData.userName,
            teamId: userData === null || userData === void 0 ? void 0 : userData.teamId,
            profileAvatarUrl: userData.profileAvatarUrl
        };
        const serverResponse = new ApiResponse_1.default(200, userExist, "User signed in successfully");
        res
            .status(200)
            .cookie("token", token, options)
            .json({ serverResponse, token });
    }
    catch (error) {
        res.status(400).json(new ApiError_1.default(400, error.message));
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.signInUser = signInUser;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            httpOnly: true,
            secure: true
        };
        return res
            .status(200)
            .clearCookie("token", options)
            .json(new ApiResponse_1.default(200, {}, "User has logged Out"));
    }
    catch (error) {
        res.status(400).json(new ApiError_1.default(400, error.message));
    }
});
exports.signOut = signOut;
