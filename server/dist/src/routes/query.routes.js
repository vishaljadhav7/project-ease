"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const query_controller_1 = require("../controllers/query.controller");
const queryRouter = (0, express_1.Router)();
//  const { query } = req.query;
queryRouter.get("/", (0, express_validator_1.query)('searchQuery').isString().isLength({ min: 1 }), query_controller_1.searchQuery);
exports.default = queryRouter;
