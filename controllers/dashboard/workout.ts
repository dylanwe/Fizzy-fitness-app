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

	res.render('workout', {
		user,
		exercises,
		formattedDate,
	});
});

/**
 * Render the template creation page
 */
router.get('/template', async (req: Request, res: Response) => {
	// ❌ include excersise modal
	// ❌ make database workout templates 
	// ❌ check in excersise templates if completion should be rendered
	const [exercises] = await db.query('SElECT * FROM exercise');

	res.render('template', {
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
	// check if the user is logged in
	if (!req.user) {
		res.status(500).send({ msg: 'User not logged in' });
	}

	const sets = req.body.workout;

	try {
		// the structure of a set from the request
		type Set = {
			exerciseId: number;
			weight: number;
			reps: number;
		};

		// insert a new workout
		const [workout]: any = await db.execute(
			'INSERT INTO `workout` ( title, user_id ) VALUES( ?, ? )',
			['test', req.user.id]
		);

		sets.forEach(async (set: Set) => {
			// insert sets beloning to the workout
			await db.execute(
				'INSERT INTO `set` ( reps, weight, exercise_id, workout_id ) VALUES( ?, ?, ?, ? )',
				[set.reps, set.weight, set.exerciseId, workout.insertId]
			);
		});

		res.status(200).send({ msg: 'workout posted!' });
	} catch (error) {
		res.status(500).send({ msg: "Couldn't post workout" });
	}
});

export default router;
