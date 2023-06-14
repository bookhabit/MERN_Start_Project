
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import connectToMongoDB from "./models";
import User from "./models/User";
import Post from "./models/Post";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserDataType, UserType } from "./Types/UserType";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader"
import multer from 'multer'
import fs from 'fs'
import pathLB from "path"

dotenv.config();
const app: Express = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads/',express.static(__dirname+'/uploads'))
app.use(cors({credentials:true,origin:'http://localhost:5173'}));

// 몽고DB 연결
connectToMongoDB();

// 회원가입
app.post('/register', async (req:Request,res:Response) => {
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

// 로그인
app.post('/login', async (req:Request,res:Response) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email}) as UserType;
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

// 로그아웃
app.post('/logout',(req:Request,res:Response)=>{
  res.cookie('token','').json(true);
})

// 로그인 유지
app.get('/profile', (req:Request,res:Response) => {
  const {token} = req.cookies;
  if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userDataCallback) => {
        const userData = userDataCallback as UserDataType
        if (err) throw err;
       const userDoc = await User.findById(userData.id) as UserType;
       const {name,email,_id} = userDoc;
      res.json({name,email,_id});
      });
  } else {
      res.json(null);
  }
});

// REST_API

// input string(이미지주소)으로 이미지업로드
app.post('/upload-by-link', async (req: Request, res: Response) => {
  const { link }: { link: string } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  const uploadPath = pathLB.join(__dirname, 'uploads', newName); // 경로 수정
  console.log(uploadPath);
  await imageDownloader.image({
    url: link,
    dest: uploadPath,
  });
  res.json(newName);
});

// input file로 파일업로드
const photosMiddleware = multer({ dest: pathLB.join(__dirname, 'uploads') }); // 경로 수정
app.post('/upload', photosMiddleware.array('photos', 100), (req: Request, res: Response) => {
  const uploadFiles: string[] = [];

  if (Array.isArray(req.files)) {
    for (let i = 0; i < req.files.length; i++) {
      console.log(req.files);
      const { path, originalname } = req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newName = 'photo' + Date.now() + '.' + ext;
      const uploadPath = pathLB.join(__dirname, 'uploads', newName); // 경로 수정
      fs.renameSync(path, uploadPath);
      uploadFiles.push(newName);
    }
  }
  res.json(uploadFiles);
});

// 게시글 등록
app.post('/post/create',(req:Request,res:Response)=>{
  const {token} = req.cookies;
  const {title,addedLinkPhotos,description,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userDataCallback) => {
    const userData = userDataCallback as UserDataType
    if (err) throw err;
    const postDoc = await Post.create({
      author:userData.id,
      title,photos:addedLinkPhotos,description,
    })
    res.json({postDoc,addedLinkPhotos})
  });
})

// post 수정
app.put('/post/update',async (req,res)=>{
  const {token} = req.cookies;
  const {postId,title,addedLinkPhotos,description,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userDataCallback) => {
    const userData = userDataCallback as UserDataType
    if(err) throw err;
    const postDoc = await Post.findById(postId)
    if(postDoc){
      if(postDoc.author){
        if(userData.id === postDoc.author.toString()){
          postDoc.set({
            title,photos:addedLinkPhotos,description,
          })
          await postDoc.save();
          res.json(postDoc)
        }
      }
    }
  });  
})




// 로그인 유저가 등록한 post 찾기
app.get('/user-posts', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userDataCallback) => {
    if(err) throw err;
    const userData = userDataCallback as UserDataType
    const {id} = userData;
    const userPostList = await Post.find({author:id}) 
    
    res.json(userPostList);
  });
});

// id값으로 post 찾기
app.get('/post/:id',async (req,res)=>{
  const {id} = req.params;
  res.json(await Post.findById(id))
})

// 메인페이지 post 전체 찾기
app.get('/posts',async (req,res)=>{
  res.json(await Post.find()) 
})

app.listen(4000)
