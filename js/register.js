document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');

    form.addEventListener('submit', function(event) {
        if (username.value.trim() === '' || password.value.trim() === '' || confirmPassword.value.trim() === '') {
            alert('Por favor, rellena todos los campos.');
            event.preventDefault();
        } else if (password.value !== confirmPassword.value) {
            alert('Las contraseñas no coinciden.');
            event.preventDefault();
        }
    });
});
