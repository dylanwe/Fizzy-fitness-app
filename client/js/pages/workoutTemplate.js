/**
 * get all data needed to create a tempalte
 */
const getFormData = () => {
	const name = document.querySelector('[data-modal-name]').value;

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

document
	.querySelector('[data-save-modal-open]')
	.addEventListener('click', () => {
		const exercise = document.querySelectorAll('[data-exercise-id]');

		// check if the tempalte contains and exersise before going to the next step
		if (exercise.length !== 0) {
			document.querySelector('[data-save-modal]').classList.remove('hidden');
		}
	});

document
	.querySelector('[data-save-modal-close]')
	.addEventListener('click', () => {
		document.querySelector('[data-save-modal]').classList.add('hidden');
	});

document.querySelector('[data-save]').addEventListener('click', async () => {
	const template = getFormData();

	if (template.sets.length != 0 && template.name != '') {
		await postTemplate(template);
	}
});
