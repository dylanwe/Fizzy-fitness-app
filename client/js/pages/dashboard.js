/**
 * Go to the given template
 *
 * @param {Event} e the click event
 * @param {string} templateId the id of the template you want to go to
 */
const editTemplate = (e, templateId) => {
	e.preventDefault();
	window.location.href = `/dashboard/workout/template/${templateId}`;
};

// add event to all edit buttons
document.querySelectorAll('[data-edit-template]').forEach((template) => {
	const templateId = template.getAttribute('data-edit-template');
	template.addEventListener('click', (event) =>
		editTemplate(event, templateId)
	);
});