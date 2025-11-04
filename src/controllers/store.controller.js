import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { getUser } from "../repositories/user.repository.js";
import { storeAppend } from "../services/store.service.js";
import { missionAppend } from "../services/mission.service.js";

export const handlerStoreAppend = async (req, res, next) => {
    console.log("[POST] 특정 지역에 가게 추가하기");

    const user = await getUser(req.get('Authorization').split('-')[4]);
    console.log("요청자 ID: " + user.id);
    console.log("body:", req.body);

    const storeId = await storeAppend(bodyToStore(req.body), user);
    res.status(StatusCodes.OK).json({
        success: true,
        code: StatusCodes.OK,
        message: "가게 추가가 완료되었습니다.",
        data: {
            storeId: storeId
        }
    });
};

export const handlerMissionAppend = async (req, res, next) => {
    console.log("[POST] 가게에 미션 추가하기");

    const user = await getUser(req.get('Authorization').split('-')[4]);
    console.log("요청자 ID: " + user.id);
    console.log("body:", req.body);

    const missionId = await missionAppend(req.body, user);
    res.status(StatusCodes.OK).json({
        success: true,
        code: StatusCodes.OK,
        message: "미션 추가가 완료되었습니다.",
        data: {
            missionId: missionId
        }
    });
}