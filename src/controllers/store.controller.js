import { bodyToStore } from "../dtos/store.dto.js";
import { getUser } from "../repositories/user.repository.js";
import { listStoreReviews, storeAppend } from "../services/store.service.js";
import { listStoreMissions, missionAppend } from "../services/mission.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { extractUserIdFromAuth } from "../utils/auth.js";
import { sendSuccess } from "../utils/response.js";
import { BadRequestError } from "../utils/errors.js";

const parseCursor = (cursorRaw) => {
    if (typeof cursorRaw === "undefined" || cursorRaw === "") {
        return undefined;
    }

    const parsed = Number.parseInt(cursorRaw, 10);
    if (Number.isNaN(parsed)) {
        throw new BadRequestError("커서 값이 유효하지 않습니다.");
    }

    return parsed;
};

const parseStoreId = (storeIdRaw) => {
    const storeId = Number.parseInt(storeIdRaw, 10);
    if (Number.isNaN(storeId)) {
        throw new BadRequestError("가게 ID가 유효하지 않습니다.");
    }

    return storeId;
};

export const handlerStoreAppend = asyncHandler(async (req, res) => {
    const userId = extractUserIdFromAuth(req);
    const user = await getUser(userId);
    const storeId = await storeAppend(bodyToStore(req.body), user);

    sendSuccess(res, {
        message: "가게 추가가 완료되었습니다.",
        data: { storeId },
    });
});

export const handlerMissionAppend = asyncHandler(async (req, res) => {
    const userId = extractUserIdFromAuth(req);
    const user = await getUser(userId);
    const missionId = await missionAppend(req.body, user);

    sendSuccess(res, {
        message: "미션 추가가 완료되었습니다.",
        data: { missionId },
    });
});

export const handlerListStoreReviews = asyncHandler(async (req, res) => {
    const storeId = parseStoreId(req.params.storeId);
    const cursor = parseCursor(req.query.cursor);
    const { reviews, pagination } = await listStoreReviews(storeId, cursor);

    sendSuccess(res, {
        message: "리뷰 목록 조회에 성공했습니다.",
        data: reviews,
        pagination,
    });
});

export const handlerListStoreMissions = asyncHandler(async (req, res) => {
    const storeId = parseStoreId(req.params.storeId);
    const cursor = parseCursor(req.query.cursor);
    const { missions, pagination } = await listStoreMissions(storeId, cursor);

    sendSuccess(res, {
        message: "미션 목록 조회에 성공했습니다.",
        data: missions,
        pagination,
    });
});
