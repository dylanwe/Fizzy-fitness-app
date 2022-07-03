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
	res.send('template edit');
});

/**
 * Render the workout page loaded with the given template
 */
router.get('/:templateId', async (req: any, res: Response) => {
	res.send('workout with template');
});

/**
 * Post a completed workout
 */
router.post('/', async (req: Request | any, res: Response) => {
	const { sets } = req.body;

	try {
		// the structure of a set from the request
		type Set = {
			exerciseId: number;
			weight: number;
			reps: number;
		};

		// insert a new workout
		const [workout]: any = await db.execute(
			'INSERT INTO `workout` ( name, user_id ) VALUES( ?, ? )',
			['test', req.user.id]
		);

		// insert sets beloning to the workout
		sets.forEach(async (set: Set) => {
			await db.execute(
				'INSERT INTO `set` ( reps, weight, exercise_id, workout_id ) VALUES( ?, ?, ?, ? )',
				[set.reps, set.weight, set.exerciseId, workout.insertId]
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
