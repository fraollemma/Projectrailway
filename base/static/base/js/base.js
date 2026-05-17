/* =========================================
   Ethio Agriculture - Main JavaScript
   Version: 2.0 (Refactored & Fixed)
   ========================================= */

(function() {
    'use strict';

    // Global references (avoid duplication)
    let categoryNav = null;
    let navOverlay = null;
    let navToggle = null;
    let navCloseBtn = null;

    // Flag to prevent multiple initializations
    let isInitialized = false;

    document.addEventListener('DOMContentLoaded', function() {
        if (isInitialized) return;
        isInitialized = true;

        // Get DOM elements once
        categoryNav = document.getElementById('categoryNav');
        navOverlay = document.querySelector('.nav-overlay');
        navToggle = document.getElementById('navToggle');
        navCloseBtn = document.getElementById('navCloseBtn');

        initClock();
        initCurrentYear();
        initUnreadCount();
        initFormSubmissions();
        initButtonEffects();
        initLanguageAutoSubmit();
        initLanguagePopup();
        initMobileNavigation();
        initCategoryNavDropdowns();
        initDropdowns();
        initScrollEffects();
        initPageAnimations();
        initScrollToTopButton();
        initVisibilityAwarePolling();
    });

    /* =========================================
       CLOCK & DATE UTILITIES
       ========================================= */
    function initClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }

    function updateClock() {
        const clock = document.getElementById("liveClock");
        if (!clock) return;

        const now = new Date();
        // Use ISO-like format to avoid locale ambiguity: YYYY-MM-DD HH:MM:SS
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        clock.textContent = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function initCurrentYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    /* =========================================
       NOTIFICATIONS (Polling with visibility API)
       ========================================= */
    let pollingInterval = null;

    function fetchUnreadCount() {
        if (!window.UNREAD_COUNT_API_URL) return;

        // Don't fetch for anonymous users (no profile picture = not logged in)
        if (!document.querySelector('.user-profile-picture')) return;

        fetch(window.UNREAD_COUNT_API_URL, {
            credentials: 'include',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            updateNotificationBadges(data);
        })
        .catch(error => {
            console.warn('Unread count fetch failed:', error);
        });
    }

    function updateNotificationBadges(data) {
        const notifBadge = document.getElementById("notificationBadge");
        const messageCount = document.getElementById("messageCount");
        const eggOrderCount = document.getElementById("eggOrderCount");
        const cartCount = document.getElementById("cartCount");
        const totalNotification = document.getElementById("totalNotification");
        const navbarMessages = document.getElementById("navbarMessages");
        const navbarEggOrders = document.getElementById("navbarEggOrders");
        const navbarCart = document.getElementById("navbarCart");

        const messages = data.total_unread || 0;
        const orders = data.egg_order_count || 0;
        const cart = data.cart_count || 0;
        const total = messages + orders + cart;

        if (messageCount) messageCount.textContent = messages;
        if (eggOrderCount) eggOrderCount.textContent = orders;
        if (cartCount) cartCount.textContent = cart;
        if (totalNotification) totalNotification.textContent = total;

        if (notifBadge) {
            notifBadge.textContent = total;
            if (total > 0) {
                notifBadge.style.display = 'flex';
                notifBadge.classList.add('pulse');
            } else {
                notifBadge.style.display = 'none';
                notifBadge.classList.remove('pulse');
            }
        }

        if (navbarMessages) navbarMessages.textContent = messages;
        if (navbarEggOrders) navbarEggOrders.textContent = orders;
        if (navbarCart) navbarCart.textContent = cart;
    }

    function initUnreadCount() {
        fetchUnreadCount(); // initial fetch
        startPolling();
    }

    function startPolling() {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchUnreadCount();
            }
        }, 30000);
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    }

    function initVisibilityAwarePolling() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                fetchUnreadCount();
                startPolling();
            } else {
                stopPolling();
            }
        });
    }

    /* =========================================
       FORM HANDLING (with CSRF & validation)
       ========================================= */
    function initFormSubmissions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (!submitBtn) return;

                // Run client-side validation before disabling
                let isValid = true;
                const inputs = this.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (!validateField(input)) isValid = false;
                });

                if (!isValid) {
                    e.preventDefault();
                    showToast('Validation Error', 'Please correct the highlighted fields', 'error');
                    return;
                }

                // Disable button to prevent double submission
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = `<span class="spinner"><i class="fas fa-spinner fa-spin"></i></span> Processing...`;

                // If AJAX form, handle specially
                if (form.dataset.ajax === "true") {
                    e.preventDefault();
                    handleAjaxForm(form, submitBtn, originalHTML);
                } else {
                    // Re-enable after normal submit (in case of server redirect failure)
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('loading');
                        submitBtn.innerHTML = originalHTML;
                    }, 3000);
                }
            });

            // Real-time field validation on blur
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('focus', () => {
                    input.classList.remove('error');
                    input.style.borderColor = '';
                });
            });
        });
    }

    function validateField(field) {
        let isValid = true;
        let errorMsg = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMsg = 'This field is required';
        }

        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMsg = 'Enter a valid email address';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = '#ef4444';
            field.setAttribute('aria-invalid', 'true');
            // Optional: show error message next to field
            let errorSpan = field.parentNode.querySelector('.field-error');
            if (!errorSpan) {
                errorSpan = document.createElement('small');
                errorSpan.className = 'field-error';
                errorSpan.style.color = '#ef4444';
                field.parentNode.appendChild(errorSpan);
            }
            errorSpan.textContent = errorMsg;
        } else {
            field.classList.remove('error');
            field.style.borderColor = '';
            field.setAttribute('aria-invalid', 'false');
            const errorSpan = field.parentNode.querySelector('.field-error');
            if (errorSpan) errorSpan.remove();
        }
        return isValid;
    }

    function handleAjaxForm(form, submitBtn, originalHTML) {
        const formData = new FormData(form);
        // CSRF token is already included in FormData if there's a hidden input named csrfmiddlewaretoken

        fetch(form.action, {
            method: form.method,
            body: formData,
            credentials: 'include',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            } else if (data.success) {
                showToast('Success!', data.message || 'Operation completed', 'success');
                form.reset();
                // Trigger custom event for other scripts
                form.dispatchEvent(new CustomEvent('ajax:success', { detail: data }));
            } else {
                showToast('Error', data.message || 'Something went wrong', 'error');
            }
        })
        .catch(error => {
            showToast('Error', error.message || 'Network error. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalHTML;
        });
    }

    /* =========================================
       BUTTON RIPPLE EFFECT (optimized)
       ========================================= */
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn, button:not(.no-ripple)');
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
            // Press/transform effects
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(2px) scale(0.98)';
            });
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    function createRipple(e) {
        const button = e.currentTarget;
        // Ensure button has position relative for ripple absolute positioning
        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
        `;
        button.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    /* =========================================
       LANGUAGE POPUP (with localStorage fallback)
       ========================================= */
    function initLanguagePopup() {
        const overlay = document.getElementById("language-overlay");
        if (!overlay) return;

        // Check if localStorage is available, otherwise use sessionStorage
        let storage;
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            storage = localStorage;
        } catch(e) {
            storage = sessionStorage;
        }

        if (storage.getItem("languageSelected")) {
            overlay.classList.add("hidden");
        } else {
            // Show popup after short delay
            setTimeout(() => {
                if (!storage.getItem("languageSelected")) {
                    overlay.classList.remove("hidden");
                }
            }, 1000);
        }

        // Bind skip button without inline onclick
        const skipBtn = document.querySelector('.popup-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => skipPopup(storage));
        }

        // Auto-submit when user selects language
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', function(e) {
                storage.setItem("languageSelected", "true");
                overlay.classList.add("hidden");
                this.form.submit();
            });
        }
    }

    function skipPopup(storage) {
        storage.setItem("languageSelected", "true");
        const overlay = document.getElementById("language-overlay");
        if (overlay) overlay.classList.add("hidden");
    }

    function initLanguageAutoSubmit() {
        // For language selects in dropdown menus (class .language-select)
        const selects = document.querySelectorAll('#languageSelect, .language-select');
        selects.forEach(select => {
            select.addEventListener('change', function() {
                let storage;
                try { storage = localStorage; } catch(e) { storage = sessionStorage; }
                storage.setItem("languageSelected", "true");
                const overlay = document.getElementById("language-overlay");
                if (overlay) overlay.classList.add("hidden");
                this.form.submit();
            });
        });
    }

    /* =========================================
       MOBILE NAVIGATION (fixed duplicate var)
       ========================================= */
    function initMobileNavigation() {
        if (!categoryNav || !navToggle) return;

        // Create overlay if not exists
        if (!navOverlay) {
            navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            document.body.appendChild(navOverlay);
        }

        function toggleCategoryNav() {
            const isActive = categoryNav.classList.contains('active');

            if (!isActive) {
                categoryNav.classList.add('active');
                navOverlay.classList.add('active');
                document.body.classList.add('no-scroll');
                categoryNav.style.animation = 'slideInLeft 0.4s ease-out';

                navToggle.setAttribute('aria-expanded', 'true');
                updateNavToggleIcon('close');
                navToggle.style.transform = 'rotate(90deg)';
            } else {
                categoryNav.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                categoryNav.style.animation = 'slideOutLeft 0.4s ease-out';

                navToggle.setAttribute('aria-expanded', 'false');
                updateNavToggleIcon('menu');
                navToggle.style.transform = 'rotate(0deg)';
            }
        }

        function updateNavToggleIcon(state) {
            const iconElem = navToggle.querySelector('i');
            if (iconElem) {
                iconElem.className = state === 'close' ? 'fas fa-times' : 'fas fa-bars';
            }
        }

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCategoryNav();
        });

        if (navCloseBtn) {
            navCloseBtn.addEventListener('click', () => {
                if (categoryNav.classList.contains('active')) toggleCategoryNav();
            });
        }

        navOverlay.addEventListener('click', () => {
            if (categoryNav.classList.contains('active')) toggleCategoryNav();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && categoryNav.classList.contains('active')) {
                toggleCategoryNav();
            }
        });

        // Close nav when any category link is clicked
        const categoryLinks = document.querySelectorAll('.category-nav-link:not(.dropdown-toggle)');
        categoryLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (categoryNav.classList.contains('active')) toggleCategoryNav();
            });
        });
    }

    /* =========================================
       DROPDOWNS (header & category)
       ========================================= */
    function initDropdowns() {
        const dropdowns = document.querySelectorAll(".header-actions .dropdown");
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector(".dropdown-toggle");
            if (!toggle) return;

            toggle.addEventListener("click", function(e) {
                e.stopPropagation();
                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown && d.classList.contains('open')) {
                        d.classList.remove("open");
                        const otherBtn = d.querySelector(".dropdown-toggle");
                        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
                    }
                });
                const isOpen = dropdown.classList.toggle("open");
                toggle.setAttribute("aria-expanded", isOpen);
                toggle.style.transform = isOpen ? 'rotate(8deg)' : 'rotate(0deg)';
            });
        });

        document.addEventListener("click", function() {
            dropdowns.forEach(d => {
                if (d.classList.contains('open')) {
                    d.classList.remove("open");
                    const btn = d.querySelector(".dropdown-toggle");
                    if (btn) {
                        btn.setAttribute("aria-expanded", "false");
                        btn.style.transform = 'rotate(0deg)';
                    }
                }
            });
        });
    }

    function initCategoryNavDropdowns() {
        const dropdownToggles = document.querySelectorAll('.category-nav .dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const parentItem = this.closest('.category-nav-item');
                const dropdown = this.nextElementSibling;
                if (!parentItem || !dropdown) return;

                // Close other open dropdowns
                document.querySelectorAll('.category-nav-dropdown.active').forEach(openDrop => {
                    if (openDrop !== dropdown) {
                        openDrop.classList.remove('active');
                        openDrop.closest('.category-nav-item').classList.remove('active');
                        const prevToggle = openDrop.previousElementSibling;
                        if (prevToggle) prevToggle.setAttribute('aria-expanded', 'false');
                    }
                });

                parentItem.classList.toggle('active');
                dropdown.classList.toggle('active');
                this.setAttribute('aria-expanded', dropdown.classList.contains('active'));
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.category-nav-item.has-dropdown')) {
                document.querySelectorAll('.category-nav-dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const parent = dropdown.closest('.category-nav-item');
                    if (parent) parent.classList.remove('active');
                    const toggle = dropdown.previousElementSibling;
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    /* =========================================
       SCROLL EFFECTS & "BACK TO TOP" BUTTON
       ========================================= */
    let scrollTimeout;
    function initScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        });
    }

    function initScrollToTopButton() {
        let btn = document.getElementById('scrollToTopBtn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'scrollToTopBtn';
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            btn.setAttribute('aria-label', 'Scroll to top');
            btn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 44px;
                height: 44px;
                background: var(--primary-color, #2563eb);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            document.body.appendChild(btn);
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =========================================
       PAGE ANIMATIONS (Intersection Observer)
       ========================================= */
    function initPageAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(el => observer.observe(el));
    }

    /* =========================================
       TOAST NOTIFICATIONS
       ========================================= */
    function showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-header">
                <strong>${escapeHtml(title)}</strong>
                <button class="toast-close" aria-label="Close">&times;</button>
            </div>
            <div class="toast-body">${escapeHtml(message)}</div>
        `;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        let timeoutId = setTimeout(() => {
            removeToast(toast);
        }, 5000);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeoutId);
            removeToast(toast);
        });

        toast.addEventListener('mouseenter', () => clearTimeout(timeoutId));
        toast.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => removeToast(toast), 2000);
        });
    }

    function removeToast(toast) {
        toast.classList.remove('show');
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%) scale(0.9)';
        setTimeout(() => toast.remove(), 300);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    /* =========================================
       ADD MISSING KEYFRAMES (ensure CSS exists)
       ========================================= */
    function addMissingKeyframes() {
        if (!document.querySelector('#dynamic-keyframes')) {
            const style = document.createElement('style');
            style.id = 'dynamic-keyframes';
            style.textContent = `
                @keyframes ripple-animation {
                    to { transform: scale(4); opacity: 0; }
                }
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutLeft {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(-100%); opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pulse {
                    animation: pulse 1s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    addMissingKeyframes();

})(); // End IIFE