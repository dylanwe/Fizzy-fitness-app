import db from '../db/connection';

export interface Set {
	template_name: string;
	reps: number;
	weight: number;
	id: number;
	name: string;
}

export interface InsertSet {
	exerciseId: number;
	weight: number;
	reps: number;
}

export interface Exercise {
	id: number;
	name: string;
	sets: Set[];
}

export interface Template {
	name: string;
	exercises: Exercise[];
}

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

	const template: any = {
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
		console.log(template.exercises[4]);
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
) => {
	try {
		// create new workout tempalte
		const [template]: any = await db.execute(
			'INSERT INTO `template` ( name, user_id ) VALUES( ?, ? )',
			[templateName, userId]
		);

		// save sets that belong to the workout
		sets.forEach(async (set: InsertSet) => {
			await db.execute(
				'INSERT INTO `template_set` (reps, weight, exercise_id, template_id) VALUES ( ?, ?, ?, ?)',
				[set.reps, set.weight, set.exerciseId, template.insertId]
			);
		});
	} catch (error) {
		console.log(error);
	}
};
