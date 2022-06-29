// get templates and excersises body
const excersiseTemplate = document.querySelector('#excersise');
const setTemplate = document.querySelector('#set');
const excersises = document.querySelector('[data-excersises]');

/**
 * Get the parent excersise of the give child
 *
 * @param {Element} child the child element you want the parent excersise for
 * @returns the excersise above the given child
 */
const getExcersiseFromChild = (child) => {
	let excersise = child;

	// find set excersise parent
	while (!excersise.hasAttribute('data-excersise-id')) {
		excersise = excersise.parentNode;
	}

	return excersise;
};

/**
 * Add the completeSet and removeSet events
 *
 * @param {Element} set the set you want to add events to
 */
const addSetEvents = (set) => {
	set.querySelector('[data-checkbox]').addEventListener('click', (event) =>
		completeSet(event.target, set)
	);

	set.querySelector('[data-remove]').addEventListener('click', () =>
		removeSet(set)
	);
};

/**
 * Add an excersise to the form
 *
 * @param {number} id the id of the excersise in the database
 * @param {string} name the name of the excersise
 */
const addExcersise = (id, name) => {
	const clone = excersiseTemplate.content.cloneNode(true);

	clone
		.querySelector('[data-excersise-id]')
		.setAttribute('data-excersise-id', id);
	clone.querySelector('h2').innerText = name;

	excersises.appendChild(clone);

	// get excersise
	const excersise = excersises.querySelectorAll('[data-excersise-id]')[
		excersises.querySelectorAll('[data-excersise-id]').length - 1
	];

	// get set
	const set =
		excersise.querySelectorAll('[data-set]')[
			excersise.querySelectorAll('[data-set]').length - 1
		];

	// add events
	excersise
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
	const excersise = addSetButton.parentNode;
	const clone = setTemplate.content.cloneNode(true);

	// fill set data
	clone.querySelector('[data-set-number]').innerText =
		excersise.querySelectorAll('[data-set]').length + 1;

	// append to set rows
	excersise.querySelector('[data-set-rows]').appendChild(clone);

	const set =
		excersise.querySelectorAll('[data-set]')[
			excersise.querySelectorAll('[data-set]').length - 1
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
	let excersise = getExcersiseFromChild(set);

	set.remove();

	// remove excersise if there are 0 sets
	const sets = excersise.querySelectorAll('[data-set]');
	if (sets.length === 0) {
		excersise.remove();
		return;
	}

	// reorder the set numbers
	for (let i = 0; i < sets.length; i++) {
		sets[i].querySelector('[data-set-number]').innerText = i + 1;
	}
};

// open modal
document.querySelector('[data-add-excersise]').addEventListener('click', () => {
	document
		.querySelector('[data-excersise-picker]')
		.classList.remove('hidden');
});

// close modal
document.querySelector('[data-modal-toggle]').addEventListener('click', () => {
	document.querySelector('[data-excersise-picker]').classList.add('hidden');
});

// add event to all excerises in the picker to add the clicked excersise
document.querySelectorAll('[data-excersise-pick]').forEach((exceresise) => {
	exceresise.addEventListener('click', () => {
		const id = exceresise.getAttribute('data-excersise-pick');
		const name = exceresise.querySelector('span').innerText;

		addExcersise(id, name);

		document
			.querySelector('[data-excersise-picker]')
			.classList.add('hidden');
	});
});
