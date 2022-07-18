import express, { Express, Request, Response } from 'express';
import { getAllTemplatesForUser } from '../../models/templates'
import { getAllExerciseStat, Stat } from '../../models/exercises'
import { getWorkoutHistory } from '../../models/workouts'

const router = express.Router();

router.get('/', async (req: Request | any, res: Response) => {
	const { user } = req;
	
	const templates = await getAllTemplatesForUser(user.id);

	const stat1: Stat = await getAllExerciseStat(4, user.id);
	const stat2: Stat = await getAllExerciseStat(8, user.id);

	const stats: Stat[] = [stat1, stat2];
	
	const workouts = await getWorkoutHistory(4, user.id);

	res.render('dashboard/dashboard', { user, templates, stats, workouts });
});

export default router;
