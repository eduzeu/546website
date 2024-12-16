const form = document.getElementById('accountHandling');
const username = document.getElementById('loginUser');
const password = document.getElementById('loginPassword');
const confirmPassword = document.getElementById('confirmPassword');
const email = document.getElementById('loginEmail');
const error = document.getElementById('error');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.textContent = "";

        try {
            console.log(username.value);
            username.value = validateString(username.value, 'Username');
            password.value = validateString(password.value, 'Password');
            
            if (email) {
                email.value = validateEmailAddress(email.value, 'Email');
            };
            if (confirmPassword) {
                confirmPassword.value = validateString(confirmPassword.value, 'Confirm Password');
                if(confirmPassword.value !== password.value){
                    throw 'Passwords do not match';
                }
            }

        } catch (err) {
            e.preventDefault();
            error.textContent = err;
        }
    });
}