// base.js
(function() {
    'use strict';

    // DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initClock();
        initCurrentYear();
        initUnreadCount();
        initFormSubmissions();
        initButtonEffects();
        initLanguagePopup();
        initMobileNavigation();
        initCategoryNavDropdowns();
        initSearch();
        initBackToTop();
    });

    function initClock() {
        function updateClock() {
            const clocks = document.querySelectorAll('.live-clock');
            if (!clocks.length) return;
            const now = new Date();
            const formatted = now.toISOString().slice(0, 16).replace('T', ' ');
            clocks.forEach(el => el.textContent = formatted);
        }
        updateClock();
        setInterval(updateClock, 60000);
    }

    function initCurrentYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }

    function initUnreadCount() {
        const unreadSpan = document.getElementById('navbarUnreadMsg');
        if (!unreadSpan || !window.UNREAD_COUNT_API_URL) return;

        function fetchCount() {
            fetch(window.UNREAD_COUNT_API_URL, { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    const count = data.total_unread || 0;
                    unreadSpan.textContent = count > 9 ? '9+' : count;
                    unreadSpan.style.display = count ? 'inline-flex' : 'none';
                })
                .catch(err => console.warn('Unread count error:', err));
        }
        fetchCount();
        setInterval(fetchCount, 30000);
    }

    function initFormSubmissions() {
        const forms = document.querySelectorAll('form:not([data-ajax="true"])');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const btn = this.querySelector('button[type="submit"]');
                if (!btn) return;
                btn.disabled = true;
                btn.classList.add('loading');
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.classList.remove('loading');
                    btn.innerHTML = originalHtml;
                }, 2000);
            });
        });
    }

    function initButtonEffects() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.98)');
            btn.addEventListener('mouseup', () => btn.style.transform = '');
            btn.addEventListener('mouseleave', () => btn.style.transform = '');
        });
    }

    function initLanguagePopup() {
        const overlay = document.getElementById('language-overlay');
        if (!overlay) return;
        if (!localStorage.getItem('languageSelected')) {
            setTimeout(() => overlay.classList.remove('hidden'), 1000);
        }
        document.getElementById('popupSkipBtn')?.addEventListener('click', () => {
            localStorage.setItem('languageSelected', 'true');
            overlay.classList.add('hidden');
        });
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.addEventListener('change', function() {
                localStorage.setItem('languageSelected', 'true');
                this.form.submit();
            });
        }
    }

    function initMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const categoryNav = document.getElementById('categoryNav');
        const navOverlay = document.getElementById('navOverlay');
        const navClose = document.getElementById('navCloseBtn');
        if (!navToggle || !categoryNav) return;

        function closeNav() {
            categoryNav.classList.remove('active');
            navOverlay?.classList.remove('active');
            document.body.classList.remove('no-scroll');
            navToggle.setAttribute('aria-expanded', 'false');
            const iconSpan = navToggle.querySelector('.nav-toggle-icon');
            if (iconSpan) iconSpan.innerHTML = '<i class="fas fa-bars"></i>';
        }
        function openNav() {
            categoryNav.classList.add('active');
            navOverlay?.classList.add('active');
            document.body.classList.add('no-scroll');
            navToggle.setAttribute('aria-expanded', 'true');
            const iconSpan = navToggle.querySelector('.nav-toggle-icon');
            if (iconSpan) iconSpan.innerHTML = '<i class="fas fa-times"></i>';
        }
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (categoryNav.classList.contains('active')) closeNav();
            else openNav();
        });
        navClose?.addEventListener('click', closeNav);
        navOverlay?.addEventListener('click', closeNav);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && categoryNav.classList.contains('active')) closeNav();
        });
        // Close when a link is clicked inside the nav
        categoryNav.querySelectorAll('.category-nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }

    function initCategoryNavDropdowns() {
        const toggles = document.querySelectorAll('.dropdown-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const parent = this.closest('.category-nav-item');
                const dropdown = parent.querySelector('.category-nav-dropdown');
                if (!dropdown) return;
                const wasActive = parent.classList.contains('active');
                // Close all others
                document.querySelectorAll('.category-nav-item.has-dropdown.active').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('active');
                        item.querySelector('.category-nav-dropdown')?.classList.remove('active');
                        item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                    }
                });
                if (!wasActive) {
                    parent.classList.add('active');
                    dropdown.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                } else {
                    parent.classList.remove('active');
                    dropdown.classList.remove('active');
                    this.setAttribute('aria-expanded', 'false');
                }
            });
        });
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.category-nav-item.has-dropdown')) {
                document.querySelectorAll('.category-nav-item.has-dropdown.active').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.category-nav-dropdown')?.classList.remove('active');
                    item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    function initSearch() {
        const searchToggle = document.getElementById('searchToggle');
        const searchInput = document.getElementById('searchInput');
        const searchField = document.getElementById('search-field');
        if (!searchToggle || !searchInput) return;

        function closeSearch() {
            searchInput.classList.remove('active');
            searchToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('search-active');
        }
        searchToggle.addEventListener('click', () => {
            const isActive = searchInput.classList.contains('active');
            if (isActive) closeSearch();
            else {
                searchInput.classList.add('active');
                searchToggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('search-active');
                searchField?.focus();
            }
        });
        document.addEventListener('click', (e) => {
            if (searchInput.classList.contains('active') && !searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
                closeSearch();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchInput.classList.contains('active')) closeSearch();
        });
    }

    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) btn.classList.add('show');
            else btn.classList.remove('show');
        });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Toast helper (global)
    window.showToast = function(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <strong>${escapeHtml(title)}</strong>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-body">${escapeHtml(message)}</div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        const timer = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timer);
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    };

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
})();