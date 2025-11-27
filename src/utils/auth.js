import { BadRequestError, UnauthorizedError } from "./errors.js";

export const extractUserIdFromAuth = (req) => {
  const authHeader = req.get("Authorization") ?? "";

  if (!authHeader.trim()) {
    throw new UnauthorizedError("Authorization 헤더가 필요합니다.");
  }

  const match = authHeader.match(/user-(\d+)$/);

  if (!match) {
    throw new BadRequestError("Authorization 헤더 형식이 올바르지 않습니다.");
  }

  const userId = Number.parseInt(match[1], 10);

  if (Number.isNaN(userId)) {
    throw new BadRequestError("Authorization 헤더에서 사용자 ID를 추출할 수 없습니다.");
  }

  return userId;
};
