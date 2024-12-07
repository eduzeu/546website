const form = document.getElementById('accountHandling');
const username = document.getElementById('loginUser');
const password = document.getElementById('loginPassword');
const email = document.getElementById('loginEmail');
const error = document.getElementById('error');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isRegistration = true;
        if (email == null) {
            isRegistration = false;
        }
        const endpoint = isRegistration ? '/newAccount' : '/';
        const credentials = {
            username: username.value,
            password: password.value,
        };

        if (isRegistration) {
            credentials.email = email.value;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Something went wrong');
            }
            if (isRegistration) {
                window.location.href = '/';
            } else {
                window.location.href = '/home';
            }
        } catch (err) {
            error.textContent = err.message;
        } finally {
            username.value = '';
            password.value = '';
            if (isRegistration) email.value = '';
        }
    });
}