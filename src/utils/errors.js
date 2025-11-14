import { StatusCodes, getReasonPhrase } from "http-status-codes";

export class AppError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, options = {}) {
    super(message ?? getReasonPhrase(statusCode));
    this.name = options.name ?? new.target.name;
    this.statusCode = statusCode;
    this.code = options.code ?? statusCode;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "잘못된 요청입니다.", options = {}) {
    super(message, StatusCodes.BAD_REQUEST, options);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "인증이 필요합니다.", options = {}) {
    super(message, StatusCodes.UNAUTHORIZED, options);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "요청에 대한 권한이 없습니다.", options = {}) {
    super(message, StatusCodes.FORBIDDEN, options);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.", options = {}) {
    super(message, StatusCodes.NOT_FOUND, options);
  }
}

export class ConflictError extends AppError {
  constructor(message = "요청이 이미 존재하거나 충돌합니다.", options = {}) {
    super(message, StatusCodes.CONFLICT, options);
  }
}
