import express, { Express, Request, Response } from 'express';
import {
	getTemplateById,
	postTemplate,
	updateTemplate,
	InsertSet,
} from '../../models/templates';
import { getAllExercises } from '../../models/exercises';
import { saveSet, saveWorkout, getWorkout, updateWorkout } from '../../models/workouts';

const router = express.Router();

/**
 * Render the empty workout page
 */
router.get('/', async (req: any, res: Response) => {
	const exercises = await getAllExercises();
	const { user } = req;

	// get todays date
	const today: Date = new Date(Date.now());
	const formattedDate: string = `${today.getDate()}-${
		today.getMonth() + 1
	}-${today.getFullYear()}`;

	res.render('dashboard/workout/workout', {
		user,
		exercises,
		formattedDate,
	});
});

/**
 * Render the template creation page
 */
router.get('/template', async (req: Request, res: Response) => {
	const exercises = await getAllExercises();

	res.render('dashboard/template', {
		user: req.user,
		exercises,
	});
});

/**
 * Render the template edit page
 */
router.get('/template/:templateId', async (req: Request, res: Response) => {
	const exercises: any = await getAllExercises();
	const { user }: any = req;
	const { templateId } = req.params;

	res.render('dashboard/template', {
		user,
		exercises,
		template: await getTemplateById(user.id, templateId),
		templateId,
	});
});

/**
 * Render the workout page loaded with the given template
 */
router.get('/:templateId', async (req: Request, res: Response) => {
	const exercises: any = await getAllExercises();
	const { user }: any = req;
	const { templateId } = req.params;

	// get todays date
	const today: Date = new Date(Date.now());
	const formattedDate: string = `${today.getDate()}-${
		today.getMonth() + 1
	}-${today.getFullYear()}`;

	res.render('dashboard/workout/workout', {
		user,
		exercises,
		formattedDate,
		template: await getTemplateById(user.id, templateId),
	});
});

/**
 * Render the edit workout page
 */
router.get('/edit/:workoutId', async (req: Request, res: Response) => {
	const exercises: any = await getAllExercises();
	const { user }: any = req;
	const { workoutId } = req.params;

	res.render('dashboard/workout/edit', {
		user,
		exercises,
		workout: await getWorkout(parseInt(workoutId), user.id),
		workoutId: workoutId
	});
});

/**
 * Post a completed workout
 */
router.post('/', async (req: Request | any, res: Response) => {
	const { workout }: any = req.body;

	// get workout time ready for database
	const timeNow = new Date(Date.now());
	const convertedTime = `${timeNow.getFullYear()}-${
		timeNow.getMonth() + 1
	}-${timeNow.getDate()} ${
		workout.time.length > 5 ? workout.time : `00:${workout.time}`
	}`;

	try {
		// insert a new workout
		const insertedWorkout = await saveWorkout(
			workout.name,
			convertedTime,
			req.user.id
		);

		// insert sets beloning to the workout
		workout.sets.forEach(async (set: InsertSet) => {
			await saveSet(set, insertedWorkout.insertId);
		});

		res.status(200).send({ msg: 'Workout posted!' });
	} catch (error) {
		res.status(500).send({ msg: "Couldn't post workout" });
	}
});

/**
 * Post a completed workout
 */
 router.put('/:workoutId', async (req: Request | any, res: Response) => {
	const { user }: any = req;
	const { workout }: any = req.body;
	const { workoutId }: any = req.params;

	try {
		updateWorkout(workout, workoutId, user.id);

		res.status(200).send({ msg: 'Workout saved!' });
	} catch (error) {
		res.status(500).send({ msg: "Couldn't save workout" });
	}
});

/**
 * Post a new template
 */
router.post('/template', async (req: Request | any, res: Response) => {
	try {
		const { name, sets } = req.body;

		await postTemplate(name, sets, req.user.id);

		res.status(200).send({ msg: 'Saved template' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ msg: "Couldn't save template" });
	}
});

/**
 * Update a tempalte
 */
router.put(
	'/template/:templateId',
	async (req: Request | any, res: Response) => {
		try {
			const { name, sets } = req.body;
			const templateId = parseInt(req.params.templateId);

			await updateTemplate(templateId, name, sets, req.user.id);

			res.status(200).send({ msg: 'Saved template' });
		} catch (error) {
			console.log(error);
			res.status(500).send({ msg: "Couldn't save template" });
		}
	}
);

export default router;
