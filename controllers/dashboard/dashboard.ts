import express, { Express, Request, Response } from 'express';
import db from '../../db/connection';

const router = express.Router();

router.get('/', async (req: Request | any, res: Response) => {
	const { user } = req;
	const templates: any[] = [];

	// get the template names and id
	const [templateNames]: any = await db.query(
		'SELECT id, name FROM template WHERE user_id = ?;',
		[user.id]
	);

	// get all exercises that belong to the template
	templateNames.forEach(async (temp: any) => {
		const template = {
			id: temp.id,
			name: temp.name,
			exercises: [],
		};

		const [names]: any = await db.query(
			`
			SELECT E.name FROM
			template AS T
			INNER JOIN template_set AS TS
			ON TS.template_id = T.id
			INNER JOIN exercise AS E
			ON TS.exercise_id = E.id
			WHERE T.id = ?
			GROUP BY E.name;
			`,
			[temp.id]
		);

		template.exercises = names;

		templates.push(template);
	});

	// get the 5 most recent workouts
	const [workouts] = await db.query(
		`
		SELECT W.name, DATE_FORMAT(W.date, "%d-%m-%Y") AS date, HOUR(W.time) as time_hour, MINUTE(W.time) as time_minute
		FROM workout AS W
		WHERE user_id = ?
		ORDER BY W.id DESC
		LIMIT 5;
		`,
		[user.id]
	);

	res.render('dashboard/dashboard', { user, templates, workouts });
});

export default router;
