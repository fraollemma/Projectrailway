document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initCurrentYear();
    initNotifications();
    initFormSubmissions();
    initButtonEffects();
    initLanguageAutoSubmit();
    initLanguagePopup();
    initMobileNavigation(); 
    initCategoryNavDropdowns();
    initDropdowns(); 
});

/* ================= CLOCK ================= */
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clock = document.getElementById("liveClock");
    if (!clock) return;

    const now = new Date();
    clock.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString();
}

/* ================= YEAR ================= */
function initCurrentYear() {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

/* ================= NOTIFICATIONS ================= */
function initNotifications() {

    function updateNotifications() {
        if (!window.UNREAD_COUNT_API_URL) return;

        fetch(window.UNREAD_COUNT_API_URL, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {

                const msg = document.getElementById('navbarUnread');
                if (msg) {
                    if (data.unread_messages > 0) {
                        msg.textContent = data.unread_messages > 9 ? '9+' : data.unread_messages;
                        msg.style.display = 'flex';
                        msg.classList.add('pulse');
                    } else {
                        msg.style.display = 'none';
                    }
                }

                const cart = document.getElementById('navbarcartUnread');
                if (cart) {
                    if (data.cart_items > 0) {
                        cart.textContent = data.cart_items > 9 ? '9+' : data.cart_items;
                        cart.style.display = 'flex';
                        cart.classList.add('pulse');
                    } else {
                        cart.style.display = 'none';
                    }
                }

                const totalBadge = document.querySelector('.notifications .notification-badge');
                if (totalBadge) {
                    const total = (data.unread_messages || 0) + (data.cart_items || 0);

                    if (total > 0) {
                        totalBadge.textContent = total > 9 ? '9+' : total;
                        totalBadge.style.display = 'flex';
                        totalBadge.classList.add('pulse');
                    } else {
                        totalBadge.style.display = 'none';
                    }
                }

            })
            .catch(err => console.error("Notification error:", err));
    }

    updateNotifications();
    setInterval(updateNotifications, 10000);

    document.querySelectorAll('.notifications .dropdown-toggle')
        .forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll(
                    '.notifications .notification-badge, #navbarUnread, #navbarcartUnread'
                ).forEach(el => el?.classList.remove('pulse'));
            });
        });
}


function initFormSubmissions() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <span class="spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    <span class="text">...</span>
                `;
                if (form.dataset.ajax === "true") {
                    e.preventDefault();
                    handleAjaxForm(form, submitBtn, originalText);
                }
            }
        });
    });
}

function handleAjaxForm(form, submitBtn, originalText) {
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.redirect) {
            window.location.href = data.redirect;
        } else if (data.success) {
            showToast('Success!', data.message || 'Operation completed successfully', 'success');
            form.reset();
        }
    })
    .catch(error => {
        showToast('Error', error.message || 'Something went wrong', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
    });
}

function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initLanguagePopup() {
    const overlay = document.getElementById("language-overlay");
    if (!overlay) return;

    if (localStorage.getItem("languageSelected")) {
        overlay.classList.add("hidden");
    } else {
        setTimeout(() => {
            if (!localStorage.getItem("languageSelected")) {
                overlay.classList.remove("hidden");
            }
        }, 1000);
    }
}
function submitLanguage(selectElement) {
    localStorage.setItem("languageSelected", "true");
    const overlay = document.getElementById("language-overlay");
    if (overlay) overlay.classList.add("hidden");   
    selectElement.form.submit();
}
function skipPopup() {
    localStorage.setItem("languageSelected", "true");
    const overlay = document.getElementById("language-overlay");
    if (overlay) overlay.classList.add("hidden");    
}
function autoSubmitHandler(e) {
    localStorage.setItem("languageSelected", "true");
    const overlay = document.getElementById("language-overlay");
    if (overlay) overlay.classList.add("hidden");
    this.form.submit();
}

function initLanguageAutoSubmit() {
    const languageSelects = document.querySelectorAll('#languageSelect, .language-select');

    languageSelects.forEach(select => {
        select.addEventListener('change', autoSubmitHandler);
    });
}

/* ================= CATEGORY DROPDOWN FIX (YOUR ERROR WAS HERE) ================= */
function initCategoryNavDropdowns() {

    const dropdownToggles = document.querySelectorAll('.category-nav-item .dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const parentItem = this.closest('.category-nav-item');
            const dropdown = this.nextElementSibling;

            // ✅ FIX: prevent crash
            if (!parentItem || !dropdown) return;

            document.querySelectorAll('.category-nav-dropdown.active').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('active');
                    openDropdown.closest('.category-nav-item')?.classList.remove('active');
                    openDropdown.previousElementSibling?.setAttribute('aria-expanded', 'false');
                }
            });

            parentItem.classList.toggle('active');
            dropdown.classList.toggle('active');

            this.setAttribute(
                'aria-expanded',
                dropdown.classList.contains('active')
            );
        });
    });
}

/* ================= GLOBAL DROPDOWN ================= */
function initDropdowns() {

    const dropdowns = document.querySelectorAll(".dropdown:not(.category-nav *)");

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        if (!toggle) return;

        toggle.addEventListener("click", function(e) {
            e.stopPropagation();

            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove("open");
            });

            dropdown.classList.toggle("open");
        });
    });

    document.addEventListener("click", () => {
        dropdowns.forEach(d => d.classList.remove("open"));
    });
}

/* ================= MOBILE NAV FIX ================= */
function initMobileNavigation() {

    const navToggle = document.getElementById('navToggle');
    const categoryNav = document.getElementById('categoryNav');
    if (!categoryNav) return;

    let navOverlay = document.querySelector('.nav-overlay');

    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    function toggleCategoryNav() {
        const isExpanded = categoryNav.classList.toggle('active');

        navOverlay.classList.toggle('active', isExpanded);
        document.body.classList.toggle('no-scroll', isExpanded);

        if (navToggle) {
            navToggle.setAttribute('aria-expanded', isExpanded);

            const icon = navToggle.querySelector('.nav-toggle-icon i');
            if (iconWrapper) {
                const icon = iconWrapper.querySelector('i');
                if (icon) {
                    icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
                }
            }
    }

    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCategoryNav();
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
}

function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <strong>${title}</strong>
            <button class="toast-close">&times;</button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
}

function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .pulse {
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(style);
}

addPulseAnimation();
