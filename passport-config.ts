import db from './db/connection';
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

async function initialize(passport: any) {
    const authenticateUser = async (email: string, password: string, done: any) => {
        const userQuery = await db.query('SElECT * FROM user WHERE email = ?',
        [email]);

        const user:any = userQuery[0];

        if (user == null) {
            return done(null, false, {message: 'no user with that email'});
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'password incorrect'});
            }
        } catch (error) {
            return done(error, false);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}), authenticateUser)

    passport.serializeUser((user: any, done: any) => {})
    passport.deserializeUser((id: any, done: any) => {})
}

module.exports = initialize;