const form = document.getElementById('accountHandling');
const username = document.getElementById('loginUser');
const password = document.getElementById('loginPassword');
const email = document.getElementById('loginEmail');
const error = document.getElementById('error');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.textContent = "";

        try {
            username.value = validateString(username.value, 'Username');
            password.value = validateString(password.value, 'Password');
            if (email) {
                email.value = validateEmailAddress(email.value, 'Email');
            };

        } catch (e) {
            e.preventDefault();
            error.textContent = e;
        }
    });
}