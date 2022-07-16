import db from '../db/connection';

/**
 * Save a workout to the database
 *
 * @param name the name of the workout
 * @param time how long the workout took
 * @param userId to whom the workout belongs to
 * @returns the saved workout
 */
export const saveWorkout = async (
	name: string,
	time: string,
	userId: string
): Promise<any> => {
	const [insertedWorkout]: any = await db.execute(
		'INSERT INTO `workout` ( name, time, user_id ) VALUES( ?, ?, ? )',
		[name, time, userId]
	);

	return insertedWorkout;
};

/**
 * Save tbe set of the given workout to the database
 *
 * @param set A set of the workout
 * @param workoutId The id of the workout this set belongs to
 */
export const saveSet = async (set: any, workoutId: string): Promise<void> => {
	await db.execute(
		'INSERT INTO `set` ( reps, weight, exercise_id, workout_id ) VALUES( ?, ?, ?, ? )',
		[set.reps, set.weight, set.exerciseId, workoutId]
	);
};

/**
 * Get the given amount of most recent completed workouts of the user
 *
 * @param rows The limit of rows you want from the history
 * @param userId The id user you want to get his history from
 * @returns The history of the workouts completed
 */
export const getWorkoutHistory = async (
	rows: number,
	userId: string
): Promise<any[]> => {
	// get the *rows* amount of recent workouts
	const [workouts]: any = await db.query(
		`
		SELECT W.id, W.name, DATE_FORMAT(W.date, "%d-%m-%Y") AS date, HOUR(W.time) as time_hour, MINUTE(W.time) as time_minute
		FROM workout AS W
		WHERE user_id = ?
		ORDER BY W.id DESC
		LIMIT ?;
		`,
		[userId, rows]
	);

	// get all exercises, best sets and sets count per exercise beloning to that workout
	await Promise.all(workouts.map(async (workout: any) => {
		const [exercises]: any = await db.query(
			`
			SELECT DISTINCT E.name, reps, weight, (
				SELECT COUNT(exercise_id)
				FROM \`set\`
				WHERE exercise_id = S.exercise_id
				AND workout_id = S.workout_id
				GROUP BY exercise_id
			) as sets
			FROM \`set\` AS S
			LEFT JOIN exercise AS E
			ON S.exercise_id = E.id
			WHERE S.workout_id = ?
			AND (S.reps * IF(S.weight != 0, S.weight, 1)) IN (
				SELECT MAX((reps * IF(weight != 0, weight, 1)))
				FROM \`set\`
				WHERE workout_id = ?
				GROUP BY exercise_id
			);
			`,
			[workout.id, workout.id]
		);

		workout['exercises'] = exercises;
	}));

	return workouts;
};
