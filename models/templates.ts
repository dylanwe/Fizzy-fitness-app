import db from '../db/connection';

/**
 * Get all of the given users template workouts
 *
 * @param userId the user from who you want the templates of
 * @returns templates of the given user
 */
export const getAllTemplatesForUser = async (
	userId: string
): Promise<Template[]> => {
	const templates: Template[] = [];

	// get the template names and id
	const [templateNames]: any = await db.query(
		'SELECT id, name FROM template WHERE user_id = ?;',
		[userId]
	);

	// get all exercises that belong to the template
	templateNames.forEach(async (temp: any) => {
		const template: Template = {
			id: temp.id,
			name: temp.name,
			exercises: [],
		};

		const [names]: any = await db.query(
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
			[temp.id]
		);

		template.exercises = names;

		templates.push(template);
	});

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
	userId: string,
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

	let lastExercise: string = '';

	// collect every rawTemplate nicely into the template object
	rawTemplate.forEach((raw: any) => {
		if (raw.id === lastExercise) {
			template.exercises[raw.id].sets.push(raw);
		} else {
			lastExercise = raw.id;
			template.exercises[raw.id] = {
				id: raw.id,
				name: raw.name,
				sets: [],
			};
			template.exercises[raw.id].sets.push(raw);
		}
	});

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
	userId: string
): Promise<void> => {
	try {
		// create new workout tempalte
		const [template]: any = await db.execute(
			'INSERT INTO `template` ( name, user_id ) VALUES( ?, ? )',
			[templateName, userId]
		);

		// save sets that belong to the workout
		sets.forEach(async (set: InsertSet) => {
			await db.execute(
				'INSERT INTO `template_set` (reps, weight, exercise_id, template_id) VALUES (?, ?, ?, ?)',
				[set.reps, set.weight, set.exerciseId, template.insertId]
			);
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateTemplate = async (
	templateId: number,
	templateName: string,
	sets: InsertSet[],
	userId: string
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
		sets.forEach(async (set: InsertSet) => {
			await db.execute(
				'INSERT INTO `template_set` (reps, weight, exercise_id, template_id) VALUES (?, ?, ?, ?)',
				[set.reps, set.weight, set.exerciseId, templateId]
			);
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
};
