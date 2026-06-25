/**
 * @fileoverview SkeletonLoader - Dynamic Content Shimmer Preloader
 * @version 1.0.0
 */

class SkeletonLoader {
    constructor() {
        this.core = null;
        this.skeletons = [];
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;
        this.scanAndObserve();

        // Listen to core transitions or quick views to re-verify layouts
        this.core.on('transition:end', () => this.scanAndObserve());
        this.core.on('quickview:opened', () => this.scanAndObserve());
    }

    /**
     * Scans document for static skeletons and observes images dynamically
     */
    scanAndObserve() {
        this.skeletons = document.querySelectorAll('.sk-loading, [data-skeleton]');
        
        // Handle Images specifically to fade them smoothly once fully downloaded
        const targetImages = document.querySelectorAll('img[data-src], .sk-img-target');
        
        targetImages.forEach(img => {
            if (img.complete) {
                this.removeSkeleton(img);
            } else {
                // Attach high-fidelity load listeners
                img.addEventListener('load', () => this.removeSkeleton(img));
                img.addEventListener('error', () => this.handleErrorState(img));
            }
        });
    }

    /**
     * Gracefully removes loading classes and executes reveal animations
     * @param {HTMLElement} element 
     */
    removeSkeleton(element) {
        // Find immediate skeleton parent container if exists
        const skeletonParent = element.closest('.sk-container') || element;
        
        skeletonParent.classList.add('sk-reveal-ready');
        
        // Short timeout sequence to bridge GPU hardware acceleration layers
        setTimeout(() => {
            skeletonParent.classList.remove('sk-loading');
            skeletonParent.removeAttribute('data-skeleton');
            skeletonParent.classList.remove('sk-container');
            
            this.core.emit('skeleton:resolved', { target: element });
        }, 200);
    }

    /**
     * Handles image broken links safely without locking animations
     * @param {HTMLElement} element 
     */
    handleErrorState(element) {
        const skeletonParent = element.closest('.sk-container') || element;
        skeletonParent.classList.remove('sk-loading');
        element.style.opacity = '0.5'; // Visual cue for dead assets
        console.warn('⚠️ SkeletonLoader: Failed to fetch image asset source.', element);
    }

    /**
     * Utility method to dynamically inject skeletons programmatically via JS
     * @param {HTMLElement} parentContainer 
     * @param {string} structuralTemplate HTML string configuration
     */
    injectSkeleton(parentContainer, structuralTemplate) {
        if (!parentContainer) return;
        parentContainer.innerHTML = structuralTemplate;
        this.scanAndObserve();
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('SkeletonLoader', new SkeletonLoader());
