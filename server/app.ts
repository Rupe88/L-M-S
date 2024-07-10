import express, { NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
const app = express();
require("dotenv").config();

//middleware
app.use(express.json());
app.use(express.json({ limit: "50mb" })); //important for cloudinary
app.use(cookieParser());

//cors =>cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
    // methods:["put","post","patch","get"],
    // credentials:true
  })
);
//testing api
app.get("/test", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "k xa vai",
  });
});

//for unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

export default app;
