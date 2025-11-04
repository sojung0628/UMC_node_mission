import { pool } from "../configs/db.config.js";

export const addMission = async (data, user) => {
    const conn = await pool.getConnection();

    try {
        const [confirm] = await conn.query(
            `SELECT EXISTS(SELECT 1 FROM STORE WHERE owner = ? AND id = ?) as isExistStore;`,
            [user.id, data.storeId]
        );
        if(!confirm[0].isExistStore) throw new Error(`해당하는 가게가 없습니다.`)

        const [result] = await conn.query(
            `INSERT INTO MISSION (store, content, point) VALUE (?, ?, ?);`,
            [
                data.storeId,
                data.content,
                data.point
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
}

export const startMission = async (data, user) => {
    const conn = await pool.getConnection();

    try {
        const [confirm] = await conn.query(
            `SELECT EXISTS(SELECT 1 FROM \`USER-MISSION\` WHERE user = ? AND mission = ? AND isProgress = 0) as isConfirm`,
            [
                user.id,
                data.missionId
            ]
        )
        if(!confirm[0].isConfirm) throw new Error(`해당하는 미션이 적절하지 않습니다.`);

        await conn.query(
            `UPDATE \`USER-MISSION\` SET isProgress = 1, start_at = ? WHERE user = ? AND mission = ?`,
            [
                new Date(),
                user.id,
                data.missionId
            ]
        )

        const [result] = await conn.query(
            `SELECT id FROM \`USER-MISSION\` WHERE user = ? AND mission = ?`,
            [
                user.id,
                data.missionId
            ]
        )
        return result[0].id

    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
}