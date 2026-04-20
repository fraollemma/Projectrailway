document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initCurrentYear();
    initUnreadCount();
    initFormSubmissions();
    initButtonEffects();
    initLanguagePopup();
    initMobileNavigation();
    initSearch();
    initCategoryNavDropdowns();
});

/* CLOCK */
function initClock() {
    function updateClock() {
        const clockElements = document.querySelectorAll('.live-clock');
        if (clockElements.length > 0) {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };

            const formattedDateTime = now.toLocaleString('en-US', options)
                .replace(/(\d+)\/(\d+)\/(\d+),?/, '$3-$1-$2');

            clockElements.forEach(el => {
                el.textContent = formattedDateTime;
            });
        }
    }

    updateClock();
    setInterval(updateClock, 60000);
}

/* YEAR */
function initCurrentYear() {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

/* UNREAD COUNT */
function initUnreadCount() {

    function fetchUnreadCount() {
        if (!window.UNREAD_COUNT_API_URL) return;

        fetch(window.UNREAD_COUNT_API_URL, {
            credentials: 'include'
        })
        .then(res => res.json())
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

        }).catch(err => console.error(err));
    }

    fetchUnreadCount();
    setInterval(fetchUnreadCount, 30000);
}

/* FORM SUBMIT */
function initFormSubmissions() {

    const forms = document.querySelectorAll('form');

    forms.forEach(form => {

        form.addEventListener('submit', function(e) {

            const submitBtn = this.querySelector('button[type="submit"]');

            if (submitBtn) {

                submitBtn.disabled = true;
                submitBtn.classList.add('loading');

                const originalText = submitBtn.innerHTML;

                submitBtn.innerHTML = '<span class="spinner"><i class="fas fa-spinner fa-spin"></i></span>';

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
    .then(res => res.json())
    .then(data => {

        if (data.redirect) {
            window.location.href = data.redirect;
        }

        if (data.success) {
            showToast('Success', data.message || 'Done', 'success');
            form.reset();
        }

    })
    .catch(err => {
        showToast('Error', err.message, 'error');
    })
    .finally(() => {

        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;

    });

}

/* BUTTON EFFECTS */
function initButtonEffects() {

    document.querySelectorAll('.btn').forEach(btn => {

        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(.98)';
        });

        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });

    });

}

/* LANGUAGE POPUP (FIXED) */
function initLanguagePopup() {

    const overlay = document.getElementById("language-overlay");
    const languageSelect = document.getElementById("languageSelect");
    const languageForm = document.getElementById("languageForm");

    if (!overlay) return;

    if (!localStorage.getItem("languageSelected")) {

        setTimeout(() => {
            overlay.classList.add("active");
        }, 800);

    }

    if (languageSelect && languageForm) {

        languageSelect.addEventListener("change", function () {

            localStorage.setItem("languageSelected", "true");
            languageForm.submit();

        });

    }

}

function skipPopup() {

    localStorage.setItem("languageSelected", "true");

    const overlay = document.getElementById("language-overlay");

    if (overlay) {
        overlay.classList.remove("active");
    }

}

/* MOBILE NAV */
function initMobileNavigation() {

    const navToggle = document.getElementById('navToggle');
    const categoryNav = document.getElementById('categoryNav');

    if (!navToggle || !categoryNav) return;

    navToggle.addEventListener('click', function(){

        categoryNav.classList.toggle('active');

    });

}

/* CATEGORY DROPDOWN */
function initCategoryNavDropdowns(){

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {

        toggle.addEventListener('click', function(e){

            e.preventDefault();

            const dropdown = this.nextElementSibling;

            if (dropdown) {

                dropdown.classList.toggle('active');

            }

        });

    });

}

/* SEARCH */
function initSearch(){

    const searchToggle = document.getElementById('searchToggle');
    const searchInput = document.querySelector('.search-input');

    if (!searchToggle || !searchInput) return;

    searchToggle.addEventListener('click', function(){

        searchInput.classList.toggle('active');

    });

}

/* TOAST */
function showToast(title,message,type='info'){

    const toast=document.createElement('div');

    toast.className='toast toast-' + type;

    toast.innerHTML='<div class="toast-header"><strong>' + title + '</strong><button class="toast-close">&times;</button></div><div class="toast-body">' + message + '</div>';

    document.body.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });

    setTimeout(()=>toast.classList.add('show'),10);

    setTimeout(()=>{
        toast.classList.remove('show');
        setTimeout(()=>toast.remove(),300);
    },5000);

}

/* PULSE ANIMATION */
(function(){

const style=document.createElement('style');

style.innerHTML='@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}.pulse{animation:pulse 1s infinite}';

document.head.appendChild(style);

})();
