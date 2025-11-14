import { prisma } from "../configs/db.config.js";

export const addImages = async (images) => {
    if (!Array.isArray(images) || images.length === 0) {
        return [];
    }

    const createdIds = [];

    for (const url of images) {
        const picture = await prisma.picture.create({
            data: { url },
            select: { id: true },
        });
        createdIds.push(picture.id);
    }

    return createdIds;
};
