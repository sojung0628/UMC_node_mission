import jwt from "jsonwebtoken";
import { prisma } from "../configs/db.config.js";
import { asyncHandler } from "../utils/async-handler.js";
import { UnauthorizedError } from "../utils/errors.js";

// JWT 보호 미들웨어: Bearer 문자열이 중복되거나 공백이 섞여 있어도 마지막 토큰을 사용
export const requireAuth = asyncHandler(async (req, res, next) => {
  const raw = (req.get("Authorization") ?? "").trim();

  // Authorization 헤더 값에서 마지막 토큰만 추출 (예: "Bearer Bearer <token>"도 처리)
  const parts = raw.split(/\s+/).filter(Boolean);
  const token = parts.length > 1 ? parts[parts.length - 1] : parts[0];

  if (!token) {
    throw new UnauthorizedError("Authorization 헤더가 필요합니다.");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new UnauthorizedError("서버 JWT 설정이 되어 있지 않습니다.");
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    throw new UnauthorizedError("유효하지 않은 토큰입니다.");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    throw new UnauthorizedError("사용자 정보를 찾을 수 없습니다.");
  }

  req.user = user;
  next();
});
