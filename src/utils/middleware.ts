import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from "express";
import CustomError from "./custom_error.js";

const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if the response headers have already been sent
  if (res.headersSent) {
    return next(err); // Delegate to the default Express error handler
  }

  // Handle operational errors (CustomError)
  if (err.isOperational) {
    console.log("Operational Error:", err.statusCode, err.message);
    res.status(err.statusCode).json({
      statusText: err.statusText,
      status: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Log non-operational or unknown errors for debugging
  console.error("An unexpected error occurred:", err);

  // Send a generic error response
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
export{errorHandler}