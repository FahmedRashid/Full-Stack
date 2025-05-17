import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken"; //we will be needing --> npm install --save-dev @types/jsonwebtoken --> This is to create a token for user creds
import { createPrivateKey } from "crypto";
import mongoose from "mongoose";

const createToken = (_id: string): string => {
  const secret = process.env.SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined in the enviornment verifables");
  }
  return jwt.sign({ _id: _id }, secret, { expiresIn: "3d" });
};

// get user
export const getUser = async(req: Request, res: Response) =>{
  const user = await User.find({}).sort({ createdAt: -1});
  res.status(200).json(user);
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return;
    }
    const user = await User.findOneAndDelete({ _id: id});
    if(!user){
      res.status(400).json({ error: "No User Found"});
      return;
    }
    res.status(200).json(user)
  } catch(error) {
    next(error);
  }
}

// login user
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id as string);
    res.status(200).json({
       email: user.email,
       firstName: user.firstName,
       token 
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred." });
    }
  }
};

// signup user
export const signupUser = async (req: Request, res: Response) => {
  const { firstName, lastName, birthDate, confirmPassword, email, password } = req.body;
  try {
    const user = await User.signup(firstName, lastName, birthDate, email, password, confirmPassword);

    // create a token
    const token = createToken(user._id as string);
    res.status(200).json({ email, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred." });
    }
  }
};
