import { prisma } from "../configs/db.config.js";
import { BadRequestError } from "../utils/errors.js";

export const addStore = async (data) => {
  try {
    const store = await prisma.store.create({
      data: {
        name: data.name,
        time: data.time,
        address: data.address,
        region: data.region,
        owner: {
          connect: { id: data.owner },
        },
      },
      select: { id: true },
    });

    return store.id;
  } catch (err) {
    if (err instanceof BadRequestError) {
      throw err;
    }

    throw new BadRequestError("가게 생성에 실패했습니다. 입력값을 확인해주세요.", {
      details: err.message,
    });
  }
};

export const getAllStoreReviews = async (storeId, cursor) => {
    const where = {
        storeId,
        ...(cursor > 0 ? { id: { gt: cursor } } : {}),
    };

    const reviews = await prisma.userStoreReview.findMany({
        select: {
            id: true,
            content: true,
            score: true,
            store: {
                select: {
                    id: true,
                    name: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        where,
        orderBy: { id: "asc" },
        take: 5,
    });

    return reviews;
};
