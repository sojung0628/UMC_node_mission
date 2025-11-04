import { addStore } from "../repositories/store.repository.js";

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