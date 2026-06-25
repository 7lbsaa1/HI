/**
 * @fileoverview PageTransition - High Performance SPA-like Transitions
 * @version 1.0.0
 */

class PageTransition {
    constructor() {
        this.core = null;
        this.overlay = null;
        this.isTransitioning = false;
        
        this.createTransitionOverlay();
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;
        this.interceptLinks();
        this.handlePopState();
    }

    /**
     * Inject a professional overlay element for visual transitions
     */
    createTransitionOverlay() {
        if (document.getElementById('pt-global-overlay')) return;

        this.overlay = document.createElement('div');
        this.overlay.id = 'pt-global-overlay';
        this.overlay.className = 'pt-overlay';
        this.overlay.setAttribute('aria-hidden', 'true');

        document.body.appendChild(this.overlay);
    }

    /**
     * Intercept all internal links to prevent default harsh browser reloads
     */
    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (!link) return;

            const href = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Safety guards for internal transitions only
            if (
                href && 
                !href.startsWith('#') && 
                !href.startsWith('javascript:') && 
                !href.startsWith('tel:') && 
                !href.startsWith('mailto:') &&
                target !== '_blank' &&
                link.hostname === window.location.hostname
            ) {
                e.preventDefault();
                this.navigateTo(href);
            }
        });
    }

    /**
     * Handles browser Back/Forward navigation smoothly
     */
    handlePopState() {
        window.addEventListener('popstate', async () => {
            await this.loadPage(window.location.href, false);
        });
    }

    /**
     * Orchestrates the outbound and inbound animation timeline
     * @param {string} url 
     */
    async navigateTo(url) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.core.emit('transition:start', { url });

        // Phase 1: Play Outbound Animation (Fade/Scale Overlay In)
        this.overlay.classList.add('pt-overlay--active');
        this.overlay.setAttribute('aria-hidden', 'false');

        // Allow animation frame sequence to complete (300ms)
        await new Promise(resolve => setTimeout(resolve, 300));

        // Phase 2: Load the page content in background
        const success = await this.loadPage(url, true);

        if (success) {
            // Phase 3: Play Inbound Animation (Fade Overlay Out)
            this.overlay.classList.remove('pt-overlay--active');
            this.overlay.setAttribute('aria-hidden', 'true');
            
            // Re-intercept fresh links injected into the page
            this.core.emit('transition:end', { url });
        } else {
            // Fallback recovery if fetch fails
            window.location.href = url;
        }

        this.isTransitioning = false;
    }

    /**
     * Background dynamic fetch and dynamic DOM swapping
     * @param {string} url 
     * @param {boolean} pushState 
     */
    async loadPage(url, pushState = true) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const htmlText = await response.text();
            
            // Parse text to HTML DOM elements safely
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(htmlText, 'text/html');

            // Swap Title
            document.title = newDoc.title;

            // Swap Main Wrapper Element (Assuming standard class/id wrapper container)
            const currentContent = document.querySelector('#app-main-content') || document.body;
            const newContent = newDoc.querySelector('#app-main-content') || newDoc.body;

            if (currentContent && newContent) {
                currentContent.innerHTML = newContent.innerHTML;
            }

            // Sync URL history state
            if (pushState) {
                window.history.pushState({}, '', url);
            }

            // Reset scroll to top
            window.scrollTo(0, 0);
            
            return true;
        } catch (error) {
            console.error('❌ PageTransition Engine Failure:', error);
            return false;
        }
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('PageTransition', new PageTransition());
