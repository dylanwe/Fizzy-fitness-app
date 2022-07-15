/**
 * get all data needed to create a tempalte
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
 * Send the template to the controller to be uploaded to the database
 * 
 * @param {Object} template the template you want to upload 
 */
const postTemplate = async (template) => {
	const resp = await fetch('http://localhost:3000/dashboard/workout/template', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: template.name, sets: template.sets }),
	});

	if (resp.status === 200) {
		window.location.replace('/dashboard');
	}
}

// save data event
document.querySelector('[data-save]').addEventListener('click', async () => {
	const template = getFormData();

	if (template.sets.length != 0 && template.name != '') {
		await postTemplate(template);
	}
});