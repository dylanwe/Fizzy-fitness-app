// get templates and exercises body
const exerciseTemplate = document.querySelector('#exercise');
const setTemplate = document.querySelector('#set');
const exercises = document.querySelector('[data-exercises]');

/**
 * Get the parent exercise of the give child
 *
 * @param {Element} child the child element you want the parent exercise for
 * @returns the exercise above the given child
 */
const getexerciseFromChild = (child) => {
	let exercise = child;

	// find set exercise parent
	while (!exercise.hasAttribute('data-exercise-id')) {
		exercise = exercise.parentNode;
	}

	return exercise;
};

/**
 * Add the completeSet and removeSet events
 *
 * @param {Element} set the set you want to add events to
 */
const addSetEvents = (set) => {
	set.querySelector('[data-checkbox]')?.addEventListener('click', (event) =>
		completeSet(event.target, set)
	);

	set.querySelector('[data-remove]').addEventListener('click', () =>
		removeSet(set)
	);
};

/**
 * Add an exercise to the form
 *
 * @param {number} id the id of the exercise in the database
 * @param {string} name the name of the exercise
 */
const addexercise = (id, name) => {
	const clone = exerciseTemplate.content.cloneNode(true);

	clone
		.querySelector('[data-exercise-id]')
		.setAttribute('data-exercise-id', id);
	clone.querySelector('h2').innerText = name;

	exercises.appendChild(clone);

	// get exercise
	const exercise =
		exercises.querySelectorAll('[data-exercise-id]')[
			exercises.querySelectorAll('[data-exercise-id]').length - 1
		];

	// get set
	const set =
		exercise.querySelectorAll('[data-set]')[
			exercise.querySelectorAll('[data-set]').length - 1
		];

	// add events
	exercise
		.querySelector('[data-add-set]')
		.addEventListener('click', (event) => {
			addSet(event.target);
		});

	addSetEvents(set);
};

/**
 * Add the classes to mark the set as complete based on the checkbox state
 *
 * @param {Element} checkbox the pressed checkbox
 * @param {Element} set the set the checkbox is apart of
 */
const completeSet = (checkbox, set) => {
	if (checkbox.checked) {
		set.classList.add('bg-green-100');
	} else {
		set.classList.remove('bg-green-100');
	}

	set.querySelectorAll('input[type=number]').forEach((input) => {
		const inputClasses = ['bg-green-200', 'text-green-800'];

		if (checkbox.checked) {
			input.classList.add(...inputClasses);
		} else {
			input.classList.remove(...inputClasses);
		}
	});
};

/**
 * Add a set to the excerise parent of the addSetButton
 *
 * @param {Element} addSetButton the pressed button
 */
const addSet = (addSetButton) => {
	const exercise = addSetButton.parentNode;
	const clone = setTemplate.content.cloneNode(true);

	// fill set data
	clone.querySelector('[data-set-number]').innerText =
		exercise.querySelectorAll('[data-set]').length + 1;

	// append to set rows
	exercise.querySelector('[data-set-rows]').appendChild(clone);

	const set =
		exercise.querySelectorAll('[data-set]')[
			exercise.querySelectorAll('[data-set]').length - 1
		];

	addSetEvents(set);
};

/**
 * Remove the set and remove the excsersise if no more sets are found
 *
 * @param {Element} set the set you want to remove
 * @returns void
 */
const removeSet = (set) => {
	let exercise = getexerciseFromChild(set);

	set.remove();

	// remove exercise if there are 0 sets
	const sets = exercise.querySelectorAll('[data-set]');
	if (sets.length === 0) {
		exercise.remove();
		return;
	}

	// reorder the set numbers
	for (let i = 0; i < sets.length; i++) {
		sets[i].querySelector('[data-set-number]').innerText = i + 1;
	}
};



// open modal
document.querySelector('[data-add-exercise]').addEventListener('click', () => {
	document.querySelector('[data-exercise-picker]').classList.remove('hidden');
});

// close modal
document.querySelector('[data-modal-toggle]').addEventListener('click', () => {
	document.querySelector('[data-exercise-picker]').classList.add('hidden');
});

// add event to all excerises in the picker to add the clicked exercise
document.querySelectorAll('[data-exercise-pick]').forEach((exceresise) => {
	exceresise.addEventListener('click', () => {
		const id = exceresise.getAttribute('data-exercise-pick');
		const name = exceresise.querySelector('span').innerText;

		addexercise(id, name);

		document
			.querySelector('[data-exercise-picker]')
			.classList.add('hidden');
	});
});
