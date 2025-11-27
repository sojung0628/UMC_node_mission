import { prisma } from "../configs/db.config.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";


// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (user) {
    throw new ConflictError("이미 존재하는 이메일입니다.");
  }

  const created = await prisma.user.create({ data });
  return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    return user;
  } catch (err) {
    throw new NotFoundError("사용자를 찾을 수 없습니다.", { details: err.message });
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.userFavorCategory.findMany({
    select: {
      id: true,
      userId: true,
      foodCategoryId: true,
      foodCategory: true,
    },
    where: { userId: userId },
    orderBy: { foodCategoryId: "asc" },
  });

  return preferences;
};
