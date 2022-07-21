import express, { Request, Response } from 'express';
import { getAllTemplatesForUser } from '../../models/templates';
import {
	getAllPinnedExerciseStats,
	getAllExerciseStats,
} from '../../models/exercises';
import { rowsWorkoutHistory, allWorkoutHistory } from '../../models/workouts';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
	const templates = await getAllTemplatesForUser(req.user!.id);
	const stats: Stat[] = await getAllPinnedExerciseStats(req.user!.id);
	const workouts = await rowsWorkoutHistory(4, req.user!.id);

	res.render('dashboard/dashboard', {
		user: req.user,
		templates,
		stats,
		workouts,
	});
});

router.get('/stats', async (req: Request, res: Response) => {
	const stats: Stat[] = await getAllExerciseStats(req.user!.id);
	res.render('dashboard/stats', { user: req.user, stats });
});

router.get('/history', async (req: Request, res: Response) => {
	const workouts: any[] = await allWorkoutHistory(req.user!.id);

	res.render('dashboard/history', { user: req.user, workouts });
});

export default router;
