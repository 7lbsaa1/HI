/**
 * @fileoverview NavController - Smart Navigation UI Controller
 * @version 1.0.0
 */

class NavController {
    constructor() {
        this.core = null;
        this.navElement = document.querySelector('nav') || document.querySelector('.main-navbar');
        this.navLinks = document.querySelectorAll('nav a, .nav-link');
        this.menuToggle = document.querySelector('.menu-toggle, .burger-menu');
        this.navMenu = document.querySelector('.nav-menu, .nav-links-wrapper');
        this.sections = document.querySelectorAll('section[id]');
        
        this.lastScrollTop = 0;
        this.scrollThreshold = 50;
    }

    /**
     * Lifecycle initialization called by AppCore
     * @param {AppCore} coreInstance 
     */
    init(coreInstance) {
        this.core = coreInstance;
        
        this.setupStickyBehavior();
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.setupSectionObserver();
    }

    /**
     * Handles sticky and smart hide/show header on scroll
     */
    setupStickyBehavior() {
        if (!this.navElement) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Handle background solid/transparent shifts
            if (scrollTop > this.scrollThreshold) {
                this.navElement.classList.add('nav--scrolled');
            } else {
                this.navElement.classList.remove('nav--scrolled');
            }

            // Handle Hide/Show on Scroll Up/Down
            if (scrollTop > this.lastScrollTop && scrollTop > 200) {
                this.navElement.classList.add('nav--hidden');
                this.core.emit('nav:hidden', true);
            } else {
                this.navElement.classList.remove('nav--hidden');
                this.core.emit('nav:hidden', false);
            }

            this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    }

    /**
     * Smooth scrolling logic optimized for performance
     */
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only process internal hashes
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    
                    if (targetSection) {
                        this.closeMobileMenu();
                        
                        const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - (this.navElement?.offsetHeight || 0);
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });

                        this.core.emit('nav:click', { target: href });
                    }
                }
            });
        });
    }

    /**
     * Implements accessible mobile menu triggers
     */
    setupMobileMenu() {
        if (!this.menuToggle || !this.navMenu) return;

        this.menuToggle.addEventListener('click', () => {
            const isExpanded = this.menuToggle.getAttribute('aria-expanded') === 'true';
            
            this.menuToggle.setAttribute('aria-expanded', !isExpanded);
            this.navMenu.classList.toggle('nav-menu--active');
            this.menuToggle.classList.toggle('toggle--active');
            
            document.body.classList.toggle('body--lock-scroll');
            
            this.core.emit('nav:toggle', { open: !isExpanded });
        });
    }

    closeMobileMenu() {
        if (!this.menuToggle || !this.navMenu) return;
        
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('nav-menu--active');
        this.menuToggle.classList.remove('toggle--active');
        document.body.classList.remove('body--lock-scroll');
    }

    /**
     * Watches which section is active using IntersectionObserver
     */
    setupSectionObserver() {
        if (this.sections.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: `-${this.navElement?.offsetHeight || 80}px 0px -60% 0px`,
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    this.navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('link--active');
                        } else {
                            link.classList.remove('link--active');
                        }
                    });

                    this.core.emit('nav:sectionChange', { activeSectionId: id });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        this.sections.forEach(section => observer.observe(section));
    }
}

// Register to AppCore automatically
window.AppCore.registerModule('NavController', new NavController());
