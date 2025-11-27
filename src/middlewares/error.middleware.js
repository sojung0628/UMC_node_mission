import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/errors.js";

const isProduction = process.env.NODE_ENV === "production";

export const errorHandler = (err, req, res, next) => {
  const error = err instanceof AppError
    ? err
    : new AppError(
        isProduction ? "Internal Server Error" : err.message,
        err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
        {
          details: isProduction ? undefined : err.stack,
          isOperational: false,
        },
      );

  if (!isProduction && !(err instanceof AppError)) {
    console.error(err);
  }

  const response = {
    success: false,
    code: error.code ?? error.statusCode,
    message: error.message,
  };

  if (error.details && !isProduction) {
    response.details = error.details;
  }

  res.status(error.statusCode).json(response);
};
