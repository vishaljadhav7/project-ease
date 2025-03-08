import express, {Request, Response} from 'express'
import cors from "cors";
import helmet from "helmet";
import userRouter from './routes/user.routes';
import projectRouter from './routes/project.routes';
import morgan from "morgan";
import taskRouter from './routes/task.routes';

const app = express()

app.use(express.json({limit : "16kb"}));
app.use(helmet())
app.use(express.urlencoded({extended : true, limit : "16kb"}));

app.use(cors({
   origin : 'http://localhost:3001',
   methods : ["GET", "POST", "DELETE", "PATCH"] 
}));
app.use(morgan("common"));


app.get("/", (req : Request , res : Response) => {
    res.send("This is home route");
});

app.use("/api/v1", userRouter);
app.use("/api/v1", projectRouter);
app.use("/api/v1", taskRouter)

  
export {app};  