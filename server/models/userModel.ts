import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../@types/user";
require("dotenv").config();
import jwt from "jsonwebtoken";
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter your name"],
    },
    email: {
      type: String,
      required: [true, "enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "PLease enter your password"],
      minlength: [6, "password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

//Hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//SignAccessToken=>when user will login we create Access token
//access_token will expire after short time in 5m
userSchema.methods.SignAccessToken=async function(){
  return jwt.sign({id:this._id}, process.env.ACCESS_TOKEN || '')

}

//sign refresh token
//in this when access token expire our refresh token regenerate new access token 

userSchema.methods.SignRefreshToken=async function(){
  return jwt.sign({id:this._id}, process.env.REFRESH_TOKEN || '')

}

//comapre password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
