import { listUserReviews, reviewAppend } from "../services/review.service.js";
import { getUser } from "../repositories/user.repository.js";
import { asyncHandler } from "../utils/async-handler.js";
import { extractUserIdFromAuth } from "../utils/auth.js";
import { sendSuccess } from "../utils/response.js";
import { BadRequestError } from "../utils/errors.js";

const parseCursor = (cursorRaw) => {
    if (typeof cursorRaw === "undefined" || cursorRaw === "") {
        return undefined;
    }

    const parsed = Number.parseInt(cursorRaw, 10);
    if (Number.isNaN(parsed)) {
        throw new BadRequestError("커서 값이 유효하지 않습니다.");
    }

    return parsed;
};

export const handlerReviewAppend = asyncHandler(async (req, res) => {
    const userId = extractUserIdFromAuth(req);
    const user = await getUser(userId);
    const reviewId = await reviewAppend(req.body, user);

    sendSuccess(res, {
        message: "리뷰 작성이 완료되었습니다.",
        data: { reviewId },
    });
});

export const handlerListMyReviews = asyncHandler(async (req, res) => {
    const userId = extractUserIdFromAuth(req);
    const cursor = parseCursor(req.query.cursor);
    const { reviews, pagination } = await listUserReviews(userId, cursor);

    sendSuccess(res, {
        message: "내 리뷰 목록 조회에 성공했습니다.",
        data: reviews,
        pagination,
    });
});
