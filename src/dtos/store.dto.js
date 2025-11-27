import { BadRequestError } from "../utils/errors.js";

export const bodyToStore = (body = {}) => {
  if (!body.store) {
    throw new BadRequestError("store 정보를 포함해주세요.");
  }

  const { name, time, address } = body.store;

  if (!name || !time || !address) {
    throw new BadRequestError("가게 이름, 영업시간, 주소는 필수입니다.");
  }

  if (!body.region) {
    throw new BadRequestError("region 값이 필요합니다.");
  }

  return {
    name,
    time,
    address,
    region: body.region,
  };
};

export const responseFromReviews = (reviews) => {
    return {
        reviews: reviews.map((review) => ({
            id: review.id,
            content: review.content,
            score: review.score,
            store: review.store,
            user: review.user,
        })),
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id : null,
        },
    };
};
