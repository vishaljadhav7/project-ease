import express, {Request, Response} from 'express'
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors({
   origin : '*',
   methods : ["GET", "POST"] 
}));
app.use(morgan("common"));


app.get("/", (req : Request , res : Response) => {
    res.send("This is home route");
});
  
export {app};  