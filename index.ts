import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import authRouter, { checkAuthenticated } from './controllers/auth';
import dashboardRouter from './controllers/dashboard/dashboard';
import apiRouter from './controllers/api';
const MySQLStore = require('express-mysql-session')(session);
import db from './db/connection';

const app: Express = express();
const port: number = parseInt(<string>process.env.PORT);

// set the view engine to ejs
app.set('view engine', 'ejs');

// create static for the client css and js
app.use('/', express.static('client'));
app.use('/ts/', express.static('dist/client/ts'));
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
		store: new MySQLStore({}, db),
	})
);
// make passport use the session to store an authenticated user
app.use(passport.authenticate('session'));

// render the homepage
app.get('/', (req: Request, res: Response) => {
	// if user is logged in than redirect him to the dashboard
	if (req.isAuthenticated()) {
		res.redirect('/dashboard');
		return;	
	}
	
	res.render('homepage');
});

// sub routers
app.use('/', authRouter);
app.use('/dashboard', checkAuthenticated, dashboardRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});
