import express, { Request, Response, Router } from "express";

//controller functions
import { loginUser, signupUser, getUser, deleteUser } from "../controllers/userController";

const userRouter: Router = express.Router();

// get all users
userRouter.get("/", getUser);

// delete a user 
userRouter.delete("/:id", deleteUser)

//login route
userRouter.post("/login", loginUser);

//logout route
userRouter.post("/signup", signupUser);

export default userRouter;
