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