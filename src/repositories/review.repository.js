import { pool } from "../configs/db.config.js";

export const addReview = async (data, user) => {
    const conn = await pool.getConnection();

    try {
        //예외 처리
        const [confirm] = await conn.query(
            `SELECT EXISTS(SELECT 1 FROM \`store\` WHERE id = ?) as isExistStore;`,
            [data.storeId]
        );
        if (confirm[0].isExistEmail) return null;

        //데이터 추가
        const [result] = await conn.query(
            `INSERT INTO REVIEW (store, reviewer, score, content) VALUE (?, ?, ?, ?);`,
            [
                data.storeId,
                user.id,
                data.score,
                data.text
            ]
        )

        return result.insertId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};