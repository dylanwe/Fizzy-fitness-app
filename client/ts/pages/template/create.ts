/**
 * Send the template to the controller to be uploaded to the database
 *
 * @param template the template you want to upload
 */
//@ts-ignore
 const postTemplate = async (template: workoutFormData) => {
	const resp = await fetch(
		'/dashboard/workout/template',
		{
			method: 'POST',
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
