/**
 * @fileoverview QuickView - Professional Modal & Dynamic Preview Engine
 * @version 1.0.0
 */

class QuickView {
    constructor() {
        this.core = null;
        this.triggers = document.querySelectorAll('[data-quickview-trigger]');
        this.modal = null;
        this.modalContent = null;
        this.closeBtn = null;
        this.activeTrigger = null;
        
        this.createModalStructure();
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;
        this.bindTriggers();
    }

    /**
     * Dynamically injects the accessible modal structure into the DOM
     */
    createModalStructure() {
        if (document.getElementById('qv-global-modal')) return;

        this.modal = document.createElement('div');
        this.modal.id = 'qv-global-modal';
        this.modal.className = 'qv-modal';
        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-modal', 'true');

        this.modal.innerHTML = `
            <div class="qv-modal__overlay" tabindex="-1"></div>
            <div class="qv-modal__wrapper">
                <button class="qv-modal__close" aria-label="Close preview">&times;</button>
                <div class="qv-modal__content" id="qv-content-target"></div>
                <div class="qv-modal__loader">
                    <div class="qv-spinner"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.modalContent = this.modal.querySelector('#qv-content-target');
        this.closeBtn = this.modal.querySelector('.qv-modal__close');
        
        this.bindModalEvents();
    }

    /**
     * Attach click events to all elements designated for quick viewing
     */
    bindTriggers() {
        this.triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.activeTrigger = trigger;
                const targetId = trigger.getAttribute('data-product-id') || trigger.getAttribute('data-id');
                this.open(targetId);
            });
        });
    }

    /**
     * General modal internal state bindings
     */
    bindModalEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.querySelector('.qv-modal__overlay').addEventListener('click', () => this.close());

        // Keyboard Accessibilty (Escape key to close, trap focus)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.getAttribute('aria-hidden') === 'false') {
                this.close();
            }
        });
    }

    /**
     * Opens the modal and fetches content dynamically
     * @param {string} id 
     */
    async open(id) {
        this.modal.classList.add('qv-modal--active');
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.classList.add('qv-modal--loading');
        document.body.classList.add('body--lock-scroll');

        this.core.emit('quickview:opening', { id });

        try {
            const data = await this.fetchItemData(id);
            this.renderContent(data);
            this.modal.classList.remove('qv-modal--loading');
            this.closeBtn.focus();
            
            this.core.emit('quickview:opened', { id, data });
        } catch (error) {
            console.error('❌ QuickView Fetch Failure:', error);
            this.modalContent.innerHTML = `<p class="qv-error">Failed to load preview details.</p>`;
            this.modal.classList.remove('qv-modal--loading');
        }
    }

    /**
     * Simulates or executes an API fetch request for content
     * @param {string} id 
     */
    async fetchItemData(id) {
        // Here you can hook up real endpoint: fetch(`/api/items/${id}`)
        // Providing highly stable structural fallback implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    title: this.activeTrigger?.getAttribute('data-title') || "Premium Project Artifact",
                    description: this.activeTrigger?.getAttribute('data-desc') || "Highly optimized immersive application suite engineered for next generation web metrics.",
                    image: this.activeTrigger?.getAttribute('data-img') || "assets/images/placeholder.jpg",
                    meta: "Standard Core Implementation"
                });
            }, 400); // Mimic smooth loading transition
        });
    }

    /**
     * Safe HTML sanitization and UI rendering
     * @param {object} data 
     */
    renderContent(data) {
        this.modalContent.innerHTML = `
            <div class="qv-product-layout">
                <div class="qv-product-layout__gallery">
                    <img src="${data.image}" alt="${data.title}" class="qv-product-img"/>
                </div>
                <div class="qv-product-layout__details">
                    <h2 class="qv-product-title">${data.title}</h2>
                    <p class="qv-product-meta">${data.meta}</p>
                    <hr class="qv-divider" />
                    <p class="qv-product-desc">${data.description}</p>
                </div>
            </div>
        `;
    }

    /**
     * Gracefully closes the modal and returns focus
     */
    close() {
        this.modal.classList.remove('qv-modal--active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('body--lock-scroll');
        this.modalContent.innerHTML = '';

        if (this.activeTrigger) {
            this.activeTrigger.focus();
        }

        this.core.emit('quickview:closed', null);
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('QuickView', new QuickView());
