document.addEventListener('DOMContentLoaded', function() {
    // ===== SLIDER FUNCTIONALITY =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (n >= slides.length) currentSlide = 0;
        else if (n < 0) currentSlide = slides.length - 1;
        else currentSlide = n;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });

        prevBtn.addEventListener('click', () => {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        });
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                showSlide(index);
                startSlideShow();
            });
        });
    }

    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlideShow);
        sliderContainer.addEventListener('mouseleave', startSlideShow);
    }

    startSlideShow();

    // ===== CATEGORY CARDS ANIMATION =====
    const categoryCards = document.querySelectorAll('.category-card');
    
    function checkScroll() {
        categoryCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }
        });

        // Also check for product cards animation
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
    
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);
    
    checkScroll();

    // ===== PRODUCT CARDS HOVER EFFECTS =====
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });

    // ===== LOAD MORE FUNCTIONALITY =====
    const loadMoreBtn = document.getElementById('load-more-btn');
    const moreProducts = document.getElementById('more-products');
    
    if (loadMoreBtn && moreProducts) {
        loadMoreBtn.addEventListener('click', function() {
            // Show the hidden products with smooth animation
            moreProducts.style.display = 'grid';
            
            // Trigger reflow for animation
            void moreProducts.offsetWidth;
            
            // Add animation class
            moreProducts.style.animation = 'fadeIn 0.6s ease-in forwards';
            
            // Hide the load more button with smooth transition
            loadMoreBtn.style.opacity = '0';
            loadMoreBtn.style.transform = 'translateY(20px)';
            loadMoreBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                loadMoreBtn.style.display = 'none';
                
                // Animate in the new product cards
                const newProductCards = moreProducts.querySelectorAll('.product-card');
                newProductCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                // Optional: Scroll to the newly loaded products
                moreProducts.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 300);
        });

        // Add hover effects to load more button
        loadMoreBtn.addEventListener('mouseenter', () => {
            loadMoreBtn.style.transform = 'translateY(-2px)';
        });
        
        loadMoreBtn.addEventListener('mouseleave', () => {
            loadMoreBtn.style.transform = 'translateY(0)';
        });
    }

    // ===== INTERSECTION OBSERVER FOR LAZY ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('product-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Observe all product cards for animation
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ===== LIKE AND SHARE BUTTON FUNCTIONALITY =====
    document.querySelectorAll('.interaction-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.getAttribute('data-item-id');
            const action = this.getAttribute('data-action');
            
            // Add temporary visual feedback
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Here you would typically make an AJAX call to your backend
            console.log(`${action} clicked for item ${itemId}`);
        });
    });

    // ===== RESPONSIVE BEHAVIOR =====
    function handleResize() {
        // Adjust animations based on screen size
        if (window.innerWidth < 768) {
            // Mobile-specific adjustments
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            });
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // ===== TOUCH DEVICE SUPPORT =====
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            stopSlideShow();
            nextSlide();
            startSlideShow();
        }
        
        if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            stopSlideShow();
            prevSlide();
            startSlideShow();
        }
    }
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential reuse
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce };
}
