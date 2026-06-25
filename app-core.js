/**
 * @fileoverview AppCore - Central Orchestrator & Event Bus
 * @version 1.0.0
 */

class AppCore {
    constructor() {
        if (AppCore.instance) {
            return AppCore.instance;
        }
        AppCore.instance = this;

        this.events = {};
        this.modules = new Map();
        this.isInitialized = false;

        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    /**
     * Initialize all registered modules safely
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('%c🚀 AppCore: Initialization started...', 'color: #00ffcc; font-weight: bold;');
        
        this.modules.forEach((moduleInstance, moduleName) => {
            try {
                if (typeof moduleInstance.init === 'function') {
                    moduleInstance.init(this);
                    console.log(`%c[Module] ${moduleName} initialized successfully.`, 'color: #a3be8c');
                }
            } catch (error) {
                console.error(`❌ [Module Error] Failed to initialize ${moduleName}:`, error);
            }
        });

        this.isInitialized = true;
        this.emit('core:ready', null);
    }

    /**
     * Register a functional module into the core ecosystem
     * @param {string} name 
     * @param {object} instance 
     */
    registerModule(name, instance) {
        if (this.modules.has(name)) {
            console.warn(`⚠️ Module ${name} is already registered.`);
            return;
        }
        this.modules.set(name, instance);
        if (this.isInitialized && typeof instance.init === 'function') {
            instance.init(this);
        }
    }

    /**
     * Subscribe to a core event
     * @param {string} event 
     * @param {Function} callback 
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Unsubscribe from a core event
     * @param {string} event 
     * @param {Function} callback 
     */
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    /**
     * Emit an event globally to all subscribers
     * @param {string} event 
     * @param {any} data 
     */
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`❌ [Event Error] Exception in subscriber for "${event}":`, error);
            }
        });
    }

    /**
     * Direct helper to get any active module instance
     * @param {string} name 
     */
    getModule(name) {
        return this.modules.get(name);
    }
}

// Global initialization of the core
const appCore = new AppCore();
window.AppCore = appCore; // Expose globally for module attachment
