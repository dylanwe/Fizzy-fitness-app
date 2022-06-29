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
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../db/connection"));
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(500).send({ msg: 'User not logged in' });
    }
    const sets = req.body.workout;
    try {
        const [workout] = yield connection_1.default.execute('INSERT INTO `workout` ( title, user_id ) VALUES( ?, ? )', ['test', req.user.id]);
        sets.forEach((set) => __awaiter(void 0, void 0, void 0, function* () {
            yield connection_1.default.execute('INSERT INTO `set` ( reps, weight, exercise_id, workout_id ) VALUES( ?, ?, ?, ? )', [set.reps, set.weight, set.exerciseId, workout.insertId]);
        }));
        res.status(200).send({ msg: `workout posted!` });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ msg: "couldn't post workout" });
    }
}));
exports.default = router;
