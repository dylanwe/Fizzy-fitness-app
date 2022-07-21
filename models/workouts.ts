import db from '../db/connection';

export interface Set {
	reps: number;
	weight: number;
}

export interface Exercise {
	id: number;
	name: string;
	sets: Set[];
}

interface Workout {
	name: string;
	exercises: Exercise[];
}

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

export const getWorkout = async (workoutId: number, userId: number): Promise<Workout> => {
	const [rawExercises]: any = await db.query(
		`
		SELECT W.name as workout_name, S.reps, S.weight, E.id, E.name
		FROM workout AS W
		INNER JOIN \`set\` AS S
		ON S.workout_id = W.id
		INNER JOIN exercise AS E
		ON S.exercise_id = E.id
		WHERE W.id = ? AND W.user_id = ?;
	`,
		[workoutId, userId]
	);

	const workout: Workout = {
		name: rawExercises[0].workout_name,
		exercises: [],
	};

	// Keep track of workout exercises order
	let lastExercise = {
		id: -1, 	// id of the last exercise
		index: 0, 	// index of where this last exercise went
	};

	for (const rawExercise of rawExercises) {
		const set: Set = {reps: rawExercise.reps, weight: rawExercise.weight}

		// Check if current exercise is the same as last
		if (rawExercise.id === lastExercise.id) {
			// add the set to the group of exercises it belongs to
			workout.exercises[lastExercise.index].sets.push(set);
		} else {
			// add new exercise to the exercises list
			workout.exercises.push({
				id: rawExercise.id,
				name: rawExercise.name,
				sets: [set],
			});
			
			// change information if the exercises had a different id than the one before
			lastExercise.id = rawExercise.id;
			lastExercise.index = workout.exercises.length - 1;
		}
	}

	return workout;
};

/**
 * Update a given workout with new information
 * 
 * @param workout The new workout information
 * @param workoutId The id of the workout from which you want to update the name
 * @param userId The id of to whom the workout belongs
 */
export const updateWorkout = async (workout: any, workoutId: string, userId: string) => {
	try {
		// update workout name
		await db.execute(
			`UPDATE workout SET name = ? WHERE id = ? AND user_id = ?`,
			[workout.name, workoutId, userId]
		);

		// delete all old sets
		await db.execute(
			`DELETE FROM \`set\` WHERE workout_id = ?`,
			[workoutId]
		);

		// save new sets
		for await (const set of workout.sets) {
			await saveSet(set, workoutId);
		}
	} catch (error) {
		console.log(error);
	}
}

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
 * Get all completed workouts of the user
 *
 * @param userId The id user you want to get his history from
 * @returns The history of the workouts completed
 */
 export const allWorkoutHistory = async ( userId: string ): Promise<any[]> => {
	// get the *rows* amount of recent workouts
	const [workouts]: any = await db.query(
		`
		SELECT W.id, W.name, DATE_FORMAT(W.date, "%d-%m-%Y") AS date, HOUR(W.time) as time_hour, MINUTE(W.time) as time_minute
		FROM workout AS W
		WHERE user_id = ?
		ORDER BY W.id DESC;
		`,
		[userId]
	);

	// get all exercises, best sets and sets count per exercise beloning to that workout
	await Promise.all(
		workouts.map(async (workout: any) => {
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
		})
	);

	return workouts;
};

/**
 * Get the given amount of most recent completed workouts of the user
 *
 * @param rows The limit of rows you want from the history
 * @param userId The id user you want to get his history from
 * @returns The history of the workouts completed
 */
export const rowsWorkoutHistory = async (
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
	await Promise.all(
		workouts.map(async (workout: any) => {
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
		})
	);

	return workouts;
};
