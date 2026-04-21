// has no index.js file// Poultry page initializations
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // stop observing after animation
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .training-card, .product-card').forEach(el => observer.observe(el));
});