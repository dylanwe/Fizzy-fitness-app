import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import authRouter, { checkAuthenticated } from './controllers/auth';
import workoutRouter from './controllers/workout';
import db from './db/connection';

const app: Express = express();
const port: number = parseInt(<string>process.env.PORT);

// set the view engine to ejs
app.set('view engine', 'ejs');

// create static for the client css and js
app.use('/', express.static('client'));
// parse the body and make the data readable
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());
// configure the session in which things are stored
app.use(
	session({
		secret: <string>process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
// make passport use the session to store an authenticated user
app.use(passport.authenticate('session'));

// render the homepage
app.get('/', (req: Request, res: Response) => {
	res.render('homepage');
});

// sub routers
app.use('/', authRouter);
app.use('/workout', workoutRouter);

// render the workout page
app.get('/workout', checkAuthenticated, async (req: any, res: Response) => {
	const [exercises] = await db.query('SElECT * FROM exercise');

	res.render('workout', {
		exercises,
		username: req.user.username,
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});
