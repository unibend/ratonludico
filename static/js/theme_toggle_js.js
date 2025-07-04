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
  });