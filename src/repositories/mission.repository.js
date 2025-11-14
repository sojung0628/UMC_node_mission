import { prisma } from "../configs/db.config.js";
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from "../utils/errors.js";

export const addMission = async (data, user) => {
    try {
        const store = await prisma.store.findFirst({
            where: {
                id: data.storeId,
                ownerId: user.id,
            },
            select: { id: true },
        });

        if (!store) {
            throw new ForbiddenError("해당 가게에 대한 권한이 없습니다.");
        }

        const mission = await prisma.mission.create({
            data: {
                store: {
                    connect: { id: data.storeId },
                },
                content: data.content,
                point: data.point,
            },
            select: { id: true },
        });

        return mission.id;
    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new BadRequestError("미션 생성에 실패했습니다. 입력값을 확인해주세요.", {
            details: err.message,
        });
    }
};

export const startMission = async (data, user) => {
    try {
        const assignment = await prisma.userMission.findFirst({
            where: {
                userId: user.id,
                missionId: data.missionId,
                isProgress: false,
            },
            select: { id: true },
        });

        if (!assignment) {
            throw new NotFoundError("요청한 미션 할당 정보를 찾을 수 없습니다.");
        }

        const updated = await prisma.userMission.update({
            where: { id: assignment.id },
            data: {
                isProgress: true,
                startAt: new Date(),
            },
            select: { id: true },
        });

        return updated.id;
    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new BadRequestError("미션 도전에 실패했습니다. 입력값을 확인해주세요.", {
            details: err.message,
        });
    }
};

export const getMissionsByStore = async (storeId, cursor) => {
    const safeCursor = typeof cursor === "number" && cursor > 0 ? cursor : 0;

    const missions = await prisma.mission.findMany({
        select: {
            id: true,
            content: true,
            point: true,
            assignments: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    isProgress: true,
                },
            },
        },
        where: {
            storeId,
            ...(safeCursor > 0 ? { id: { gt: safeCursor } } : {}),
        },
        orderBy: { id: "asc" },
        take: 5,
    });

    return missions;
};

export const getActiveMissionsByUser = async (userId, cursor) => {
    const safeCursor = typeof cursor === "number" && cursor > 0 ? cursor : 0;

    const assignments = await prisma.userMission.findMany({
        select: {
            id: true,
            startAt: true,
            mission: {
                select: {
                    id: true,
                    content: true,
                    point: true,
                    store: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        where: {
            userId,
            isProgress: true,
            ...(safeCursor > 0 ? { id: { gt: safeCursor } } : {}),
        },
        orderBy: { id: "asc" },
        take: 5,
    });

    return assignments;
};

export const completeMissionAssignment = async (assignmentId, userId) => {
    const assignment = await prisma.userMission.findFirst({
        where: {
            id: assignmentId,
            userId,
            isProgress: true,
        },
        select: { id: true },
    });

    if (!assignment) {
        throw new NotFoundError("진행 중인 미션을 찾을 수 없습니다.");
    }

    const updated = await prisma.userMission.update({
        where: { id: assignment.id },
        data: {
            isProgress: false,
            startAt: null,
        },
        select: { id: true },
    });

    return updated.id;
};
