import db from '../db/connection';

export interface Stat {
    id: number;
	name: string;
	dates: string[];
	reps: number[];
	volumes: string[];
	prs: string[];
}

/**
 * Get all the exercises
 * 
 * @returns all exercises
 */
export const getAllExercises = async (): Promise<any[]> => {
    const [exercises]: any = await db.query('SElECT * FROM exercise');
    return exercises;
}


/**
 * Get best reps, exercise_volume and pr per workout for an exercise
 * 
 * @param exerciseId The id of the exercise you want the info of
 * @param userId The id of the use the workouts belong to
 * @returns stats
 */
export const getAllExerciseStat = async (exerciseId: number, userId: string): Promise<Stat> => {
    // get the raw stat data
    const [rawStats]: any = await db.query(`
        SELECT MAX(E.id) as id, MAX(E.name) AS name, DATE_FORMAT(MAX(date), "%d-%m-%Y") as date, MAX(S.reps) AS most_reps, SUM(S.reps * IF(S.weight, S.weight, 1)) AS exercise_volume, MAX(IF(S.weight != 0, S.weight, S.reps)) AS pr
        FROM workout AS W
        INNER JOIN \`set\` AS S
        ON S.workout_id = W.id
        INNER JOIN exercise AS E
        ON S.exercise_id = E.id
        WHERE S.exercise_id = ? AND W.user_id = ?
        GROUP BY W.id
        ORDER BY date
    `, [exerciseId, userId]);

    // construct a stat
    const stat: Stat = {
        id: rawStats[0].id,
        name: rawStats[0].name,
        dates: [],
        reps: [],
        volumes: [],
        prs: [],
    }

    // format the raw stat data into the clean constructed stat object
    rawStats.forEach((rawStat: any) => {
        stat.dates.push(rawStat.date);
        stat.reps.push(rawStat.most_reps);
        stat.volumes.push(rawStat.exercise_volume);
        stat.prs.push(rawStat.pr);
    });

    return stat;
}