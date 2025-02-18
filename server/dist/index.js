"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = Number((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) || 3000;
app_1.app.listen(PORT, () => {
    console.log(`Server running on part ${PORT}`);
});
