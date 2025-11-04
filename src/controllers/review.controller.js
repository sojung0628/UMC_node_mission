import { StatusCodes } from "http-status-codes";
import { reviewAppend } from "../services/review.service.js";
import { getUser } from "../repositories/user.repository.js";

export const handlerReviewAppend = async(req, res, next) => {
    console.log("[POST] 가게에 리뷰 추가하기");

    const user = await getUser(req.get('Authorization').split('-')[4]);
    console.log("요청자 ID: " + user.id);
    console.log("body:", req.body);

    const reviewId = await reviewAppend(req.body, user);
    res.status(StatusCodes.OK).json({
        success: true,
        code: StatusCodes.OK,
        message: "리뷰 작성이 완료되었습니다.",
        data: {
            reviewId: reviewId
        }
    });
};