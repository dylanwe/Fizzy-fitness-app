import express, { Express, Request, Response } from 'express';
import { checkAuthenticated } from './auth';
import db from '../db/connection';

const router = express.Router();

/**
 * Render the workout page
 */
router.get('/', checkAuthenticated, async (req: any, res: Response) => {
	const [exercises] = await db.query('SElECT * FROM exercise');
	const user = req.user ? req.user : undefined;

	res.render('workout', {
		exercises,
		user,
	});
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
		interface Set {
			exerciseId: number;
			weight: number;
			reps: number;
		}

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
