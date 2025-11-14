import { BadRequestError, NotFoundError } from "../utils/errors.js";

const REQUIRED_FIELDS = ["email", "password", "name", "gender", "birth", "phoneNumber"];

export const bodyToUser = (body = {}) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) {
      throw new BadRequestError(`${field} 필드를 입력해주세요.`);
    }
  }

  const birth = new Date(body.birth);
  if (Number.isNaN(birth.getTime())) {
    throw new BadRequestError("생년월일 형식이 올바르지 않습니다.");
  }

  if (!Array.isArray(body.preferences) || body.preferences.length === 0) {
    throw new BadRequestError("선호 카테고리를 한 개 이상 선택해주세요.");
  }

  const preferences = body.preferences.map((preference) => {
    const parsed = Number.parseInt(preference, 10);
    if (Number.isNaN(parsed)) {
      throw new BadRequestError("선호 카테고리 값이 올바르지 않습니다.");
    }
    return parsed;
  });

  return {
    email: body.email,
    password: body.password,
    name: body.name,
    gender: body.gender,
    birth,
    address: body.address || "",
    detailAddress: body.detailAddress || "",
    phoneNumber: body.phoneNumber,
    preferences,
  };
};

export const responseFromUser = ({ user, preferences }) => {
  if (!user) {
    throw new NotFoundError("사용자 정보를 찾을 수 없습니다.");
  }

  const preferFoods = (preferences ?? [])
    .map((preference) => preference.foodCategory?.name ?? preference.name)
    .filter(Boolean);

  return {
    access_token: `access-token-for-user-${user.id}`,
    refresh_token: `refresh-token-for-user-${user.id}`,
    profile: {
      email: user.email,
      name: user.name,
      preferCategory: preferFoods,
    },
  };
};
