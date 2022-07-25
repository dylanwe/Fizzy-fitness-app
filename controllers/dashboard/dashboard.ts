import express, { Request, Response } from 'express';
import { getAllTemplatesForUser } from '../../models/templates';
import { updateUser, giveUserApikey } from '../../models/user';
import {
	getAllPinnedExerciseStats,
	getAllExerciseStats,
	changePin,
} from '../../models/exercises';
import workoutRouter from './workout';
import { rowsWorkoutHistory, allWorkoutHistory } from '../../models/workouts';

const router = express.Router();
// add other routers
router.use('/workout', workoutRouter);

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

// render the history page
router.get('/history', async (req: Request, res: Response) => {
	const workouts: any[] = await allWorkoutHistory(req.user!.id);

	res.render('dashboard/history', { user: req.user, workouts });
});

// render the settings page
router.get('/settings', async (req: Request, res: Response) => {
	res.render('dashboard/settings', { user: req.user });
});

// render the settings page
router.put('/settings', async (req: Request, res: Response) => {
	const { email, username, newPassword, password }: any = req.body;

	const update = await updateUser(
		email.replace(/\s/g, ''),
		username.replace(/\s/g, ''),
		(newPassword) ? newPassword.replace(/\s/g, '') : newPassword,
		password.replace(/\s/g, ''),
		req.user!
	);

	if (update.length === 0 ) {
		res.sendStatus(200);
		return;
	}

	res.status(500).json({ errors: update });
});

// give or update user apikey
router.put('/settings/apikey', async (req: Request, res: Response) => {
	const apikey = await giveUserApikey(req.user!.id);

	if (apikey) {
		res.status(200).json({ newKey: apikey });
		return;
	}

	res.status(500).json({ errors: 'Couldn\'t give user apikey' });
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

export default router;