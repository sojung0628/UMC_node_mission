import { StatusCodes } from "http-status-codes";
import { missionStart } from "../services/mission.service.js";
import { getUser } from "../repositories/user.repository.js";

export const handlerMissionChallenge = async (req, res, next) => {
    console.log("[POST] 미션 도전하기");
    
        const user = await getUser(req.get('Authorization').split('-')[4]);
        console.log("요청자 ID: " + user.id);
        console.log("body:", req.body);
    
        const mapping = await missionStart(req.body, user);
        res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "미션 추가가 완료되었습니다.",
            data: {
                mappingId: mapping
            }
        });
}