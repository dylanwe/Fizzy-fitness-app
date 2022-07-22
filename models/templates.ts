import db from '../db/connection';

/**
 * Get all of the given users template workouts
 *
 * @param userId the user from who you want the templates of
 * @returns templates of the given user
 */
export const getAllTemplatesForUser = async (
	userId: number
): Promise<Template[]> => {
	const templates: Template[] = [];

	// get the template names and id
	const [rawTemplates]: any = await db.query(
		'SELECT id, name FROM template WHERE user_id = ?;',
		[userId]
	);

	// get all exercises that belong to the template
	for (const rawTemplate of rawTemplates) {
		const template: Template = {
			id: rawTemplate.id,
			name: rawTemplate.name,
			exercises: [],
		};

		// get exercise name and count of sets it has
		const [exercises]: any = await db.query(
			`
			SELECT E.name, COUNT(E.id) as set_count FROM
			template AS T
			INNER JOIN template_set AS TS
			ON TS.template_id = T.id
			INNER JOIN exercise AS E
			ON TS.exercise_id = E.id
			WHERE T.id = ?
			GROUP BY E.name
			`,
			[rawTemplate.id]
		);

		template.exercises = exercises;

		templates.push(template);
	}

	return templates;
};

/**
 * Get the template with the given information
 *
 * @param userId the user id of the logged in user
 * @param templateId the id of the template in the database
 * @returns the template with the given templateId and userId
 */
export const getTemplateById = async (
	userId: number,
	templateId: string
): Promise<Template> => {
	// get all templates
	const [rawTemplate]: any = await db.query(
		`
		SELECT T.name AS template_name, TS.reps, TS.weight, E.id, E.name FROM
		template AS T
		INNER JOIN template_set AS TS
		ON TS.template_id = T.id
		INNER JOIN exercise AS E
		ON TS.exercise_id = E.id
		WHERE T.user_id = ? && T.id = ?;	
	`,
		[userId, templateId]
	);

	const template: Template = {
		name: rawTemplate[0].template_name,
		exercises: [],
	};

	// Keep track of workout exercises order
	let lastExercise = {
		id: -1, // id of the last exercise
		index: 0, // index of where this last exercise went
	};

	// collect every rawTemplate nicely into the template object
	for (const rawExercise of rawTemplate) {
		const set: ExerciseSet = {
			reps: rawExercise.reps,
			weight: rawExercise.weight,
		};

		// Check if current exercise is the same as last
		if (rawExercise.id === lastExercise.id) {
			// add the set to the group of exercises it belongs to
			template.exercises[lastExercise.index].sets.push(set);
		} else {
			// add new exercise to the exercises list
			template.exercises.push({
				id: rawExercise.id,
				name: rawExercise.name,
				sets: [set],
			});

			// change information if the exercises had a different id than the one before
			lastExercise.id = rawExercise.id;
			lastExercise.index = template.exercises.length - 1;
		}
	}

	return template;
};

/**
 * Post a new template
 *
 * @param templateName what name you want to give the new template
 * @param sets the sets contained in the template
 * @param userId the id of to whom this template will belong to
 */
export const postTemplate = async (
	templateName: string,
	sets: InsertSet[],
	userId: number
): Promise<void> => {
	try {
		// create new workout template
		const [template]: any = await db.execute(
			'INSERT INTO `template` ( name, user_id ) VALUES( ?, ? )',
			[templateName, userId]
		);

		// save sets that belong to the workout
		for (const set of sets) {
			await db.execute(
				'INSERT INTO `template_set` (reps, weight, exercise_id, template_id) VALUES (?, ?, ?, ?)',
				[set.reps, set.weight, set.exerciseId, template.insertId]
			);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

/**
 * Update a template with a new name or new exercises / sets
 * 
 * @param templateId The id of the template
 * @param templateName The new name for the template
 * @param sets All sets that you want in the new template
 * @param userId The id of the user that owns this template
 */
export const updateTemplate = async (
	templateId: number,
	templateName: string,
	sets: InsertSet[],
	userId: number
): Promise<void> => {
	try {
		// update the name of the template
		await db.execute(
			'UPDATE template SET name = ? WHERE id = ? AND user_id = ?',
			[templateName, templateId, userId]
		);

		// remove all sets from template
		await db.execute('DELETE FROM template_set WHERE template_id = ?', [
			templateId,
		]);

		// add new sets to template
		for (const set of sets) {
			await db.execute(
				'INSERT INTO `template_set` (reps, weight, exercise_id, template_id) VALUES (?, ?, ?, ?)',
				[set.reps, set.weight, set.exerciseId, templateId]
			);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

/**
 * Delete a template
 * 
 * @param templateId The id of the template to delete
 * @param userId The user to whom the template belongs to
 */
export const deleteTemplate = async (templateId: number, userId: number) => {
	try {
		// delete sets
		await db.execute(
			`
			DELETE TS
			FROM template_set as TS
			INNER JOIN template AS T
			ON TS.template_id = T.id
			WHERE TS.template_id = ? AND T.user_id = ?
			`, [
			templateId, userId
		]);

		// delete template
		await db.execute(`DELETE FROM template WHERE id = ? AND user_id = ?`, [
			templateId,
			userId,
		]);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
