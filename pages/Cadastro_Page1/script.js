document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('senha');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (togglePassword && passwordInput && eyeIcon) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                eyeIcon.innerHTML = '<path d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.77 9.77 0 0 1-8.82 5.5A9.77 9.77 0 0 1 3.18 11.5 9.77 9.77 0 0 1 12 6zm0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"/>';
            } else {
                eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
            
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const senha = document.getElementById('senha').value;
            
            let isValid = true;

            if (!email.includes('@') || !email.includes('.')) {
                document.getElementById('emailError').textContent = 'Por favor, insira um email válido';
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }
            if (!/^\d+$/.test(telefone)) {
                document.getElementById('phoneError').textContent = 'O telefone deve conter apenas números';
                document.getElementById('phoneError').style.display = 'block';
                isValid = false;
            }
            
            if (senha.length < 6) {
                document.getElementById('passwordError').textContent = 'A senha deve ter pelo menos 6 caracteres';
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }
        
            if (isValid) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = "/pages/Home_Page2/home.html";
            }
        });
        
        document.getElementById('telefone').addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }
});