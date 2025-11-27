export const responseFromStoreMissions = (missions) => {
    return {
        missions: missions.map((mission) => ({
            id: mission.id,
            content: mission.content,
            point: mission.point,
            assignmentCount: mission.assignments.length,
            assignees: mission.assignments.map((assignment) => ({
                id: assignment.id,
                user: assignment.user,
                isProgress: assignment.isProgress,
            })),
        })),
        pagination: {
            cursor: missions.length ? missions[missions.length - 1].id : null,
        },
    };
};

export const responseFromActiveMissions = (assignments) => {
    return {
        missions: assignments.map((assignment) => ({
            assignmentId: assignment.id,
            mission: {
                id: assignment.mission.id,
                content: assignment.mission.content,
                point: assignment.mission.point,
            },
            store: assignment.mission.store,
            startedAt: assignment.startAt,
            inProgress: true,
        })),
        pagination: {
            cursor: assignments.length ? assignments[assignments.length - 1].id : null,
        },
    };
};
