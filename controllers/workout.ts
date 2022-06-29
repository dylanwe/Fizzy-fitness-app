import express, { Express, Request, Response } from 'express';
import db from '../db/connection';

const router = express.Router();

router.post('/', (req: Request | any, res: Response) => {
	try {
		const workout = req.body.workout;

		const username = req.user.username;
		res.status(200).send({ msg: `sexy ${username}` });
	} catch (error) {
		res.status(500).send({ msg: "couldn't post workout" });
	}
});

export default router;
