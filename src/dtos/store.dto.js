export const bodyToStore = (body) => {
    return {
        name: body.store.name,
        time: body.store.time,
        address: body.store.address,
        region: body.region
    };
};