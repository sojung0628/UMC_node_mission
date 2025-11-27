import { completeActiveMission, listActiveMissions, missionStart } from "../services/mission.service.js";
import { getUser } from "../repositories/user.repository.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import { BadRequestError } from "../utils/errors.js";

const parseCursor = (rawCursor) => {
    if (typeof rawCursor === "undefined" || rawCursor === "") {
        return undefined;
    }

    const parsed = Number.parseInt(rawCursor, 10);
    if (Number.isNaN(parsed)) {
        throw new BadRequestError("커서 값이 유효하지 않습니다.");
    }

    return parsed;
};

const parseAssignmentId = (assignmentIdRaw) => {
    const assignmentId = Number.parseInt(assignmentIdRaw, 10);
    if (Number.isNaN(assignmentId)) {
        throw new BadRequestError("미션 매핑 ID가 유효하지 않습니다.");
    }

    return assignmentId;
};

export const handlerMissionChallenge = asyncHandler(async (req, res) => {
    const user = await getUser(req.user.id);
    const mapping = await missionStart(req.body, user);

    sendSuccess(res, {
        message: "미션 도전이 등록되었습니다.",
        data: { mappingId: mapping },
    });
});

export const handlerListActiveMissions = asyncHandler(async (req, res) => {
    const cursor = parseCursor(req.query.cursor);
    const { missions, pagination } = await listActiveMissions(req.user.id, cursor);

    sendSuccess(res, {
        message: "진행 중인 미션 목록 조회에 성공했습니다.",
        data: missions,
        pagination,
    });
});

export const handlerCompleteMission = asyncHandler(async (req, res) => {
    const assignmentId = parseAssignmentId(req.params.assignmentId);
    const completedId = await completeActiveMission(assignmentId, req.user.id);

    sendSuccess(res, {
        message: "미션이 완료 처리되었습니다.",
        data: { assignmentId: completedId },
    });
});
