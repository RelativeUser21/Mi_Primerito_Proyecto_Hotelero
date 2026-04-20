/**
 * Lógica para la página de recuperación de contraseña
 */

let currentStep = 1;
let recoveryEmail = '';
let recoveryToken = '';

// Elementos del DOM
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

const step1Form = document.getElementById('step1Form');
const step2Form = document.getElementById('step2Form');
const step3Form = document.getElementById('step3Form');

const step1Message = document.getElementById('step1Message');
const step2Message = document.getElementById('step2Message');
const step3Message = document.getElementById('step3Message');

const step1Btn = document.getElementById('step1Btn');
const step2Btn = document.getElementById('step2Btn');
const step3Btn = document.getElementById('step3Btn');

const step2Back = document.getElementById('step2Back');
const step3Back = document.getElementById('step3Back');

const emailInput = document.getElementById('email');
const codeInput = document.getElementById('code');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

/**
 * Mostrar mensaje en la sección actual
 */
function showMessage(messageEl, text, isError = false) {
    messageEl.textContent = text;
    messageEl.className = `hidden text-sm p-3 rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    messageEl.classList.remove('hidden');
}

/**
 * Cambiar al siguiente paso
 */
function goToStep(step) {
    currentStep = step;
    
    // Ocultar todos los pasos
    step1.classList.add('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    
    // Mostrar el paso actual
    if (step === 1) step1.classList.remove('hidden');
    if (step === 2) step2.classList.remove('hidden');
    if (step === 3) step3.classList.remove('hidden');
    
    // Limpiar mensajes
    step1Message.classList.add('hidden');
    step2Message.classList.add('hidden');
    step3Message.classList.add('hidden');
}

/**
 * PASO 1: Solicitar código
 */
step1Form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage(step1Message, 'Por favor ingresa tu correo electrónico', true);
        return;
    }
    
    try {
        step1Btn.disabled = true;
        step1Btn.textContent = 'Enviando...';
        
        const response = await fetch('/api/password-reset/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok || data.success) {
            recoveryEmail = email;
            showMessage(step1Message, '✓ Código enviado a tu correo. Revisa tu bandeja de entrada.');
            setTimeout(() => {
                goToStep(2);
            }, 1500);
        } else {
            showMessage(step1Message, data.error || 'Error al enviar el código', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(step1Message, 'Error de conexión. Intenta de nuevo.', true);
    } finally {
        step1Btn.disabled = false;
        step1Btn.textContent = 'Enviar código';
    }
});

/**
 * PASO 2: Verificar código
 */
step2Form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const code = codeInput.value.trim();
    
    if (!code || code.length !== 6) {
        showMessage(step2Message, 'Por favor ingresa un código de 6 dígitos', true);
        return;
    }
    
    if (!/^\d{6}$/.test(code)) {
        showMessage(step2Message, 'El código debe contener solo números', true);
        return;
    }
    
    try {
        step2Btn.disabled = true;
        step2Btn.textContent = 'Verificando...';
        
        const response = await fetch('/api/password-reset/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: recoveryEmail,
                code: code
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            recoveryToken = data.token;
            showMessage(step2Message, '✓ Código verificado. Procede a cambiar tu contraseña.');
            setTimeout(() => {
                goToStep(3);
            }, 1500);
        } else {
            showMessage(step2Message, data.error || 'Código inválido o expirado', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(step2Message, 'Error de conexión. Intenta de nuevo.', true);
    } finally {
        step2Btn.disabled = false;
        step2Btn.textContent = 'Verificar';
    }
});

/**
 * PASO 3: Cambiar contraseña
 */
step3Form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validaciones
    if (!newPassword || newPassword.length < 6) {
        showMessage(step3Message, 'La contraseña debe tener al menos 6 caracteres', true);
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage(step3Message, 'Las contraseñas no coinciden', true);
        return;
    }
    
    try {
        step3Btn.disabled = true;
        step3Btn.textContent = 'Cambiando...';
        
        const response = await fetch('/api/password-reset/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: recoveryToken,
                newPassword: newPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(step3Message, '✓ ¡Contraseña cambiada exitosamente!');
            
            setTimeout(() => {
                // Redirigir al login después de 2 segundos
                window.location.href = '/index.html';
            }, 2000);
        } else {
            showMessage(step3Message, data.error || 'Error al cambiar la contraseña', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(step3Message, 'Error de conexión. Intenta de nuevo.', true);
    } finally {
        step3Btn.disabled = false;
        step3Btn.textContent = 'Cambiar Contraseña';
    }
});

/**
 * Botones para volver atrás
 */
step2Back.addEventListener('click', () => {
    codeInput.value = '';
    goToStep(1);
});

step3Back.addEventListener('click', () => {
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    goToStep(2);
});

/**
 * Permitir solo números en el input de código
 */
codeInput.addEventListener('keydown', (e) => {
    // Permitir teclas de control y números
    if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
    }
});
