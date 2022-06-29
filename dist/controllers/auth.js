"use strict";
/**
 * All code to handle the actual signup / login authentication.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNotAuthenticated = exports.checkAuthenticated = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = __importDefault(require("../db/connection"));
/**
 * Verify the user login
 *
 * @param email the email of the user
 * @param password the password of the user
 * @param done what to call when it's complete
 */
const verify = (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield connection_1.default.query('SElECT * FROM user WHERE email = ?', [email]);
        const user = rows[0];
        if (!user)
            return done(null, false, { message: 'Incorrect email.' });
        if (!(yield bcrypt_1.default.compare(password, user.password))) {
            return done(null, false, { message: 'password incorrect' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
});
/**
 * Configure passport to use local strategy
 */
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, verify));
/**
 * Determine what data of the user should be stored in the session
 */
passport_1.default.serializeUser((user, callback) => {
    process.nextTick(() => {
        callback(null, user.id);
    });
});
/**
 * Get the user information from the database by the id stored in the session
 */
passport_1.default.deserializeUser((id, callback) => {
    process.nextTick(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield connection_1.default.query('SElECT id, email, username FROM user WHERE id = ?', [id]);
            const user = rows[0];
            return callback(null, user);
        }
        catch (error) {
            return callback(error);
        }
    }));
});
/**
 * Middleware to protect pages so that only authenticated users can acces them
 */
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
exports.checkAuthenticated = checkAuthenticated;
/**
 * Middleware to protect pages so that only non authenticated users can acces them
 */
const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};
exports.checkNotAuthenticated = checkNotAuthenticated;
const router = express_1.default.Router();
router.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup');
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        // add the new user to the database
        yield connection_1.default.execute('INSERT INTO `user` (email, password, username) VALUES( ?, ?, ? )', [req.body.email, hashedPassword, req.body.username]);
        res.redirect('/login');
    }
    catch (err) {
        console.log(err);
        res.redirect('/signup');
    }
}));
router.get('/login', checkNotAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('login');
}));
/**
 * log the user in via the passport configuration
 */
router.post('/login', passport_1.default.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});
router.delete('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
exports.default = router;
