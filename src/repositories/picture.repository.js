import { pool } from "../configs/db.config.js";

export const addImages = async (images) => {
    const conn = await pool.getConnection();

    try {
        var result = [];
        for(const url of images) {
            const [temp] = await conn.query(
                `INSERT INTO PICTURE (url) VALUE (?);`,
                [url]
            );
            result.push(temp.insertId);
        }

        return result;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};