/**
 * @fileoverview CursorEngine - 60fps Custom Fluid Golden Mouse Interactivity Engine
 * @version 1.1.0
 */

class CursorEngine {
    constructor() {
        this.core = null;
        this.cursorDot = null;
        this.cursorOutline = null;
        
        this.mousePos = { x: -100, y: -100 };
        this.dotPos = { x: -100, y: -100 };
        this.outlinePos = { x: -100, y: -100 };
        
        // معامل التقريب الخطي (LERP) للحصول على تأثير اللين والقصور الذاتي
        this.dotEasing = 1;      // النقطة تتحرك مباشرة مع سن الماوس
        this.outlineEasing = 0.15; // الدائرة الخارجية تتبع الماوس بنعومة وانسيابية
        
        this.isVisible = false;
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;

        // إلغاء تفعيل المؤشر فوراً على أجهزة اللمس والموبايل لضمان الأداء
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

        // جعل العناصر شفافة مبدئياً حتى يتحرك الماوس لتجنب القفزات البصرية
        this.cursorDot.style.opacity = '0';
        this.cursorOutline.style.opacity = '0';

        document.body.appendChild(this.cursorDot);
        document.body.appendChild(this.cursorOutline);

        // تفعيل كلاس الأمان على الـ HTML لإخفاء الماوس القديم فقط عند تحميل الكود بنجاح
        document.documentElement.classList.add('custom-cursor-enabled');
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

        // العناصر التفاعلية التي يتأثر الماوس عند الوقوف فوقها (Hover Effect)
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

        // تأثير النبضة والضغط (Click Animation)
        document.addEventListener('mousedown', () => {
            this.cursorOutline.classList.add('c-engine-outline--click');
        });
        document.addEventListener('mouseup', () => {
            this.cursorOutline.classList.remove('c-engine-outline--click');
        });
    }

    showCursor() {
        this.isVisible = true;
        if (this.cursorDot && this.cursorOutline) {
            this.cursorDot.style.opacity = '1';
            this.cursorOutline.style.opacity = '1';
        }
    }

    hideCursor() {
        this.isVisible = false;
        if (this.cursorDot && this.cursorOutline) {
            this.cursorDot.style.opacity = '0';
            this.cursorOutline.style.opacity = '0';
        }
    }

    /**
     * High performance RequestAnimationFrame render loop executing frame calculations
     */
    renderLoop() {
        // معادلة الليرب (LERP): الوضع الحالي + (الوضع المستهدف - الوضع الحالي) * المعامل
        this.dotPos.x += (this.mousePos.x - this.dotPos.x) * this.dotEasing;
        this.dotPos.y += (this.mousePos.y - this.dotPos.y) * this.dotEasing;

        this.outlinePos.x += (this.mousePos.x - this.outlinePos.x) * this.outlineEasing;
        this.outlinePos.y += (this.mousePos.y - this.outlinePos.y) * this.outlineEasing;

        // تطبيق الـ Transforms مع تسريع كارت الشاشة عتادياً (Hardware Acceleration)
        if (this.cursorDot && this.cursorOutline) {
            this.cursorDot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0) translate(-50%, -50%)`;
            this.cursorOutline.style.transform = `translate3d(${this.outlinePos.x}px, ${this.outlinePos.y}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(() => this.renderLoop());
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('CursorEngine', new CursorEngine());
