/**
 * Send the template to the controller to be uploaded to the database
 *
 * @param template the template you want to upload
 */
//@ts-ignore
 const postTemplate = async (template: workoutFormData) => {
	const templateId = document
		.querySelector('[data-template]')!
		.getAttribute('data-template');

	const resp = await fetch(
		`/dashboard/workout/template/${templateId}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: template.name, sets: template.sets }),
		}
	);

	if (resp.status === 200) {
		window.location.replace('/dashboard');
	}
};

// save data event
document.querySelector('[data-save]')!.addEventListener('click', async () => {
	const template = getFormData();

	if (template.sets.length != 0 && template.name != '') {
		await postTemplate(template);
	}
});

// delete template event
document.querySelector('[data-delete]')!.addEventListener('click', async () => {
	const templateId = parseInt(document.querySelector('[data-template]')!.getAttribute('data-template')!);

	const resp = await fetch(
		`/dashboard/workout/template/${templateId}`,
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	if (resp.status === 200) {
		window.location.replace('/dashboard');
	}
});