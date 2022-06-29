"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./controllers/auth"));
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
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
