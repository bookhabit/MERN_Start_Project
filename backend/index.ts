
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
import axios  from 'axios';

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
  // validation
  const dbEmail=await User.findOne({email:email})
  if(dbEmail?.email===email){
    return res.status(409).json('이미 존재하는 이메일 입니다.');
  }else{
    try{
      const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
        });
        res.status(200).json({userDoc});
    }catch(e){
      res.status(422)
    }
  }
  }
);

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
  res.status(400).json('비밀번호가 일치하지 않습니다');
}
} else {
res.status(404).json('해당 이메일의 유저를 찾을 수 없습니다');
}
});
// 깃허브 로그인
app.get('/github/login',async (req:Request,res:Response)=> {
  // 1. 깃허브에 accessToken얻기
  const baseUrl = "https://github.com/login/oauth/access_token";
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
  };
  try{
    const { data: requestToken } = await axios.post(baseUrl, body, {
      headers: { Accept: "application/json" },
    });
    console.log(requestToken)
    // 2. 깃허브에 있는 user정보 가져오기
    const { access_token } = requestToken; // ③ ~ ④에 해당

    const apiUrl = "https://api.github.com";
    const { data: userdata } = await axios.get(`${apiUrl}/user`, {
      headers: { Authorization: `token ${access_token}` },
    })
    console.log(userdata)
    const { data: emailDataArr } = await axios.get(`${apiUrl}/user/emails`, {
      headers: { Authorization: `token ${access_token}` },
    }); 
    const { login: nickname,name } = userdata;
    const { email } = emailDataArr.find(
      (emailObj:EmailObjType) => emailObj.primary === true && emailObj.verified === true,
    )
    
    // 3. 이메일과 일치하는 유저를 DB 찾음
    const dbEmailUser = await User.findOne({email:email})
    console.log('db로찾은 db유저')
    // 4. 이메일과 일치하는 유저인지에 따라 회원가입 또는 로그인
      try{
        if(dbEmailUser && dbEmailUser?.email===email){
          // 이미 존재하는 이메일이면 바로 로그인시키기
          jwt.sign({
            email:dbEmailUser.email,
            id:dbEmailUser._id
          }, jwtSecret, {}, (err,token) => {
            if (err) throw err;
            return res.cookie('token', token).status(200).json(dbEmailUser);
          });
        }else{
          // 존재하지 않는 이메일이면 회원가입 후 로그인시키기
          const userDoc = await User.create({
            nickName:nickname,
            name:name,
            email:email,
          })
          console.log('회원가입할 때 userDoc',userDoc)
          jwt.sign({
            email:userDoc.email,
            id:userDoc._id
          }, jwtSecret, {}, (err,token) => {
            if (err) throw err;
            return res.cookie('token', token).status(200).json(userDoc);
          });
        }
      }catch(e){
        res.status(422)
      }
    }catch(err){
      console.error(err);
      return res.redirect(
        500,
        "/?loginError=서버 에러로 인해 로그인에 실패하였습니다. 잠시 후에 다시 시도해 주세요",
      );
    }
  }
)

// 구글 로그인
app.get("/google/login",async (req: Request, res: Response) => {
  const { code } = req.query;
  
  // 토큰을 요청하기 위한 구글 인증 서버 url
  const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

  // access_token, refresh_token 등의 구글 토큰 정보 가져오기
  const tokenData = await axios.post(GOOGLE_TOKEN_URL, {
      // x-www-form-urlencoded(body)
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
  });
  
  // email, google id 등을 가져오기 위한 url
  const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

  // email, google id 등의 사용자 구글 계정 정보 가져오기
  const googleUserData= await axios.get(GOOGLE_USERINFO_URL, {
    // Request Header에 Authorization 추가
    headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  // userData로 email db확인 
  const dbEmailUser = await User.findOne({email:googleUserData.data.email})
  
  try{
    // 해당 email이 db에 있으면 토큰발급 후 로그인
    if(dbEmailUser && dbEmailUser?.email===googleUserData.data.email){
      jwt.sign({
        email:dbEmailUser.email,
        id:dbEmailUser._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        return res.cookie('token', token).status(200).json(dbEmailUser);
      });
    }else{
      // 해당 email이 db에 없으면 회원가입시키고 토큰발급
      const userDoc = await User.create({
        name:googleUserData.data.name,
        email:googleUserData.data.email,
      })
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        return res.cookie('token', token).status(200).json(userDoc);
      });
    }
  }catch(err){
    res.status(422).json(err)
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
      res.status(200).json({name,email,_id});
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
  res.json(newName)
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

// 채팅기능



app.listen(4000)
