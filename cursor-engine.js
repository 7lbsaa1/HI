/**
 * @fileoverview CursorEngine - 60fps Custom Fluid Mouse Interactivity Engine
 * @version 1.0.0
 */

class CursorEngine {
    constructor() {
        this.core = null;
        this.cursorDot = null;
        this.cursorOutline = null;
        
        this.mousePos = { x: 0, y: 0 };
        this.dotPos = { x: 0, y: 0 };
        this.outlinePos = { x: 0, y: 0 };
        
        // Easing interpolation coefficients for inertia effect
        this.dotEasing = 1; 
        this.outlineEasing = 0.18; 
        
        this.isVisible = false;
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;

        // Skip setup on touch devices to ensure optimal performance & ergonomics
        if (window.matchMedia('(pointer: coarse)').matches) return;

        this.buildCursorDOM();
        this.bindEvents();
        this.renderLoop();
    }

    /**
     * Creates clean, stylized HTML wrappers for the custom cursor
     */
    buildCursorDOM() {
        this.cursorDot = document.createElement('div');
        this.cursorOutline = document.createElement('div');

        this.cursorDot.className = 'c-engine-dot';
        this.cursorOutline.className = 'c-engine-outline';

        this.cursorDot.style.opacity = '0';
        this.cursorOutline.style.opacity = '0';

        document.body.appendChild(this.cursorDot);
        document.body.appendChild(this.cursorOutline);
    }

    /**
     * Hook events to track coordinates and reactive states
     */
    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            if (!this.isVisible) {
                this.showCursor();
            }
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        }, { passive: true });

        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('mouseenter', () => this.showCursor());

        // Interaction States (Hovering clickable entities)
        const interactiveSelectors = 'a, button, [role="button"], .theme-btn, [data-quickview-trigger]';
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                this.cursorOutline.classList.add('c-engine-outline--hover');
                this.cursorDot.classList.add('c-engine-dot--hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                this.cursorOutline.classList.remove('c-engine-outline--hover');
                this.cursorDot.classList.remove('c-engine-dot--hover');
            }
        });

        // Click animations
        document.addEventListener('mousedown', () => {
            this.cursorOutline.classList.add('c-engine-outline--click');
        });
        document.addEventListener('mouseup', () => {
            this.cursorOutline.classList.remove('c-engine-outline--click');
        });
    }

    showCursor() {
        this.isVisible = true;
        this.cursorDot.style.opacity = '1';
        this.cursorOutline.style.opacity = '1';
    }

    hideCursor() {
        this.isVisible = false;
        this.cursorDot.style.opacity = '0';
        this.cursorOutline.style.opacity = '0';
    }

    /**
     * High performance RequestAnimationFrame render loop executing frame calculations
     */
    renderLoop() {
        // Linear Interpolation (LERP) Formula: Current + (Target - Current) * Factor
        this.dotPos.x += (this.mousePos.x - this.dotPos.x) * this.dotEasing;
        this.dotPos.y += (this.mousePos.y - this.dotPos.y) * this.dotEasing;

        this.outlinePos.x += (this.mousePos.x - this.outlinePos.x) * this.outlineEasing;
        this.outlinePos.y += (this.mousePos.y - this.outlinePos.y) * this.outlineEasing;

        // Apply hardware-accelerated transforms
        if (this.cursorDot && this.cursorOutline) {
            this.cursorDot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0) translate(-50%, -50%)`;
            this.cursorOutline.style.transform = `translate3d(${this.outlinePos.x}px, ${this.outlinePos.y}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(() => this.renderLoop());
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('CursorEngine', new CursorEngine());
