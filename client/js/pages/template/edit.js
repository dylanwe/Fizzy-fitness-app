/**
 * Send the template to the controller to be uploaded to the database
 *
 * @param {Object} template the template you want to upload
 */
const postTemplate = async (template) => {
    const templateId = document.querySelector('[data-template]').getAttribute('data-template');

	const resp = await fetch(
		`http://localhost:3000/dashboard/workout/template/${templateId}`,
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
document.querySelector('[data-save]').addEventListener('click', async () => {
	const template = getFormData();

	if (template.sets.length != 0 && template.name != '') {
		await postTemplate(template);
	}
});