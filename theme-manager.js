/**
 * @fileoverview ThemeManager - Seamless Theme Management
 * @version 1.0.0
 */

class ThemeManager {
    constructor() {
        this.core = null;
        this.themeToggleBtn = document.querySelectorAll('.theme-btn, .dark-mode-toggle');
        this.currentTheme = 'light';
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;
        
        this.determineInitialTheme();
        this.setupToggleListeners();
        this.listenToSystemChanges();
    }

    /**
     * Figures out initial theme selection from localStorage or OS settings
     */
    determineInitialTheme() {
        const savedTheme = localStorage.getItem('site-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.applyTheme('dark');
        } else {
            this.applyTheme('light');
        }
    }

    /**
     * Applies the designated theme to DOM and signals core
     * @param {'light' | 'dark'} theme 
     */
    applyTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.remove('dark-mode');
        }

        this.updateToggleUI();
        localStorage.setItem('site-theme', theme);
        
        if (this.core) {
            this.core.emit('theme:changed', { theme: this.currentTheme });
        }
    }

    /**
     * Toggles between dark and light themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    /**
     * Binds click click listeners to all instances of theme selectors
     */
    setupToggleListeners() {
        if (this.themeToggleBtn.length === 0) return;

        this.themeToggleBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleTheme();
            });
        });
    }

    /**
     * Listens dynamically to global OS level color scheme changes
     */
    listenToSystemChanges() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only update dynamically if user has not overridden preference manually
            if (!localStorage.getItem('site-theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Syncs aria attributes and state for accessibility (a11y)
     */
    updateToggleUI() {
        this.themeToggleBtn.forEach(btn => {
            btn.setAttribute('aria-label', `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`);
            btn.setAttribute('aria-checked', this.currentTheme === 'dark' ? 'true' : 'false');
        });
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('ThemeManager', new ThemeManager());
