document.addEventListener('DOMContentLoaded', () => {
    // =========================
    // STATS COUNTER ANIMATION
    // =========================

    const counters = document.querySelectorAll('.stat-box h3');

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target, 10);
        const suffix = counter.dataset.suffix || '+';
        let current = 0;
        const increment = Math.ceil(target / 60);

        const updateCounter = () => {
            current += increment;

            if (current >= target) {
                counter.textContent = `${target}${suffix}`;
                return;
            }

            counter.textContent = `${current}${suffix}`;
            requestAnimationFrame(updateCounter);
        };

        updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.4
    });

    counters.forEach(counter => {
        const originalText = counter.textContent;
        const number = originalText.replace(/\D/g, '');
        const suffix = originalText.replace(/[0-9]/g, '');

        counter.dataset.target = number;
        counter.dataset.suffix = suffix;
        counter.textContent = `0${suffix}`;

        counterObserver.observe(counter);
    });

    // =========================
    // SCROLL REVEAL ANIMATION
    // =========================

    const revealElements = document.querySelectorAll(
        '.category-card, .why-card, .stat-box'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // =========================
    // PARALLAX EFFECT (Optional)
    // =========================

    const heroSection = document.querySelector('.home-hero');
    if (heroSection && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const offset = scrolled * 0.5;
            heroSection.style.backgroundPosition = `center ${offset}px`;
        }, { passive: true });
    }

    // =========================
    // SMOOTH BUTTON INTERACTIONS
    // =========================

    document.querySelectorAll('.btn-primary, .btn-secondary, .orange-btn, .blue-btn').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });

        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // =========================
    // CARD HOVER EFFECTS
    // =========================

    document.querySelectorAll('.category-card, .why-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });
    });

    // =========================
    // ACCESSIBILITY: KEYBOARD NAVIGATION
    // =========================

    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = 'none';
            this.style.boxShadow = '0 0 0 3px rgba(47, 141, 60, 0.3)';
        });

        element.addEventListener('blur', function() {
            this.style.boxShadow = '';
        });
    });

    // =========================
    // PREFERS REDUCED MOTION
    // =========================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.documentElement.style.scrollBehavior = 'auto';
        
        revealElements.forEach(el => {
            el.style.transition = 'none';
            el.classList.add('show');
        });
    }

    // =========================
    // SECTION VISIBILITY TRACKING
    // =========================

    const sections = document.querySelectorAll('.home-hero, .categories-section, .why-us, .stats-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0.95';
        sectionObserver.observe(section);
    });

    // =========================
    // PREVENT LAYOUT SHIFT
    // =========================

    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                img.style.minHeight = 'auto';
            }
        });
    }

    // =========================
    // TOUCH OPTIMIZATIONS FOR MOBILE
    // =========================

    if (window.innerWidth <= 768) {
        document.querySelectorAll('.category-card, .why-card, .stat-box').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.opacity = '0.9';
            });

            card.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }

    // =========================
    // PERFORMANCE: LAZY LOAD OPTIMIZATION
    // =========================

    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});