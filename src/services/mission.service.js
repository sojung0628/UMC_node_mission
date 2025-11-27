import {
    addMission,
    completeMissionAssignment,
    getActiveMissionsByUser,
    getMissionsByStore,
    startMission
} from "../repositories/mission.repository.js";
import { responseFromActiveMissions, responseFromStoreMissions } from "../dtos/mission.dto.js";

export const missionAppend = async (data, user) => {
    const missionId = await addMission(data, user);
    return missionId;
}

export const missionStart = async (data, user) => {
    const mappingId = await startMission(data, user);
    return mappingId;
}

export const listStoreMissions = async (storeId, cursor) => {
    const missions = await getMissionsByStore(storeId, cursor);
    return responseFromStoreMissions(missions);
};

export const listActiveMissions = async (userId, cursor) => {
    const assignments = await getActiveMissionsByUser(userId, cursor);
    return responseFromActiveMissions(assignments);
};

export const completeActiveMission = async (assignmentId, userId) => {
    const completedId = await completeMissionAssignment(assignmentId, userId);
    return completedId;
};
