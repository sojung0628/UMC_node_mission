import { responseFromReviews } from "../dtos/store.dto.js";
import { addReview, getReviewsByUser } from "../repositories/review.repository.js";
import { addImages } from "../repositories/picture.repository.js";
import { mappingReviewAndImages } from "../repositories/mapping/reviewPicture.repository.js";

export const reviewAppend = async (data, user) => {
    const reviewId = await addReview(data, user)
    const imageIds = await addImages(data.images)

    await mappingReviewAndImages(reviewId, imageIds);

    return reviewId;
};

export const listUserReviews = async (userId, cursor) => {
    const reviews = await getReviewsByUser(userId, cursor);
    return responseFromReviews(reviews);
};
