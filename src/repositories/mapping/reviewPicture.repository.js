import { pool } from "../../configs/db.config.js";

export const mappingReviewAndImages = async (reviewId, images) => {
    const conn = await pool.getConnection();

    try {
        for(const image of images) {
            await conn.query(
                `INSERT INTO REVIEWPICTURE (review, picture) VALUE (?, ?);`,
                [ reviewId, image ]
            );
        }
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};