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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const bcryptSalt = bcryptjs_1.default.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
app.use(express_1.default.json());
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
app.listen(4000);
