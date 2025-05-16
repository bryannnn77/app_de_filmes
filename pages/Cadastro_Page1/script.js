// Validação do Formulário de Cadastro
function setupRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            document.getElementById('emailError').style.display = 'none';
            document.getElementById('phoneError').style.display = 'none';
            document.getElementById('passwordError').style.display = 'none';
            
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
            if (senha.length < 8) {
                document.getElementById('passwordError').textContent = 'A senha deve ter pelo menos 6 caracteres';
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                alert('Cadastro realizado com sucesso!');
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1000);
            }
        });
        
        document.getElementById('telefone').addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }
}
