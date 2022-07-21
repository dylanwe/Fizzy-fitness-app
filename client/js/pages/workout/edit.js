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
