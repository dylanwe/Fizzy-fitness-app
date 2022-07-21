/**
 * All types belonging to workouts
 * @author Dylan Weijgertze
 */

interface Workout {
	name: string;
	exercises: Exercise[];
}

interface Exercise {
	id: number;
	name: string;
	sets: Set[];
}

interface ExerciseSet {
	reps: number;
	weight: number;
}