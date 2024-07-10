import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
module.exports = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";
  //wrong mongoDB Id
  if (err.name === "CastError") {
    const message = `Resource not found. invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //for duplication
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //for wrong jwt error
  if (err.name === "JsonwebTokenError") {
    const message = "jsonwebtoken is invalid, try again",
      err = new ErrorHandler(message, 400);
  }

  //for jwt expires
  if (err.name === "TokenExpiredError") {
    const message = "jsonwebtoken is expired, try again",
      err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success:false,
    message:err.message
  })

};
