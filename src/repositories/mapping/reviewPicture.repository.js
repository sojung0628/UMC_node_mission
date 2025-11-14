import { prisma } from "../../configs/db.config.js";

export const mappingReviewAndImages = async (reviewId, imageIds) => {
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
        return;
    }

    await prisma.reviewPicture.createMany({
        data: imageIds.map((pictureId) => ({
            reviewId,
            pictureId,
        })),
    });
};
