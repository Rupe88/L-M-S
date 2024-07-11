import express, { NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { ErrorMiddleware } from "./middleware/error";
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

app.use(ErrorMiddleware);

export default app;
