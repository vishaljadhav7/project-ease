import { Router } from "express";
import { query } from "express-validator";
import {searchQuery} from '../controllers/query.controller';

const queryRouter = Router();

//  const { query } = req.query;

queryRouter.get("/", 
   query('searchQuery').isString().isLength({ min: 1 }),
   searchQuery
);

export default queryRouter;