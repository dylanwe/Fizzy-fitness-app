"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const router = express_1.default.Router();
router.get('/login', (req, res, next) => {
    res.render('login');
});
// router.post('/login', passport.authenticate('local', {
// 	succesRedirect: '/',
// 	failureRedirect: '/login',
// }));
// passport.use(new LocalStrategy(async function verify(email: string, password: string, cb: any) {
//     try {
//         const userQuery = await db.query('SElECT * FROM user WHERE email = ?',
//         [email]);
//         const user:any = userQuery[0];
//         if (!user) return cb(null, false, {message: 'Incorrect email.'})
//         if (!await bcrypt.compare(password, user.password)) {
//             return cb(null, false, {message: 'password incorrect'});
//         }
//         return cb(null, user);
//     } catch (error) {
//         return cb(error); 
//     }
// }));
module.exports = router;
