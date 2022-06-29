import express, { Express, Request, Response } from 'express';
import { checkAuthenticated } from '../auth';
import db from '../../db/connection';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.render('dashboard', { user: req.user });
});

export default router;
