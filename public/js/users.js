// (function ($) {
//     let form = $('#accountHandling');
//     let username = $('#loginUser');
//     let password = $('#loginPassword');
//     let email = $('#loginEmail');
//     let error = $('#error');

//     form.submit(function (event) {
//         event.preventDefault();

//         let isRegistration = true;
//         let usernameValue = username.value;
//         let passwordValue = password.value;
//         let emailValue = email ? email.value : null;
//         if(email == null){
//             isRegistration = false;
//         }
//         try {
//             usernameValue = validateString(usernameValue, 'Username');
//             passwordValue = validateString(passwordValue, 'Password');
//             if (emailValue) {
//                 emailValue = validateEmailAddress(email.value, 'Email');
//                 isRegistration = true;
//             };

//         } catch (e) {
//             error.text(e);
//             return;
//         }

//         const endpoint = isRegistration ? '/newAccount' : '/';
//         const credentials = {
//             username: usernameValue,
//             password: passwordValue,
//         };

//         if (isRegistration) {
//             credentials.email = emailValue;
//         }

//         $.ajax({
//             type: "POST",
//             url: endpoint,
//             headers: { 'Content-Type': 'application/json' },
//             data: JSON.stringify(credentials),
//             success: function (response) {
//                 if (isRegistration) {
//                     window.location.href = '/';
//                 } else {
//                     window.location.href = '/home';
//                 }
//             },
//             error: function (err) {
//                 error.text(err);
//             },
//             complete: function () {
//                 username.val('');
//                 password.val('');
//                 if (isRegistration) email.val('');
//             }
//         })
//     })
// })(jQuery);
const form = document.getElementById('accountHandling');
const username = document.getElementById('loginUser');
const password = document.getElementById('loginPassword');
const email = document.getElementById('loginEmail');
const error = document.getElementById('error');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isRegistration = true;
        let usernameValue = username.value;
        let passwordValue = password.value;
        let emailValue = email ? email.value : null;
        if(email == null){
            isRegistration = false;
        }
        // try {
        //     usernameValue = validateString(usernameValue, 'Username');
        //     passwordValue = validateString(passwordValue, 'Password');
        //     if (emailValue) {
        //         emailValue = validateEmailAddress(email.value, 'Email');
        //         isRegistration = true;
        //     };

        // } catch (e) {
        //     error.textContent = e;
        //     return;
        // }

        const endpoint = isRegistration ? '/newAccount' : '/';
        const credentials = {
            username: usernameValue,
            password: passwordValue,
        };

        if (isRegistration) {
            credentials.email = emailValue;
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