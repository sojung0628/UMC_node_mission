import { pool } from "../configs/db.config.js";

export const addStore = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query(
            `INSERT INTO STORE (name, time, address, owner, region) VALUES (?, ?, ?, ?, ?);`,
            [
                data.name,
                data.time,
                data.address,
                data.owner,
                data.region
            ]
        );

        return result.insertId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
}