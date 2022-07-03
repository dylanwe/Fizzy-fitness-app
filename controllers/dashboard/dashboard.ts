import express, { Express, Request, Response } from 'express';
import { checkAuthenticated } from '../auth';
import db from '../../db/connection';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
	const [workouts] = await db.query('SELECT title, DATE_FORMAT(date, "%d-%m-%Y") as date FROM `workout`');

	res.render('dashboard/dashboard', { user: req.user, workouts });
});

export default router;
