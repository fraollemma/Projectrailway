document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initCurrentYear();
    initUnreadCount();
    initFormSubmissions();
    initButtonEffects();
    initLanguageAutoSubmit();
    initLanguagePopup();
    initMobileNavigation(); 
    initSearch();
    initCategoryNavDropdowns(); 
});

function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clock = document.getElementById("liveClock");
    if (!clock) return;

    const now = new Date();

    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    clock.textContent = date + " " + time;
}
function initCurrentYear() {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

function initUnreadCount() {
    function fetchUnreadCount() {
        if (!window.UNREAD_COUNT_API_URL) return;

        fetch(window.UNREAD_COUNT_API_URL, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const unreadBadge = document.getElementById('navbarUnread');
                if (unreadBadge) {
                    if (data.total_unread > 0) {
                        unreadBadge.textContent = data.total_unread > 9 ? '9+' : data.total_unread;
                        unreadBadge.style.display = 'flex';
                        unreadBadge.classList.add('pulse');
                    } else {
                        unreadBadge.style.display = 'none';
                        unreadBadge.classList.remove('pulse');
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching unread count:', error);
            });
    }

    fetchUnreadCount();
    setInterval(fetchUnreadCount, 30000);
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

    
    if (!localStorage.getItem("languageSelected")) {
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
function initLanguageAutoSubmit() {
    const languageSelects = document.querySelectorAll('#languageSelect, .language-select');
    languageSelects.forEach(select => {
        select.removeEventListener('change', autoSubmitHandler);
        select.addEventListener('change', autoSubmitHandler);
    });

    function autoSubmitHandler(e) {
        localStorage.setItem("languageSelected", "true");
        const overlay = document.getElementById("language-overlay");
        if (overlay) overlay.classList.add("hidden");   
        this.form.submit();
    }
}

function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const categoryNav = document.getElementById('categoryNav');
    let navOverlay = document.querySelector('.nav-overlay');
    
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }
    
    function toggleCategoryNav() {
        categoryNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        const isExpanded = categoryNav.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
        
        if (isExpanded) {
            navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCategoryNav();
        });
    }
    
    const navCloseBtn = document.getElementById('navCloseBtn');
    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', function() {
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('.nav-toggle-icon');
                if (icon) icon.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    navOverlay.addEventListener('click', function() {
        categoryNav.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && categoryNav.classList.contains('active')) {
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    const categoryLinks = document.querySelectorAll('.category-nav-link:not(.dropdown-toggle)');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function() {
            categoryNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('.nav-toggle-icon').innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

function initCategoryNavDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentItem = this.closest('.category-nav-item');
            const dropdown = this.nextElementSibling;
            
            document.querySelectorAll('.category-nav-dropdown.active').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('active');
                    openDropdown.closest('.category-nav-item').classList.remove('active');
                    openDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
                }
            });
            
            parentItem.classList.toggle('active');
            dropdown.classList.toggle('active');
            
            const isExpanded = dropdown.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.category-nav-item.has-dropdown')) {
            document.querySelectorAll('.category-nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
                dropdown.closest('.category-nav-item').classList.remove('active');
                dropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.category-nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
                dropdown.closest('.category-nav-item').classList.remove('active');
                dropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    const navLinks = document.querySelectorAll('.category-nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const categoryNav = document.getElementById('categoryNav');
            const navOverlay = document.querySelector('.nav-overlay');
            
            if (categoryNav && navOverlay) {
                categoryNav.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                
                document.querySelectorAll('.category-nav-dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    dropdown.closest('.category-nav-item').classList.remove('active');
                });
                
                const navToggle = document.getElementById('navToggle');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    const icon = navToggle.querySelector('.nav-toggle-icon');
                    if (icon) icon.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
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

function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-bar form');
    const searchField = document.getElementById('search-input');
    
    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function() {
            searchInput.classList.toggle('active');
            document.body.classList.toggle('search-active');
            
            const isExpanded = searchInput.classList.contains('active');
            searchToggle.setAttribute('aria-expanded', isExpanded);
            
            if (isExpanded) {
                searchField.focus();
            }
        });
        
        document.addEventListener('click', function(e) {
            if (searchInput.classList.contains('active') && 
                !searchInput.contains(e.target) && 
                !searchToggle.contains(e.target)) {
                closeSearch();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchInput.classList.contains('active')) {
                closeSearch();
            }
        });
        
        searchForm.addEventListener('submit', function(e) {
            if (window.innerWidth > 768) {
                closeSearch();
            }
        });
    }
    
    function closeSearch() {
        searchInput.classList.remove('active');
        document.body.classList.remove('search-active');
        searchToggle.setAttribute('aria-expanded', 'false');
    }
    
    if (searchField) {
        let timeout;
        searchField.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                const query = searchField.value.trim();
                if (query.length > 2) {
                    fetchSearchSuggestions(query);
                }
            }, 300);
        });
    }
}

function fetchSearchSuggestions(query) {
    console.log('Fetching suggestions for:', query);
}

function showSearchSuggestions(suggestions) {
    console.log('Showing suggestions:', suggestions);
}
