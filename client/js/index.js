// if logout button is available add the logout event
if (document.querySelector('[data-logout]') !== null) {
    document.querySelector('[data-logout]').addEventListener('click', () => {
        fetch('/logout', {
            method: 'DELETE',
        }).then((res) => {
            window.location.href = res.url;
        });
    });
}

