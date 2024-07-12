
import  ejs  from 'ejs';
import { IActivationToken, IRegistrationBody } from "./../@types/user";
import UserModel from "../models/userModel";
import express,{ Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import path from 'path';
import sendMail from '../utils/sendMail';
require("dotenv").config();

export const registrationUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction):Promise<void> => {
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
      const activationCode=activationToken.activationCode;
      const data={user:{name:user.name}, activationCode}
      const html=await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"),data)

      try {

       await sendMail({
        email:user.email,
        subject:"Activate Your Account",
        template:"activation-mail.ejs",
        data,

       });
       res.status(200).json({
        success:true,
        message:`please check your email:${user.email} to activate your account`,
        activationToken:activationToken.token,

       })
      
        
      } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
      }

      

    } catch (error:any) {
      return next(new ErrorHandler(error.message, 404));
    }
  
  }

);

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() + 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return {token, activationCode}
};
