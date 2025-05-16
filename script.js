document.addEventListener('DOMContentLoaded', function() {
    // Elementos do campo de senha
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('senha');
    const passwordIcon = togglePassword?.querySelector('svg');
    if (togglePassword && passwordInput && passwordIcon) {
        togglePassword.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            
            passwordInput.type = isPassword ? 'text' : 'password';
            
            if (isPassword) {
                passwordIcon.innerHTML = '<path d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.77 9.77 0 0 1-8.82 5.5A9.77 9.77 0 0 1 3.18 11.5 9.77 9.77 0 0 1 12 6zm0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"/>';
                passwordInput.style.backgroundColor = "#444";
            } else {
                passwordIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
                passwordInput.style.backgroundColor = "#333";
            }
        });
    }

    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            alert("Sucesso!");
            setTimeout(() => {
                window.location.href = "Pages/Home_Page2/home.html";
            }, 1000);
        });
    }

    const registerLink = document.querySelector('.register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = "Pages/Cadastro_Page1/cadastro.html";
        });
    }
});