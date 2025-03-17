"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_controller_1 = require("../controllers/team.controller");
const verifyUser_1 = __importDefault(require("../middlewares/verifyUser"));
const teamRouter = (0, express_1.Router)();
teamRouter.get("/teams", verifyUser_1.default, team_controller_1.getTeams);
exports.default = teamRouter;
