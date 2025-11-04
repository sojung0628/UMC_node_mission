import { addReview } from "../repositories/review.repository.js";
import { addImages } from "../repositories/picture.repository.js";
import { mappingReviewAndImages } from "../repositories/mapping/reviewPicture.repository.js";

export const reviewAppend = async (data, user) => {
    const reviewId = await addReview(data, user)
    const imageIds = await addImages(data.images)

    await mappingReviewAndImages(reviewId, imageIds);

    return reviewId;
};