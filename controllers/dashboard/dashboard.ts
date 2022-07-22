import express, { Request, Response } from 'express';
import { getAllTemplatesForUser } from '../../models/templates';
import {
	getAllPinnedExerciseStats,
	getAllExerciseStats,
	changePin,
} from '../../models/exercises';
import { rowsWorkoutHistory, allWorkoutHistory } from '../../models/workouts';

const router = express.Router();

// render the dashboard
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

// render the stats page
router.get('/stats', async (req: Request, res: Response) => {
	const stats: Stat[] = await getAllExerciseStats(req.user!.id);
	res.render('dashboard/stats', { user: req.user, stats });
});

router.put('/stats/:exerciseId', async (req: Request, res: Response) => {
	// get exerciseId and userId
	const { isPinned } = req.body;
	const { exerciseId } = req.params;
	const changed: boolean = await changePin(
		isPinned,
		exerciseId,
		req.user!.id
	);

	if (changed) {
		res.sendStatus(200);
		return;
	}

	res.sendStatus(500);
});

// render the history page
router.get('/history', async (req: Request, res: Response) => {
	const workouts: any[] = await allWorkoutHistory(req.user!.id);

	res.render('dashboard/history', { user: req.user, workouts });
});

export default router;
