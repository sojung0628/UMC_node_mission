import {
    addMission,
    startMission
} from "../repositories/mission.repository.js";

export const missionAppend = async (data, user) => {
    const missionId = await addMission(data, user);
    return missionId;
}

export const missionStart = async (data, user) => {
    const mappingId = await startMission(data, user);
    return mappingId;
}