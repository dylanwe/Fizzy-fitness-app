import { getUserByEmail } from "./models/user";
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

async function initialize(passport: any) {
    const authenticateUser = async (email: string, password: string, done: any) => {
        const user:User = await getUserByEmail(email);

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

    passport.serializeUser((user: User, done: any) => {})
    passport.deserializeUser((id: number, done: any) => {})
}

module.exports = initialize;