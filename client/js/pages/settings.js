const form = document.querySelector('form');

// reset form on load
form.reset();

/**
 * Show an error and it's text
 * @param {HTMLElement} element The parent element of the input
 * @param {boolean} showError if you want to show the error or not
 * @param {string} text the text to be displayed
 */
const inputError = (element, showError, text = '') => {
    const badInputClasses = ['bg-red-50', 'border-red-500', 'text-red-900', 'focus:ring-red-500', 'focus:border-red-500'];

    if (showError) {
        element.querySelector('[data-label]').classList.add('text-red-600');
        element.querySelector('[data-input]').classList.add(...badInputClasses);
        element.querySelector('[data-error]').innerText = text;
        element.querySelector('[data-error]').classList.remove('hidden');
    } else {
        element.querySelector('[data-label]').classList.remove('text-red-600');
        element.querySelector('[data-input]').classList.remove(...badInputClasses);
        element.querySelector('[data-error]').classList.add('hidden');
    }
    
}

/**
 * Basic validation for the settings form
 */
const validation = {
    emailValidation: () => {
        const mailRegex = /\S+@\S+\.\S+/;
        form.querySelector('input[name=email]').addEventListener('keyup', (e) => {
            const input = e.target;
            input.value = input.value.replace(/\s/g, '');

            if (mailRegex.test(input.value)) {
                inputError(form.querySelector('[data-input="email"]'), false);
            } else {
                inputError(form.querySelector('[data-input="email"]'), true, 'Please fill in a valid email');
            }
        })
    },

    usernameValidation: () => {
        form.querySelector('input[name=username]').addEventListener('keyup', (e) => {
            const input = e.target;
            input.value = input.value.replace(/\s/g, '');

            if (input.value.length >= 6) {
                inputError(form.querySelector('[data-input="username"]'), false);
            } else {
                inputError(form.querySelector('[data-input="username"]'), true, 'Username must be longer than 6 charachters');
            }
        })
    },

    newPasswordValidation: () => {
        form.querySelector('input[name=newPassword]').addEventListener('keyup', (e) => {
            const input = e.target;
            input.value = input.value.replace(/\s/g, '');

            if (input.value.length > 0 && input.value.length < 8) {
                inputError(form.querySelector('[data-input="newPassword"]'), true, 'Password must be longer than 8 charachters');
            } else {
                form.querySelector('button').removeAttribute('disabled');
                inputError(form.querySelector('[data-input="newPassword"]'), false);
            }
        })
    },

    /**
     * Validate the password field
     */
    passwordValidation: () => {
        form.querySelector('input[name=password]').addEventListener('keyup', (e) => {
            const input = e.target;
            input.value = input.value.replace(/\s/g, '');

            if (input.value.length === 0 ) {
                form.querySelector('button').setAttribute('disabled', '');
                inputError(form.querySelector('[data-input="password"]'), true, 'Password must be filled in');
            } else {
                form.querySelector('button').removeAttribute('disabled');
                inputError(form.querySelector('[data-input="password"]'), false);
            }
        });
    },

    validate: () => {
        validation.emailValidation();
        validation.usernameValidation();
        validation.newPasswordValidation();
        validation.passwordValidation();
    }
}

// enable validation
validation.validate();

/**
 * Show spinner icon
 * 
 * @param {boolean} show if it should show the spinner icon
 */
const saveSpinner = (show) => {
    if (show) {
        document.querySelector('[data-spinner]').classList.remove('hidden');
        document.querySelector('[data-save-icon]').classList.add('hidden');
    } else {
        document.querySelector('[data-spinner]').classList.add('hidden');
        document.querySelector('[data-save-icon]').classList.remove('hidden');
    }
}

const errorExists = () => {
    for (const errorField of document.querySelectorAll('[data-error]')) {
        if (!errorField.classList.contains('hidden')) {
            return true;
        }
    }

    return false;
}

const saveSettings = async () => {
    // add spinner to button
    saveSpinner(true);

    const formData = new FormData(form);
    let data = {};

    // collect all form data into a new neat data object
    for (const [key, value] of formData) {
        if (value) {
            data[key] = value;    
        }
    }

    const resp = await fetch(
        `/dashboard/settings`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );

    if (resp.status === 200) {
        console.log('SAVED!');
    } else {
        const { errors } = await resp.json();

        for (const error of errors) {
            inputError(form.querySelector(`[data-input="${error.field}"]`), true, error.error);
        }
    }

    // remove spinner
    saveSpinner(false);
}

document.querySelector('[data-save-settings]').addEventListener('click', async () => {
    if (!errorExists()) {
        saveSettings();
    }
});