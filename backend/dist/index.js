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
// 회원가입
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const userDoc = yield User_1.default.create({
            name,
            email,
            password: bcryptjs_1.default.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }
    catch (e) {
        res.status(422).json(e);
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
            res.status(422).json('pass not ok');
        }
    }
    else {
        res.json('not found');
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
            res.json({ name, email, _id });
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
// 로그인 유저가 등록한 숙소리스트 찾기
app.get('/user-posts', (req, res) => {
    const { token } = req.cookies;
    jsonwebtoken_1.default.verify(token, jwtSecret, {}, (err, userDataCallback) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = userDataCallback;
        const { id } = userData;
        res.json(yield Post_1.default.find({ owner: id }));
    }));
});
// id값으로 숙소 찾기
app.get('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    res.json(yield Post_1.default.findById(id));
}));
// 메인페이지 숙소리스트 전체 찾기
app.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield Post_1.default.find());
}));
app.listen(4000);
