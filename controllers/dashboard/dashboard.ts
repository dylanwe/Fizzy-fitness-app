import express, { Express, Request, Response } from 'express';
import { getAllTemplatesForUser } from '../../models/templates'
import { getWorkoutHistory } from '../../models/workouts'

const router = express.Router();

router.get('/', async (req: Request | any, res: Response) => {
	const { user } = req;
	
	const templates = await getAllTemplatesForUser(user.id);
	
	const workouts = await getWorkoutHistory(5, user.id);

	res.render('dashboard/dashboard', { user, templates, workouts });
});

export default router;
