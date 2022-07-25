import express, { Request, Response } from 'express';
import { getUserByApikey } from '../../models/user';
import { getAllExerciseStats, getExerciseStat } from '../../models/exercises';
import { getWorkout, allWorkoutHistory } from '../../models/workouts';

const router = express.Router();

// get all workout history for user
router.get('/:apikey/history', async (req: Request, res: Response) => {
	try {
		const user = await getUserByApikey(req.params.apikey);
		const history = await allWorkoutHistory(user.id);

		res.status(200).json({ history });
	} catch (error) {
		res.status(500).json({ message: 'Couldn\'t find any history with the given key' });
	}
});

// get workout from history
router.get('/:apikey/history/:id', async (req: Request, res: Response) => {
    try {
        const user = await getUserByApikey(req.params.apikey);
        const workout = await getWorkout(req.params.id, user.id);
        
        res.status(200).json({ workout });
    } catch (error) {
        res.status(500).json({ message: 'Couldn\'t find the workout with this id and apikey' });
    }
});

// get workout from history
router.get('/:apikey/stat', async (req: Request, res: Response) => {
    try {
        const user = await getUserByApikey(req.params.apikey);
	    const stats = await getAllExerciseStats(user.id);
	    res.status(200).json({ stats });
    } catch (error) {
        res.status(500).json({ message: 'Couldn\'t find stats with this apikey' });
    }
});

// get workout from history
router.get('/:apikey/stat/:id', async (req: Request, res: Response) => {
    try {
        const user = await getUserByApikey(req.params.apikey);
        const stat = await getExerciseStat(parseInt(req.params.id), user.id);
        
        res.status(200).json({ stat });
    } catch (error) {
        res.status(500).json({ message: 'Couldn\'t find the stat with this id and apikey' });
    }
});

// router.use('/workout', workoutRouter);
export default router;
