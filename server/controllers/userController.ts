import ejs from "ejs";
import {
  IActivationRequest,
  IActivationToken,
  ILoginRequest,
  IRegistrationBody,
  IUser,
} from "./../@types/user";
import UserModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import path from "path";
import sendMail from "../utils/sendMail";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { sendToken } from "../utils/jwt";
require("dotenv").config();
//register
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate Your Account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(200).json({
          success: true,
          message: `please check your email:${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};

//activate user

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        activation_token,
        activation_code,
      } = req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await UserModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("user already exist", 400));
      }
      const user = await UserModel.create({
        name,
        email,
        password,
      });

      res.status(200).json({
        success: true,
        user
      });
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);


//login features
export const loginUser=CatchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const {email,password}=req.body as ILoginRequest
    if(!email || !password){
      return next(new ErrorHandler("please enter email and password", 400))
    }
    const user=await UserModel.findOne({email}).select("+password"); //include password as well
    if(!user){
      return next(new ErrorHandler("invalid email or password", 400))
    }
    const isPasswordMatch=await user.comparePassword(password);
    if(!isPasswordMatch){
      return next(new ErrorHandler("Invalid email or password", 400))
    }
    sendToken(user,200,res);
    

    
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 404));
    
  }
})

//logout features 
