document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // STATS COUNTER ANIMATION
    // =========================

    const counters = document.querySelectorAll('.stat-box h3');

    const animateCounter = (counter) => {

        const target = parseInt(counter.dataset.target, 10);
        const suffix = counter.dataset.suffix || '+';

        let current = 0;

        const increment = Math.ceil(target / 80);

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
        threshold: 0.15
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});