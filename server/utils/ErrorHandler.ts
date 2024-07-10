class ErrorHandler extends Error {
    statusCode:number
  constructor(message:any, statusCode:number) {
    super(message); //super is used to call the constructor
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);

  }
}
export default ErrorHandler;
