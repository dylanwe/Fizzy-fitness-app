/**
 * get all data needed to create a tempalte
 */
const getFormData = () => {
	const name = document.querySelector('[data-modal-name]').value;

	let data = {
		name,
		workout: [],
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

			data.workout.push(setData);
		});
	});

	return data;
};

document
	.querySelector('[data-save-modal-open]')
	.addEventListener('click', () => {
		document.querySelector('[data-save-modal]').classList.remove('hidden');
	});

document
	.querySelector('[data-save-modal-close]')
	.addEventListener('click', () => {
		document.querySelector('[data-save-modal]').classList.add('hidden');
	});

document.querySelector('[data-save]').addEventListener('click', () => {
	console.log(getFormData());
});
