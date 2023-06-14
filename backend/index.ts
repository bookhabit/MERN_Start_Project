
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import mongoose from 'mongoose'
import connectToMongoDB from "./models";

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:5173'}));

// 몽고DB 연결
connectToMongoDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World From the Typescript Server!')
});

app.listen(4000)
