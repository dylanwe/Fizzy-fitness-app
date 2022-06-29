import express, { Express, Request, Response } from 'express';
import db from '../db/connection';

const router = express.Router();

router.post('/', async (req: Request | any, res: Response) => {
	if (!req.user) {
		res.status(500).send({ msg: 'User not logged in' });
	}
	
	const sets = req.body.workout;

	try {
		interface Set {
			exerciseId: number,
			weight: number,
			reps: number
		}
		
		const [workout]: any = await db.execute(
			'INSERT INTO `workout` ( title, user_id ) VALUES( ?, ? )',
			['test', req.user.id]
		);

		sets.forEach(async (set: Set) => {
			await db.execute(
				'INSERT INTO `set` ( reps, weight, exercise_id, workout_id ) VALUES( ?, ?, ?, ? )',
				[set.reps, set.weight, set.exerciseId, workout.insertId]
			);
		});

		res.status(200).send({ msg: `workout posted!` });
	} catch (error) {
		console.log(error);
		
		res.status(500).send({ msg: "couldn't post workout" });
	}
});

export default router;
