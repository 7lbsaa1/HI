/**
 * @fileoverview PerformanceMonitor - Advanced Web Vitals & Resource Optimizer
 * @version 1.0.0
 */

class PerformanceMonitor {
    constructor() {
        this.core = null;
        this.metrics = {};
        this.isLowEndDevice = false;
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;

        this.analyzeDeviceCapabilities();
        this.measureWebVitals();
        this.setupResourceOptimization();
    }

    /**
     * Inspects hardware specs to detect lower-end devices or battery saving modes
     */
    analyzeDeviceCapabilities() {
        const memory = navigator.deviceMemory; // Available RAM in GB
        const cpuCores = navigator.hardwareConcurrency; // Logical CPU Cores
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        // Condition check for resource-constrained environments
        if (
            (memory && memory < 4) || 
            (cpuCores && cpuCores < 4) || 
            (connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType)))
        ) {
            this.isLowEndDevice = true;
            document.documentElement.classList.add('perf-low-specs');
            console.log('%c⚠️ Performance: Low-end environment detected. Optimizing animations.', 'color: #ef4444; font-weight: bold;');
        }
    }

    /**
     * Measures professional Google Web Vitals directly inside the site core
     */
    measureWebVitals() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (!window.performance || !window.performance.getEntriesByType) return;

                // 1. Navigation Timing Metrics
                const navTiming = window.performance.getEntriesByType('navigation')[0];
                if (navTiming) {
                    this.metrics.pageLoadTime = navTiming.loadEventEnd - navTiming.startTime;
                    this.metrics.domReady = navTiming.domContentLoadedEventEnd - navTiming.startTime;
                    this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart; // Time to First Byte
                }

                // 2. Paint Metrics (First Contentful Paint)
                const paintTimings = window.performance.getEntriesByType('paint');
                paintTimings.forEach(paint => {
                    if (paint.name === 'first-contentful-paint') {
                        this.metrics.fcp = paint.startTime;
                    }
                });

                console.log('%c📊 Performance Report Generated:', 'color: #3b82f6; font-weight: bold;', this.metrics);
                
                // Broadcast statistics globally for analytics integrations
                this.core.emit('perf:report', this.metrics);
            }, 1000); // Guard window lifecycle execution tracking
        });
    }

    /**
     * Monitors page visibility states to free up operational resources
     */
    setupResourceOptimization() {
        // Disables expensive loops/timers when user switch tabs
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.core.emit('perf:freeze', { status: true });
                console.log('%c⏸️ Core execution frozen - Tab hidden.', 'color: #eab308');
            } else {
                this.core.emit('perf:freeze', { status: false });
                console.log('%c▶️ Core execution resumed - Tab active.', 'color: #22c55e');
            }
        });
    }

    /**
     * Utility method to check capability profile on the fly
     * @returns {boolean}
     */
    shouldRunHeavyEffects() {
        return !this.isLowEndDevice;
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('PerformanceMonitor', new PerformanceMonitor());
