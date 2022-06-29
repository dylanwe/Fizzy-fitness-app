"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importStar(require("./controllers/auth"));
const workout_1 = __importDefault(require("./controllers/workout"));
const MySQLStore = require('express-mysql-session')(express_session_1.default);
const connection_1 = __importDefault(require("./db/connection"));
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT);
// set the view engine to ejs
app.set('view engine', 'ejs');
// create static for the client css and js
app.use('/', express_1.default.static('client'));
// parse the body and make the data readable
app.use(body_parser_1.default.urlencoded({
    extended: false,
}));
app.use(body_parser_1.default.json());
// configure the session in which things are stored
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({}, connection_1.default)
}));
// make passport use the session to store an authenticated user
app.use(passport_1.default.authenticate('session'));
// render the homepage
app.get('/', (req, res) => {
    const user = (req.user) ? req.user : undefined;
    res.render('homepage', { user });
});
// sub routers
app.use('/', auth_1.default);
app.use('/workout', workout_1.default);
// render the workout page
app.get('/workout', auth_1.checkAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [exercises] = yield connection_1.default.query('SElECT * FROM exercise');
    const user = (req.user) ? req.user : undefined;
    res.render('workout', {
        exercises,
        user,
    });
}));
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
