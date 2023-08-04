"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const models_1 = __importDefault(require("./models"));
const User_1 = __importDefault(require("./models/User"));
const Post_1 = __importDefault(require("./models/Post"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const image_downloader_1 = __importDefault(require("image-downloader"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const messages_1 = require("./utils/messages");
dotenv_1.default.config();
const app = (0, express_1.default)();
const bcryptSalt = bcryptjs_1.default.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/uploads/', express_1.default.static(__dirname + '/uploads'));
app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:5173' }));
// 몽고DB 연결
(0, models_1.default)();
// HTTP 라우팅
// 회원가입
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // validation
    const dbEmail = yield User_1.default.findOne({ email: email });
    if ((dbEmail === null || dbEmail === void 0 ? void 0 : dbEmail.email) === email) {
        return res.status(409).json('이미 존재하는 이메일 입니다.');
    }
    else {
        try {
            const userDoc = yield User_1.default.create({
                name,
                email,
                password: bcryptjs_1.default.hashSync(password, bcryptSalt),
            });
            res.status(200).json({ userDoc });
        }
        catch (e) {
            res.status(422);
        }
    }
}));
// 로그인
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userDoc = yield User_1.default.findOne({ email });
    if (userDoc) {
        const passOk = bcryptjs_1.default.compareSync(password, userDoc.password);
        if (passOk) {
            jsonwebtoken_1.default.sign({
                email: userDoc.email,
                id: userDoc._id
            }, jwtSecret, {}, (err, token) => {
                if (err)
                    throw err;
                res.cookie('token', token).json(userDoc);
            });
        }
        else {
            res.status(400).json('비밀번호가 일치하지 않습니다');
        }
    }
    else {
        res.status(404).json('해당 이메일의 유저를 찾을 수 없습니다');
    }
}));
// 깃허브 로그인
app.get('/github/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 깃허브에 accessToken얻기
    const baseUrl = "https://github.com/login/oauth/access_token";
    const body = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code,
    };
    try {
        const { data: requestToken } = yield axios_1.default.post(baseUrl, body, {
            headers: { Accept: "application/json" },
        });
        console.log(requestToken);
        // 2. 깃허브에 있는 user정보 가져오기
        const { access_token } = requestToken; // ③ ~ ④에 해당
        const apiUrl = "https://api.github.com";
        const { data: userdata } = yield axios_1.default.get(`${apiUrl}/user`, {
            headers: { Authorization: `token ${access_token}` },
        });
        console.log(userdata);
        const { data: emailDataArr } = yield axios_1.default.get(`${apiUrl}/user/emails`, {
            headers: { Authorization: `token ${access_token}` },
        });
        const { login: nickname, name } = userdata;
        const { email } = emailDataArr.find((emailObj) => emailObj.primary === true && emailObj.verified === true);
        // 3. 이메일과 일치하는 유저를 DB 찾음
        const dbEmailUser = yield User_1.default.findOne({ email: email });
        console.log('db로찾은 db유저');
        // 4. 이메일과 일치하는 유저인지에 따라 회원가입 또는 로그인
        try {
            if (dbEmailUser && (dbEmailUser === null || dbEmailUser === void 0 ? void 0 : dbEmailUser.email) === email) {
                // 이미 존재하는 이메일이면 바로 로그인시키기
                jsonwebtoken_1.default.sign({
                    email: dbEmailUser.email,
                    id: dbEmailUser._id
                }, jwtSecret, {}, (err, token) => {
                    if (err)
                        throw err;
                    return res.cookie('token', token).status(200).json(dbEmailUser);
                });
            }
            else {
                // 존재하지 않는 이메일이면 회원가입 후 로그인시키기
                const userDoc = yield User_1.default.create({
                    nickName: nickname,
                    name: name,
                    email: email,
                });
                console.log('회원가입할 때 userDoc', userDoc);
                jsonwebtoken_1.default.sign({
                    email: userDoc.email,
                    id: userDoc._id
                }, jwtSecret, {}, (err, token) => {
                    if (err)
                        throw err;
                    return res.cookie('token', token).status(200).json(userDoc);
                });
            }
        }
        catch (e) {
            res.status(422);
        }
    }
    catch (err) {
        console.error(err);
        return res.redirect(500, "/?loginError=서버 에러로 인해 로그인에 실패하였습니다. 잠시 후에 다시 시도해 주세요");
    }
}));
// 구글 로그인
app.get("/google/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    // 토큰을 요청하기 위한 구글 인증 서버 url
    const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
    // access_token, refresh_token 등의 구글 토큰 정보 가져오기
    const tokenData = yield axios_1.default.post(GOOGLE_TOKEN_URL, {
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
    const googleUserData = yield axios_1.default.get(GOOGLE_USERINFO_URL, {
        // Request Header에 Authorization 추가
        headers: {
            Authorization: `Bearer ${tokenData.data.access_token}`,
        },
    });
    // userData로 email db확인 
    const dbEmailUser = yield User_1.default.findOne({ email: googleUserData.data.email });
    try {
        // 해당 email이 db에 있으면 토큰발급 후 로그인
        if (dbEmailUser && (dbEmailUser === null || dbEmailUser === void 0 ? void 0 : dbEmailUser.email) === googleUserData.data.email) {
            jsonwebtoken_1.default.sign({
                email: dbEmailUser.email,
                id: dbEmailUser._id
            }, jwtSecret, {}, (err, token) => {
                if (err)
                    throw err;
                return res.cookie('token', token).status(200).json(dbEmailUser);
            });
        }
        else {
            // 해당 email이 db에 없으면 회원가입시키고 토큰발급
            const userDoc = yield User_1.default.create({
                name: googleUserData.data.name,
                email: googleUserData.data.email,
            });
            jsonwebtoken_1.default.sign({
                email: userDoc.email,
                id: userDoc._id
            }, jwtSecret, {}, (err, token) => {
                if (err)
                    throw err;
                return res.cookie('token', token).status(200).json(userDoc);
            });
        }
    }
    catch (err) {
        res.status(422).json(err);
    }
}));
// 로그아웃
app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});
// 로그인 유지
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jsonwebtoken_1.default.verify(token, jwtSecret, {}, (err, userDataCallback) => __awaiter(void 0, void 0, void 0, function* () {
            const userData = userDataCallback;
            if (err)
                throw err;
            const userDoc = yield User_1.default.findById(userData.id);
            const { name, email, _id } = userDoc;
            res.status(200).json({ name, email, _id });
        }));
    }
    else {
        res.json(null);
    }
});
// REST_API
// input string(이미지주소)으로 이미지업로드
app.post('/upload-by-link', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    const uploadPath = path_1.default.join(__dirname, 'uploads', newName); // 경로 수정
    console.log(uploadPath);
    yield image_downloader_1.default.image({
        url: link,
        dest: uploadPath,
    });
    res.json(newName);
}));
// input file로 파일업로드
const photosMiddleware = (0, multer_1.default)({ dest: path_1.default.join(__dirname, 'uploads') }); // 경로 수정
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadFiles = [];
    if (Array.isArray(req.files)) {
        for (let i = 0; i < req.files.length; i++) {
            console.log(req.files);
            const { path, originalname } = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newName = 'photo' + Date.now() + '.' + ext;
            const uploadPath = path_1.default.join(__dirname, 'uploads', newName); // 경로 수정
            fs_1.default.renameSync(path, uploadPath);
            uploadFiles.push(newName);
        }
    }
    res.json(uploadFiles);
});
// 게시글 등록
app.post('/post/create', (req, res) => {
    const { token } = req.cookies;
    const { title, addedLinkPhotos, description, } = req.body;
    jsonwebtoken_1.default.verify(token, jwtSecret, {}, (err, userDataCallback) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = userDataCallback;
        if (err)
            throw err;
        const postDoc = yield Post_1.default.create({
            author: userData.id,
            title, photos: addedLinkPhotos, description,
        });
        res.json({ postDoc, addedLinkPhotos });
    }));
});
// post 수정
app.put('/post/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    const { postId, title, addedLinkPhotos, description, } = req.body;
    jsonwebtoken_1.default.verify(token, jwtSecret, {}, (err, userDataCallback) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = userDataCallback;
        if (err)
            throw err;
        const postDoc = yield Post_1.default.findById(postId);
        if (postDoc) {
            if (postDoc.author) {
                if (userData.id === postDoc.author.toString()) {
                    postDoc.set({
                        title, photos: addedLinkPhotos, description,
                    });
                    yield postDoc.save();
                    res.json(postDoc);
                }
            }
        }
    }));
}));
// 로그인 유저가 등록한 post 찾기
app.get('/user-posts', (req, res) => {
    const { token } = req.cookies;
    jsonwebtoken_1.default.verify(token, jwtSecret, {}, (err, userDataCallback) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        const userData = userDataCallback;
        const { id } = userData;
        const userPostList = yield Post_1.default.find({ author: id });
        res.json(userPostList);
    }));
});
// id값으로 post 찾기
app.get('/post/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    res.json(yield Post_1.default.findById(id));
}));
// 메인페이지 post 전체 찾기
app.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield Post_1.default.find());
}));
// 채팅기능
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});
// 사용자 데이터를 저장하는 맵
const userMap = new Map();
const testName = '이현진';
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("broadcast", (0, messages_1.formatMessage)(testName, '채팅방에 입장하셨습니다'));
    // 연결된 소켓 사용자 정보 얻기
    const cookies = socket.request.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                // jwt decode
                jsonwebtoken_1.default.verify(token, jwtSecret, {}, (err, userDataCallback) => {
                    if (err)
                        throw err;
                    const userData = userDataCallback;
                    // 사용자 데이터를 맵에 저장
                    userMap.set(socket.id, userData);
                });
            }
        }
    }
    // 클라이언트로부터 데이터 수신 - broadcast
    socket.on("message from client", (message) => {
        // 클라이언트로 데이터 전송
        io.emit("message from server", (0, messages_1.formatMessage)('User', message));
    });
    // 연결해제
    socket.on("disconnect", () => {
        socket.emit('broadcast', (0, messages_1.formatMessage)(testName, '채팅방을 나갔습니다'));
        console.log("A user disconnected");
        userMap.delete(socket.id);
    });
});
const port = 4000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
