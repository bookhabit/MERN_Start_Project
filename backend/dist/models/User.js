"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const UserSchema = new mongoose_2.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
