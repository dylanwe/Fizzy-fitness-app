// add nav toggle button for non signin pages
document.querySelector('[data-nav-toggle]')?.addEventListener('click', () => {
	document.querySelector('[data-nav]')!.classList.toggle('hidden');
});

// if logout button is available add the logout event
document.querySelector('[data-logout]')?.addEventListener('click', () => {
	fetch('/logout', {
		method: 'DELETE',
	}).then((res) => {
		window.location.href = res.url;
	});
});

// open sidebar on small formats
document.querySelector('[data-open-sidebar]')?.addEventListener('click', () => {
	document.querySelector('[data-sidebar-content]')?.classList.add('flex');
	document.querySelector('[data-sidebar-content]')?.classList.remove('hidden');
});

// close sidebar on small formats
document
	.querySelector('[data-close-sidebar]')
	?.addEventListener('click', () => {
		document.querySelector('[data-sidebar-content]')?.classList.remove('flex');
		document.querySelector('[data-sidebar-content]')?.classList.add('hidden');
	});