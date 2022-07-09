import express, { Express, Request, Response } from 'express';
import db from '../../db/connection';

const router = express.Router();

/**
 * Render the empty workout page
 */
router.get('/', async (req: any, res: Response) => {
	const [exercises] = await db.query('SElECT * FROM exercise');
	const { user } = req;

	// get todays date
	const today: Date = new Date(Date.now());
	const formattedDate: string = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

	res.render('dashboard/workout', {
		user,
		exercises,
		formattedDate,
	});
});

/**
 * Render the template creation page
 */
router.get('/template', async (req: Request, res: Response) => {
	const [exercises] = await db.query('SElECT * FROM exercise');

	res.render('dashboard/template', {
		user: req.user,
		exercises,
	});
});

/**
 * Render the template edit page
 */
router.get('/template/:templateId', async (req: Request, res: Response) => {
	const [exercises]: any = await db.query('SElECT * FROM exercise');
	const { user }: any = req;
	const { templateId } = req.params;

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
		[user.id, templateId]
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
	});
	res.render('dashboard/template', {
		user,
		exercises,
		template,
	});
});

/**
 * Render the workout page loaded with the given template
 */
router.get('/:templateId', async (req: Request, res: Response) => {
	const [exercises]: any = await db.query('SElECT * FROM exercise');
	const { user }: any = req;
	const { templateId } = req.params;

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
		[user.id, templateId]
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
	});

	// get todays date
	const today: Date = new Date(Date.now());
	const formattedDate: string = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

	res.render('dashboard/workout', {
		user,
		exercises,
		formattedDate,
		template,
	});
});

/**
 * Post a completed workout
 */
router.post('/', async (req: Request | any, res: Response) => {
	const { workout }: any = req.body;

	// get workout time ready for database
	const timeNow = new Date(Date.now());
	const convertedTime = `${timeNow.getFullYear()}-${timeNow.getMonth()}-${timeNow.getDate()} ${
		workout.time.length > 5 ? workout.time : `00:${workout.time}`
	}`;

	try {
		// the structure of a set from the request
		type Set = {
			exerciseId: number;
			weight: number;
			reps: number;
		};

		// insert a new workout
		const [insertedWorkout]: any = await db.execute(
			'INSERT INTO `workout` ( name, time, user_id ) VALUES( ?, ?, ? )',
			[workout.name, convertedTime, req.user.id]
		);

		// insert sets beloning to the workout
		workout.sets.forEach(async (set: Set) => {
			await db.execute(
				'INSERT INTO `set` ( reps, weight, exercise_id, workout_id ) VALUES( ?, ?, ?, ? )',
				[set.reps, set.weight, set.exerciseId, insertedWorkout.insertId]
			);
		});

		res.status(200).send({ msg: 'Workout posted!' });
	} catch (error) {
		res.status(500).send({ msg: "Couldn't post workout" });
	}
});

router.post('/template', async (req: Request | any, res: Response) => {
	try {
		const { name, sets } = req.body;

		// the structure of a set from the request
		type Set = {
			exerciseId: number;
			weight: number;
			reps: number;
		};

		// save a template
		const [template]: any = await db.execute(
			'INSERT INTO `template` ( name, user_id ) VALUES( ?, ? )',
			[name, req.user.id]
		);

		// save sets that belong to the workout
		sets.forEach(async (set: Set) => {
			await db.execute(
				'INSERT INTO `template_set` (reps, weight, exercise_id, template_id) VALUES ( ?, ?, ?, ?)',
				[set.reps, set.weight, set.exerciseId, template.insertId]
			);
		});

		res.status(200).send({ msg: 'Saved template' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ msg: "Couldn't save template" });
	}
});

export default router;
