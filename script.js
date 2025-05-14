function redirectToRegister() {
    window.location.href = "Pages/Cadastro_Page1/cadastro.html";
}

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('senha');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                passwordInput.style.backgroundColor = "#555";
            } else {
                passwordInput.style.backgroundColor = "#333";
            }
        });
    }

    const registerLink = document.querySelector('.register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToRegister();
        });
    }
});