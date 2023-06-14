
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import connectToMongoDB from "./models";
import User from "./models/User";
import bcrypt from "bcryptjs"

dotenv.config();
const app: Express = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:5173'}));

// 몽고DB 연결
connectToMongoDB();

// 회원가입
app.post('/register', async (req,res) => {
      const {name,email,password} = req.body;
      try {
          const userDoc = await User.create({
          name,
          email,
          password:bcrypt.hashSync(password, bcryptSalt),
          });
          res.json(userDoc);
      } catch (e) {
          res.status(422).json(e);
      }
  });

app.listen(4000)
