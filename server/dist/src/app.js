"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const morgan_1 = __importDefault(require("morgan"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({ limit: "16kb" }));
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "DELETE", "PATCH"]
}));
app.use((0, morgan_1.default)("common"));
app.get("/", (req, res) => {
    res.send("This is home route");
});
app.use("/api/v1", user_routes_1.default);
app.use("/api/v1", project_routes_1.default);
app.use("/api/v1", task_routes_1.default);
app.use("/api/v1", team_routes_1.default);
