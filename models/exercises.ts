import db from '../db/connection';

/**
 * Get all the exercises
 *
 * @returns all exercises
 */
export const getAllExercises = async (): Promise<any[]> => {
	const [exercises]: any = await db.query(
		'SElECT * FROM exercise ORDER BY name'
	);
	return exercises;
};

/**
 * Get best reps, exercise_volume and pr per workout for an exercise
 *
 * @param exerciseId The id of the exercise you want the info of
 * @param userId The id of the use the workouts belong to
 * @returns stats
 */
const getExerciseStat = async (
	exerciseId: number,
	userId: string
): Promise<Stat> => {
	// get the raw stat data
	const [rawStats]: any = await db.query(
		`
        SELECT MAX(E.id) as id, MAX(E.name) AS name, DATE_FORMAT(MAX(date), "%d-%m-%Y") as date, MAX(S.reps) AS most_reps, SUM(S.reps * IF(S.weight, S.weight, 1)) AS exercise_volume, MAX(S.weight) AS pr, MAX(PS.id) AS pinned_stat
        FROM workout AS W
        INNER JOIN \`set\` AS S
        ON S.workout_id = W.id
        INNER JOIN exercise AS E
        ON S.exercise_id = E.id
        LEFT JOIN pinned_stat AS PS
        ON E.id = PS.exercise_id
        WHERE S.exercise_id = ? AND W.user_id = ?
        GROUP BY W.id
        ORDER BY date
    `,
		[exerciseId, userId]
	);

	// construct a stat
	const stat: Stat = {
		id: rawStats[0].id,
		name: rawStats[0].name,
		pinned: rawStats[0].pinned_stat !== null,
		dates: [],
		reps: [],
		volumes: [],
		prs: [],
	};

	// format the raw stat data into the clean constructed stat object
	rawStats.forEach((rawStat: any) => {
		stat.dates.push(rawStat.date);
		stat.reps.push(rawStat.most_reps);
		stat.volumes.push(rawStat.exercise_volume);
		stat.prs.push(rawStat.pr);
	});

	return stat;
};

/**
 * Get stats for all done exercises
 *
 * @param userId the id of the user you want the stats from
 * @returns A list of exercise stats
 */
export const getAllExerciseStats = async (userId: string): Promise<Stat[]> => {
	const [exercises]: any = await db.query(
		`
        SELECT DISTINCT S.exercise_id, E.name, PS.id
        FROM workout AS W
        INNER JOIN \`set\` AS S
        ON S.workout_id = W.id
        INNER JOIN \`exercise\` AS E
        ON S.exercise_id = E.id
        LEFT JOIN \`pinned_stat\` AS PS
        ON S.exercise_id = PS.exercise_id AND PS.user_id = ?
        WHERE W.user_id = ?
        ORDER BY E.name ASC
    `,
		[userId, userId]
	);

	const stats: Stat[] = [];

	for await (const exercise of exercises) {
		const stat = await getExerciseStat(exercise.exercise_id, userId);
		stats.push(stat);
	}

	return stats;
};

/**
 * Get stats for all pinned exercises
 *
 * @param userId the id of the user you want the stats from
 * @returns A list of pinned exercise stats
 */
export const getAllPinnedExerciseStats = async (
	userId: string
): Promise<Stat[]> => {
	const [exercises]: any = await db.query(
		`
        SELECT DISTINCT S.exercise_id, E.name, PS.id
        FROM workout AS W
        INNER JOIN \`set\` AS S
        ON S.workout_id = W.id
        INNER JOIN \`exercise\` AS E
        ON S.exercise_id = E.id
        INNER JOIN \`pinned_stat\` AS PS
        ON S.exercise_id = PS.exercise_id AND PS.user_id = ?
        WHERE W.user_id = ?
        ORDER BY E.name ASC
    `,
		[userId, userId]
	);

	const stats: Stat[] = [];

	for await (const exercise of exercises) {
		const stat = await getExerciseStat(exercise.exercise_id, userId);
		stats.push(stat);
	}

	return stats;
};

/**
 * Add or remove a pinned stat based on it's current state
 *
 * @param isPinned the current pin state
 * @param exerciseId the exercise of this stat
 * @param userId the user of to whom this stat belongs to
 * @returns true if the status succesfully changed
 */
export const changePin = async (
	isPinned: boolean,
	exerciseId: string,
	userId: string
) => {
	try {
		// if not pinned than create a pin for it remove the pin otherwise
		if (isPinned === false) {
			await db.execute(
				`INSERT INTO pinned_stat ( exercise_id, user_id ) VALUES ( ?, ? )`,
				[exerciseId, userId]
			);
		} else {
			await db.execute(
				`DELETE FROM pinned_stat WHERE exercise_id = ? AND user_id = ?`,
				[exerciseId, userId]
			);
		}

		return true;
	} catch (error) {
		return false;
	}
};
