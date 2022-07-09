import express, { Express, Request, Response } from 'express';
import { getAllTemplatesForUser } from '../../models/templates'
import db from '../../db/connection';

const router = express.Router();

router.get('/', async (req: Request | any, res: Response) => {
	const { user } = req;
	
	const templates = await getAllTemplatesForUser(user.id);

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
