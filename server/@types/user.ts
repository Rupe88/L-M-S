import { Document } from "mongoose";
export interface IUser extends Document {
  _id:string;
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string; //cloudinary
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

export interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IActivationToken {
  token: string;
  activationCode: string;
}

export interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ITokenOptions{
    expires:Date;
    maxAge:number;
    httpOnly:boolean;
    sameSite:'lax' | 'strict' |undefined;
    secure?:boolean;

}


