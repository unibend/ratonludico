// ===== Selector de temas (theme toggle) =====

class ThemeToggle {
    constructor() {
        this.init();
    }

    init() {
        // Crear el elemento del toggle
        this.createToggleElement();
        
        // Obtener tema guardado o usar oscuro por defecto
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Aplicar tema inicial
        this.setTheme(this.currentTheme);
        
        // Añadir event listeners
        this.addEventListeners();
        
        // Añadir animación de entrada
        this.animateToggleEntry();
    }

    createToggleElement() {
        // Buscar la navegación donde insertaremos el toggle
        const navbar = document.querySelector('.navbar-nav');
        
        if (navbar) {
            // Crear el HTML del toggle
            const toggleHTML = `
                <li class="nav-item theme-toggle">
                    <div class="theme-toggle-btn" id="themeToggle" role="button" tabindex="0" aria-label="Cambiar tema">
                        <div class="theme-toggle-slider">
                            <span class="sun-icon">☀️</span>
                            <span class="moon-icon">🌙</span>
                        </div>
                    </div>
                </li>
            `;
            
            // Insertar al final de la lista de navegación
            navbar.insertAdjacentHTML('beforeend', toggleHTML);
            
            // Guardar referencia al elemento
            this.toggleElement = document.getElementById('themeToggle');
        }
    }

    addEventListeners() {
        if (this.toggleElement) {
            // Click del mouse
            this.toggleElement.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // Navegación por teclado
            this.toggleElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        // Detectar cambios en las preferencias del sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener((e) => {
            // Solo cambiar automáticamente si no hay preferencia guardada
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        // Cambiar entre temas
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        
        // Aplicar nuevo tema
        this.setTheme(this.currentTheme);
        
        // Guardar preferencia
        localStorage.setItem('theme', this.currentTheme);
        
        // Añadir animación al toggle
        this.animateToggle();
        
        // Disparar evento personalizado para otros componentes
        this.dispatchThemeChangeEvent();
    }

    setTheme(theme) {
        const root = document.documentElement;
        
        // Remover tema anterior
        root.removeAttribute('data-theme');
        
        // Aplicar nuevo tema
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        }
        
        // Actualizar tema actual
        this.currentTheme = theme;
        
        // Actualizar atributos de accesibilidad
        if (this.toggleElement) {
            this.toggleElement.setAttribute('aria-label', 
                theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
            );
        }
    }

    animateToggle() {
        if (this.toggleElement) {
            // Añadir clase de animación
            this.toggleElement.classList.add('toggle-clicked');
            
            // Remover clase después de la animación
            setTimeout(() => {
                this.toggleElement.classList.remove('toggle-clicked');
            }, 300);
        }
    }

    animateToggleEntry() {
        if (this.toggleElement) {
            // Añadir animación de entrada
            this.toggleElement.style.opacity = '0';
            this.toggleElement.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.toggleElement.style.transition = 'all 0.3s ease';
                this.toggleElement.style.opacity = '1';
                this.toggleElement.style.transform = 'scale(1)';
            }, 500);
        }
    }

    dispatchThemeChangeEvent() {
        // Crear evento personalizado
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                timestamp: Date.now()
            }
        });
        
        // Disparar evento
        document.dispatchEvent(event);
    }

    // Método público para obtener el tema actual
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Método público para establecer tema programáticamente
    setThemeProgrammatically(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.setTheme(theme);
            localStorage.setItem('theme', theme);
        }
    }
}

// ===== CSS ADICIONAL PARA ANIMACIONES DEL TOGGLE =====
const toggleAnimationStyles = `
    <style>
    .theme-toggle-btn.toggle-clicked {
        transform: scale(0.95);
    }
    
    .theme-toggle-btn.toggle-clicked .theme-toggle-slider {
        box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
    }
    
    /* Animación de pulso para el toggle */
    @keyframes togglePulse {
        0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
    }
    
    .theme-toggle-btn:focus {
        animation: togglePulse 1.5s infinite;
        outline: none;
    }
    
    /* Mejoras visuales específicas para el toggle */
    .theme-toggle {
        display: flex;
        align-items: center;
    }
    
    .theme-toggle-btn {
        cursor: pointer;
        user-select: none;
    }
    
    .theme-toggle-btn:active {
        transform: scale(0.98);
    }
    
    /* Tooltip para el toggle */
    .theme-toggle-btn::after {
        content: attr(aria-label);
        position: absolute;
        bottom: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.8rem;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: all var(--transition-fast);
        border: 1px solid var(--border-color);
        z-index: 1000;
    }
    
    .theme-toggle-btn:hover::after {
        opacity: 1;
        transform: translateX(-50%) translateY(-2px);
    }
    
    /* Responsive para móviles */
    @media (max-width: 768px) {
        .theme-toggle {
            margin-left: 0;
            margin-top: 0.5rem;
        }
        
        .theme-toggle-btn::after {
            display: none;
        }
    }
    </style>
`;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Insertar estilos adicionales
    document.head.insertAdjacentHTML('beforeend', toggleAnimationStyles);
    
    // Inicializar toggle de tema
    window.themeToggle = new ThemeToggle();
    
    // Event listener para cambios de tema (opcional para otros componentes)
    document.addEventListener('themeChanged', function(e) {
        console.log(`Tema cambiado a: ${e.detail.theme}`);
        
        // Aquí puedes añadir lógica adicional cuando el tema cambie
        // Por ejemplo, cambiar iconos, actualizar gráficos, etc.
    });
});

// ===== UTILIDADES ADICIONALES =====

// Función para detectar preferencia del sistema
function getSystemThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Función para aplicar tema automático basado en la hora
function getTimeBasedTheme() {
    const hour = new Date().getHours();
    return (hour >= 19 || hour < 7) ? 'dark' : 'light';
}

// Exportar para uso en otros scripts si es necesario
window.ThemeToggleUtils = {
    getSystemThemePreference,
    getTimeBasedTheme
};

class MusicPlayer {
  constructor() {
    this.audio = document.getElementById('gameSoundtrack');
    this.tracks = document.querySelectorAll('.track');
    this.playBtn = document.getElementById('playBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.volumeControl = document.getElementById('volumeControl');
    this.currentTimeDisplay = document.getElementById('currentTime');
    this.durationDisplay = document.getElementById('duration');
    
    this.init();
  }
  
  init() {
    // Configurar event listeners
    this.setupEventListeners();
    
    // Actualizar controles iniciales
    this.updateControls();
    
    // Configurar tema inicial
    this.updateTheme();
    
    // Escuchar cambios de tema
    document.addEventListener('themeChanged', () => this.updateTheme());
  }
  
  setupEventListeners() {
    // Control de pistas
    this.tracks.forEach(track => {
      track.addEventListener('click', () => this.playTrack(track));
    });
    
    // Controles de reproducción
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.audio.play());
    }
    
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.audio.pause());
    }
    
    // Control de volumen
    if (this.volumeControl) {
      this.volumeControl.addEventListener('input', () => {
        this.audio.volume = this.volumeControl.value;
      });
    }
    
    // Actualizar tiempo de reproducción
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
    });
    
    // Actualizar duración cuando los metadatos estén cargados
    this.audio.addEventListener('loadedmetadata', () => {
      this.durationDisplay.textContent = this.formatTime(this.audio.duration);
    });
    
    // Actualizar controles cuando cambia el estado de reproducción
    this.audio.addEventListener('play', () => this.updateControls());
    this.audio.addEventListener('pause', () => this.updateControls());
    this.audio.addEventListener('ended', () => this.playNextTrack());
  }
  
  playTrack(track) {
    // Remover clase active de todas las pistas
    this.tracks.forEach(t => t.classList.remove('active'));
    
    // Añadir clase active a la pista seleccionada
    track.classList.add('active');
    
    // Aquí deberías cambiar la fuente de audio según la pista seleccionada
    // this.audio.src = track.dataset.src;
    
    // Reproducir automáticamente
    this.audio.play().catch(e => console.log('Autoplay prevented:', e));
  }
  
  playNextTrack() {
    const currentActive = document.querySelector('.track.active');
    if (!currentActive) return;
    
    const nextTrack = currentActive.nextElementSibling || this.tracks[0];
    this.playTrack(nextTrack);
  }
  
  updateControls() {
    if (!this.playBtn || !this.pauseBtn) return;
    
    if (this.audio.paused) {
      this.playBtn.style.display = 'block';
      this.pauseBtn.style.display = 'none';
    } else {
      this.playBtn.style.display = 'none';
      this.pauseBtn.style.display = 'block';
    }
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  updateTheme() {
    // Actualizar cualquier elemento específico del tema aquí
    const player = document.querySelector('.music-player-container');
    if (player) {
      player.style.setProperty('background', 'var(--bg-card)');
      player.style.setProperty('border-color', 'var(--border-color)');
    }
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar reproductor de música si existe
  if (document.getElementById('gameSoundtrack')) {
    window.musicPlayer = new MusicPlayer();
  }
  })

  // ===== SISTEMA DE VALIDACIÓN DE DATOS =====

class FormValidator {
    constructor(formSelector, options = {}) {
        this.form = document.querySelector(formSelector);
        this.options = {
            showErrorsOnSubmit: true,
            showErrorsOnBlur: true,
            showErrorsOnInput: false,
            errorClass: 'error',
            successClass: 'success',
            errorMessageClass: 'error-message',
            ...options
        };
        
        this.rules = {};
        this.errors = {};
        this.isValid = false;
        
        this.init();
    }
    
    init() {
        if (!this.form) {
            console.error('Formulario no encontrado');
            return;
        }
        
        this.setupEventListeners();
        this.createErrorElements();
    }
    
    setupEventListeners() {
        // Validar en el envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar el formulario
            this.validateForm();
            
            if (this.isValid) {
                // Si es válido, proceder con el envío
                this.onSuccess();
            } else {
                // Si no es válido, mostrar errores
                this.onError();
            }
        });
        
        // Validar campos individualmente
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (this.options.showErrorsOnBlur) {
                input.addEventListener('blur', () => {
                    this.validateField(input.name);
                });
            }
            
            if (this.options.showErrorsOnInput) {
                input.addEventListener('input', () => {
                    this.validateField(input.name);
                });
            }
        });
    }
    
    // Método para añadir reglas de validación
    addRule(fieldName, rules) {
        this.rules[fieldName] = rules;
        return this;
    }
    
    // Método para validar un campo específico
    validateField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field || !this.rules[fieldName]) return true;
        
        const value = field.value.trim();
        const rules = this.rules[fieldName];
        
        // Limpiar errores anteriores
        delete this.errors[fieldName];
        
        // Aplicar cada regla
        for (const rule of rules) {
            const result = this.applyRule(value, rule, field);
            if (!result.isValid) {
                this.errors[fieldName] = result.message;
                this.showFieldError(fieldName, result.message);
                return false;
            }
        }
        
        this.showFieldSuccess(fieldName);
        return true;
    }
    
    // Método para aplicar una regla específica
    applyRule(value, rule, field) {
        switch (rule.type) {
            case 'required':
                return {
                    isValid: value.length > 0,
                    message: rule.message || 'Este campo es obligatorio'
                };
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return {
                    isValid: !value || emailRegex.test(value),
                    message: rule.message || 'Ingrese un email válido'
                };
                
            case 'minLength':
                return {
                    isValid: value.length >= rule.value,
                    message: rule.message || `Mínimo ${rule.value} caracteres`
                };
                
            case 'maxLength':
                return {
                    isValid: value.length <= rule.value,
                    message: rule.message || `Máximo ${rule.value} caracteres`
                };
                
            case 'pattern':
                const regex = new RegExp(rule.value);
                return {
                    isValid: regex.test(value),
                    message: rule.message || 'Formato inválido'
                };
                
            case 'numeric':
                const numericRegex = /^[0-9]+$/;
                return {
                    isValid: !value || numericRegex.test(value),
                    message: rule.message || 'Solo se permiten números'
                };
                
            case 'alphanumeric':
                const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
                return {
                    isValid: !value || alphanumericRegex.test(value),
                    message: rule.message || 'Solo se permiten letras y números'
                };
                
            case 'phone':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                return {
                    isValid: !value || phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')),
                    message: rule.message || 'Ingrese un teléfono válido'
                };
                
            case 'custom':
                return {
                    isValid: rule.validator(value, field),
                    message: rule.message || 'Valor inválido'
                };
                
            case 'match':
                const matchField = this.form.querySelector(`[name="${rule.field}"]`);
                return {
                    isValid: value === matchField.value,
                    message: rule.message || 'Los campos no coinciden'
                };
                
            default:
                return { isValid: true, message: '' };
        }
    }
    
    // Método para validar todo el formulario
    validateForm() {
        this.errors = {};
        this.isValid = true;
        
        for (const fieldName in this.rules) {
            if (!this.validateField(fieldName)) {
                this.isValid = false;
            }
        }
        
        return this.isValid;
    }
    
    // Crear elementos para mostrar errores
    createErrorElements() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.name && !input.parentElement.querySelector('.error-message')) {
                const errorElement = document.createElement('div');
                errorElement.className = this.options.errorMessageClass;
                errorElement.style.display = 'none';
                input.parentElement.appendChild(errorElement);
            }
        });
    }
    
    // Mostrar error en un campo específico
    showFieldError(fieldName, message) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (field && errorElement) {
            field.classList.add(this.options.errorClass);
            field.classList.remove(this.options.successClass);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Mostrar éxito en un campo específico
    showFieldSuccess(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (field && errorElement) {
            field.classList.remove(this.options.errorClass);
            field.classList.add(this.options.successClass);
            errorElement.style.display = 'none';
        }
    }
    
    // Limpiar todas las validaciones
    clearValidation() {
        this.errors = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.remove(this.options.errorClass, this.options.successClass);
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }
    
    // Método llamado cuando el formulario es válido
    onSuccess() {
        console.log('Formulario válido');
        this.showSuccessMessage('¡Formulario enviado correctamente!');
        
        // Enviar el formulario normalmente
        this.submitForm();
    }
    
    // Método llamado cuando el formulario tiene errores
    onError() {
        console.log('Formulario con errores:', this.errors);
        this.showErrorMessage('Por favor, corrige los errores en el formulario');
        
        // Scroll al primer error
        const firstError = this.form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Mostrar mensaje de éxito
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }
    
    // Mostrar mensaje de error
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    // Mostrar mensaje general
    showMessage(message, type) {
        // Remover mensajes anteriores
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crear nuevo mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insertar al inicio del formulario
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Método para obtener datos del formulario
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    // Método para enviar el formulario (personalizable)
    submitForm() {
        const data = this.getFormData();
        console.log('Enviando datos:', data);
        
        // Si el formulario tiene action y method, usar envío nativo
        if (this.form.action && this.form.method) {
            // Remover el preventDefault temporalmente para permitir el envío
            const originalSubmit = this.form.onsubmit;
            this.form.onsubmit = null;
            
            // Crear un nuevo evento de submit sin preventDefault
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            
            // Restaurar el handler original después del envío
            setTimeout(() => {
                this.form.onsubmit = originalSubmit;
            }, 100);
            
            // Enviar el formulario
            this.form.submit();
            
        } else {
            // Si no hay action/method, usar fetch para envío AJAX
            fetch(this.form.action || window.location.href, {
                method: this.form.method || 'POST',
                body: new FormData(this.form)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error en la respuesta del servidor');
            })
            .then(data => {
                console.log('Éxito:', data);
                this.showSuccessMessage('¡Datos guardados correctamente!');
            })
            .catch(error => {
                console.error('Error:', error);
                this.showErrorMessage('Error al enviar los datos. Intenta nuevamente.');
            });
        }
    }
}

// ===== VALIDACIONES PERSONALIZADAS =====

class CustomValidators {
    static strongPassword(value) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
        return strongRegex.test(value);
    }
    
    static notContains(value, forbidden) {
        return !value.toLowerCase().includes(forbidden.toLowerCase());
    }
    
    static futureDate(value) {
        const inputDate = new Date(value);
        const today = new Date();
        return inputDate > today;
    }
    
    static creditCard(value) {
        // Algoritmo de Luhn para validar tarjetas de crédito
        const cleanValue = value.replace(/\s/g, '');
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cleanValue.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanValue.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return sum % 10 === 0;
    }
}

// ===== ESTILOS CSS PARA LA VALIDACIÓN =====
const validationStyles = `
<style>
.error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.success {
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.form-message {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
}

.form-message.success {
    color: #155724;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
}

.form-message.error {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
}

/* Animaciones suaves */
.error, .success {
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.error-message {
    transition: opacity 0.3s ease;
}

.form-message {
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`;

// ===== INICIALIZACIÓN Y EJEMPLO DE USO =====
document.addEventListener('DOMContentLoaded', function() {
    // Insertar estilos
    document.head.insertAdjacentHTML('beforeend', validationStyles);
    
    // Inicializar validador para el formulario de usuario
    const userFormValidator = new FormValidator('form', {
        showErrorsOnBlur: true,
        showErrorsOnInput: false
    });
    
    // Configurar reglas de validación
    userFormValidator
        .addRule('nombre', [
            { type: 'required', message: 'El nombre es obligatorio' },
            { type: 'minLength', value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
            { type: 'maxLength', value: 50, message: 'El nombre no puede exceder 50 caracteres' },
            { type: 'alphanumeric', message: 'El nombre solo puede contener letras y números' }
        ])
        .addRule('correo', [
            { type: 'required', message: 'El correo es obligatorio' },
            { type: 'email', message: 'Ingrese un correo electrónico válido' },
            { type: 'maxLength', value: 100, message: 'El correo no puede exceder 100 caracteres' }
        ]);
    
    // Hacer disponible globalmente
    window.userFormValidator = userFormValidator;
    window.CustomValidators = CustomValidators;
});

// ===== FUNCIONES UTILITARIAS =====

// Función para validar múltiples formularios
function initializeMultipleValidators(formConfigs) {
    const validators = {};
    
    formConfigs.forEach(config => {
        const validator = new FormValidator(config.selector, config.options);
        
        // Añadir reglas
        if (config.rules) {
            for (const [fieldName, rules] of Object.entries(config.rules)) {
                validator.addRule(fieldName, rules);
            }
        }
        
        validators[config.name] = validator;
    });
    
    return validators;
}

// Función para validar un campo específico sin formulario
function validateSingleField(value, rules) {
    const tempValidator = new FormValidator(document.createElement('form'));
    
    for (const rule of rules) {
        const result = tempValidator.applyRule(value, rule);
        if (!result.isValid) {
            return result;
        }
    }
    
    return { isValid: true, message: '' };
}

// Exportar para uso global
window.FormValidator = FormValidator;
window.CustomValidators = CustomValidators;
window.initializeMultipleValidators = initializeMultipleValidators;
window.validateSingleField = validateSingleField;
