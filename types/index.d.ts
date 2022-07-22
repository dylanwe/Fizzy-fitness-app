/**
 * All custom types belonging to my project
 */

// declare User type for express
declare namespace Express {
	interface User {
		id: number;
		email: string;
		username: string;
	}
}

interface User {
	id: number;
	email: string;
	username: string;
	password?: string;
}

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

interface Stat {
	id: number;
	name: string;
	pinned: boolean;
	dates: string[];
	reps: number[];
	volumes: string[];
	prs: string[];
}

interface TemplateSet extends ExerciseSet {
	template_name: string;
	name: string;
	id: number;
}

interface InsertSet extends ExerciseSet {
	exerciseId: number;
}

interface Exercise {
	id: number;
	name: string;
	sets: TemplateSet[];
}

interface Template {
	id?: string;
	name: string;
	exercises: Exercise[];
}
