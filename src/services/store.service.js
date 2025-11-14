import { responseFromReviews } from "../dtos/store.dto.js";
import { addStore, getAllStoreReviews } from "../repositories/store.repository.js";

export const storeAppend = async (data, user) => {
    const storeId = await addStore({
        name: data.name,
        time: data.time,
        address: data.address,
        owner: user.id,
        region: data.region
    });

    return storeId;
};

export const listStoreReviews = async (storeId, cursor) => {
    const safeCursor = typeof cursor === "number" && cursor > 0 ? cursor : 0;
    const reviews = await getAllStoreReviews(storeId, safeCursor);

    return responseFromReviews(reviews);
};
