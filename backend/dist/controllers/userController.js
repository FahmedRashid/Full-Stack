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
exports.signupUser = exports.loginUser = exports.deleteUser = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); //we will be needing --> npm install --save-dev @types/jsonwebtoken --> This is to create a token for user creds
const mongoose_1 = __importDefault(require("mongoose"));
const createToken = (_id) => {
    const secret = process.env.SECRET;
    if (!secret) {
        throw new Error("JWT secret is not defined in the enviornment verifables");
    }
    return jsonwebtoken_1.default.sign({ _id: _id }, secret, { expiresIn: "3d" });
};
// get user
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.find({}).sort({ createdAt: -1 });
    res.status(200).json(user);
});
exports.getUser = getUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return;
        }
        const user = yield userModel_1.default.findOneAndDelete({ _id: id });
        if (!user) {
            res.status(400).json({ error: "No User Found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
// login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.login(email, password);
        // create a token
        const token = createToken(user._id);
        res.status(200).json({
            email: user.email,
            firstName: user.firstName,
            token
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred." });
        }
    }
});
exports.loginUser = loginUser;
// signup user
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, birthDate, confirmPassword, email, password } = req.body;
    try {
        const user = yield userModel_1.default.signup(firstName, lastName, birthDate, email, password, confirmPassword);
        // create a token
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred." });
        }
    }
});
exports.signupUser = signupUser;
