import { StatusCodes } from "http-status-codes";

export const createSuccessPayload = ({
  statusCode = StatusCodes.OK,
  message = "요청이 정상적으로 처리되었습니다.",
  data = null,
  pagination,
}) => {
  const payload = {
    success: true,
    code: statusCode,
    message,
    data,
  };

  if (pagination) {
    payload.pagination = pagination;
  }

  return { statusCode, payload };
};

export const sendSuccess = (res, options) => {
  const { statusCode, payload } = createSuccessPayload(options);
  res.status(statusCode).json(payload);
};
