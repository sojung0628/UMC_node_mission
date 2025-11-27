import { prisma } from "../configs/db.config.js";
import { AppError, BadRequestError, NotFoundError } from "../utils/errors.js";

export const addReview = async (data, user) => {
    try {
        const store = await prisma.store.findUnique({
            where: { id: data.storeId },
            select: { id: true },
        });

        if (!store) {
            throw new NotFoundError("요청한 가게를 찾을 수 없습니다.");
        }

        const numericScore = Number.isInteger(data.score)
            ? data.score
            : Number.parseInt(data.score, 10);

        if (Number.isNaN(numericScore)) {
            throw new BadRequestError("리뷰 점수가 유효하지 않습니다.");
        }

        const review = await prisma.userStoreReview.create({
            data: {
                store: { connect: { id: data.storeId } },
                user: { connect: { id: user.id } },
                content: data.text,
                score: numericScore,
            },
            select: { id: true },
        });

        return review.id;
    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new BadRequestError("리뷰 작성에 실패했습니다. 입력값을 확인해주세요.", {
            details: err.message,
        });
    }
};

export const getReviewsByUser = async (userId, cursor) => {
    const safeCursor = typeof cursor === "number" && cursor > 0 ? cursor : 0;

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
        where: {
            userId,
            ...(safeCursor > 0 ? { id: { gt: safeCursor } } : {}),
        },
        orderBy: { id: "asc" },
        take: 5,
    });

    return reviews;
};
