import express, { Express, Request, Response } from 'express';
import { getAllTemplatesForUser } from '../../models/templates';
import {
	getAllPinnedExerciseStats,
	getAllExerciseStats,
	Stat,
} from '../../models/exercises';
import { rowsWorkoutHistory, allWorkoutHistory } from '../../models/workouts';

const router = express.Router();

router.get('/', async (req: Request | any, res: Response) => {
	const { user } = req;

	const templates = await getAllTemplatesForUser(user.id);

	const stats: Stat[] = await getAllPinnedExerciseStats(user.id);

	const workouts = await rowsWorkoutHistory(4, user.id);

	res.render('dashboard/dashboard', { user, templates, stats, workouts });
});

router.get('/stats', async (req: Request | any, res: Response) => {
	const { user } = req;

	const stats: Stat[] = await getAllExerciseStats(user.id);

	res.render('dashboard/stats', { user, stats });
});

router.get('/history', async (req: Request | any, res: Response) => {
	const { user } = req;

	const workouts: any[] = await allWorkoutHistory(user.id);

	res.render('dashboard/history', { user, workouts });
});

export default router;
