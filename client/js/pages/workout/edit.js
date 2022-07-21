/**
 * Collect the data of the workout form
 *
 * @returns all exercises with its sets
 */
 const getFormData = () => {
	const name = document.querySelector('[data-workout-name]').value;

	let data = {
		name,
		sets: [],
	};

	document.querySelectorAll('[data-exercise-id]').forEach((exceresise) => {
		const id = parseInt(exceresise.getAttribute('data-exercise-id'));

		exceresise.querySelectorAll('[data-set]').forEach((set) => {
			const setData = {
				exerciseId: id,
				weight: parseInt(
					set.querySelector('input[name="weight"]').value
				),
				reps: parseInt(set.querySelector('input[name="reps"]').value),
			};

			data.sets.push(setData);
		});
	});

	return data;
};

/**
 * Store the workout in the database
 *
 * @param {Array} workout the workout you want to post
 */
const postWorkout = async (workout) => {
    const workoutId = document.querySelector('[data-workout]').getAttribute('data-workout');

	const resp = await fetch(`http://localhost:3000/dashboard/workout/${workoutId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ workout }),
	});

	if (resp.status === 200) {
		window.location.replace('/dashboard');
	}
};

// save data event
document.querySelector('[data-save]').addEventListener('click', async () => {
	const workout = getFormData();

	if (workout.sets.length !== 0 && workout.name !== '') {
		await postWorkout(workout);
	}
});
