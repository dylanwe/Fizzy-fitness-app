import express, { Express, Request, Response } from 'express';
import { getTemplateById, postTemplate } from '../../models/templates'
import { getAllExercises } from '../../models/exercises'
import db from '../../db/connection';

const router = express.Router();

/**
 * Render the empty workout page
 */
router.get('/', async (req: any, res: Response) => {
	const [exercises] = await getAllExercises();
	const { user } = req;

	// get todays date
	const today: Date = new Date(Date.now());
	const formattedDate: string = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

	res.render('dashboard/workout', {
		user,
		exercises,
		formattedDate,
	});
});

/**
 * Render the template creation page
 */
router.get('/template', async (req: Request, res: Response) => {
	const [exercises] = await getAllExercises();

	res.render('dashboard/template', {
		user: req.user,
		exercises,
	});
});

/**
 * Render the template edit page
 */
router.get('/template/:templateId', async (req: Request, res: Response) => {
	const [exercises]: any = await getAllExercises();
	const { user }: any = req;
	const { templateId } = req.params;
	
	res.render('dashboard/template', {
		user,
		exercises,
		template: await getTemplateById(user.id, templateId),
	});
});

/**
 * Render the workout page loaded with the given template
 */
router.get('/:templateId', async (req: Request, res: Response) => {
	const [exercises]: any = await getAllExercises();
	const { user }: any = req;
	const { templateId } = req.params;

	// get todays date
	const today: Date = new Date(Date.now());
	const formattedDate: string = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

	res.render('dashboard/workout', {
		user,
		exercises,
		formattedDate,
		template: await getTemplateById(user.id, templateId),
	});
});

/**
 * Post a completed workout
 */
router.post('/', async (req: Request | any, res: Response) => {
	const { workout }: any = req.body;

	// get workout time ready for database
	const timeNow = new Date(Date.now());
	const convertedTime = `${timeNow.getFullYear()}-${timeNow.getMonth()}-${timeNow.getDate()} ${
		workout.time.length > 5 ? workout.time : `00:${workout.time}`
	}`;

	try {
		// the structure of a set from the request
		type Set = {
			exerciseId: number;
			weight: number;
			reps: number;
		};

		// insert a new workout
		const [insertedWorkout]: any = await db.execute(
			'INSERT INTO `workout` ( name, time, user_id ) VALUES( ?, ?, ? )',
			[workout.name, convertedTime, req.user.id]
		);

		// insert sets beloning to the workout
		workout.sets.forEach(async (set: Set) => {
			await db.execute(
				'INSERT INTO `set` ( reps, weight, exercise_id, workout_id ) VALUES( ?, ?, ?, ? )',
				[set.reps, set.weight, set.exerciseId, insertedWorkout.insertId]
			);
		});

		res.status(200).send({ msg: 'Workout posted!' });
	} catch (error) {
		res.status(500).send({ msg: "Couldn't post workout" });
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

export default router;
