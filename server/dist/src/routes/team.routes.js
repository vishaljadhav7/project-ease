"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_controller_1 = require("../controllers/team.controller");
const teamRouter = (0, express_1.Router)();
teamRouter.get("/", team_controller_1.getTeams);
exports.default = teamRouter;
