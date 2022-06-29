"use strict";
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
const connection_1 = __importDefault(require("./db/connection"));
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
function initialize(passport) {
    const authenticateUser = (email, password, done) => __awaiter(this, void 0, void 0, function* () {
        const userQuery = yield connection_1.default.query('SElECT * FROM user WHERE email = ?', [email]);
        const user = userQuery[0];
        if (user == null) {
            return done(null, false, { message: 'no user with that email' });
        }
        try {
            if (yield bcrypt.compare(password, user.password)) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'password incorrect' });
            }
        }
        catch (error) {
            return done(error);
        }
    });
    passport.use(new LocalStrategy({ usernameField: 'email' }), authenticateUser);
    passport.serializeUser((user, done) => { });
    passport.deserializeUser((id, done) => { });
}
