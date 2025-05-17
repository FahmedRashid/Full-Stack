"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//controller functions
const userController_1 = require("../controllers/userController");
const userRouter = express_1.default.Router();
// get all users
userRouter.get("/", userController_1.getUser);
// delete a user 
userRouter.delete("/:id", userController_1.deleteUser);
//login route
userRouter.post("/login", userController_1.loginUser);
//logout route
userRouter.post("/signup", userController_1.signupUser);
exports.default = userRouter;
