// poultryfarm/static/poultryfarm/js/item_list.js
document.addEventListener('DOMContentLoaded', function() {
    initLikeButtons();
    initShareButtons(); 
    initCartButtons();
    initViewToggle();
    initCardAnimations();
}); 
 
// ---------- LIKE ----------
function initLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const url = this.dataset.likeUrl;   // must be set in template
            if (!url) return;
            const countSpan = this.querySelector('.count');
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    countSpan.textContent = data.like_count;
                    if (data.has_liked) {
                        this.classList.add('liked');
                    } else {
                        this.classList.remove('liked');
                    }
                    animate(this);
                }
            } catch (err) {
                console.error(err);
                showNotification('Like failed', 'error');
            }
        });
    });
}

// ---------- SHARE ----------
function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const url = this.dataset.shareUrl;   // must be set in template
            if (!url) return;
            const countSpan = this.querySelector('.count');
            try {
                await navigator.clipboard.writeText(window.location.href);
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    countSpan.textContent = data.share_count;
                    animate(this);
                }
            } catch (err) {
                console.error(err);
                showNotification('Share failed', 'error');
            }
        });
    });
}

// ---------- CART ----------
function initCartButtons() {
    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const url = this.dataset.cartUrl;    // must be set in template
            if (!url) return;
            const originalHtml = this.innerHTML;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    if (data.in_cart) {
                        this.classList.add('in-cart');
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Remove';
                    } else {
                        this.classList.remove('in-cart');
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add';
                    }
                    showNotification(data.message || (data.in_cart ? 'Added to cart' : 'Removed from cart'));
                    animate(this);
                } else {
                    showNotification(data.error || 'Cart update failed', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotification('Cart update failed', 'error');
                this.innerHTML = originalHtml;
            }
        });
    });
}

// ---------- VIEW TOGGLE (unchanged, keep as is) ----------
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-toggle .view-btn');
    const grid = document.querySelector('.poultry-grid');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.dataset.view;
            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

function initCardAnimations() {
    const cards = document.querySelectorAll('.poultry-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function animate(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => { element.style.transform = 'scale(1)'; }, 200);
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.poultry-notification');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = 'poultry-notification';
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
        border-radius: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        z-index: 1000; display: flex; align-items: center; gap: 0.5rem;
        animation: slideInRight 0.3s ease; font-weight: 500;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// CSS animations (if not already present)
if (!document.querySelector('#list-page-animations')) {
    const style = document.createElement('style');
    style.id = 'list-page-animations';
    style.textContent = `
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        .list-view { grid-template-columns: 1fr !important; }
        .list-view .poultry-card { flex-direction: row; }
        .list-view .card-image { width: 200px; aspect-ratio: 1; }
    `;
    document.head.appendChild(style);
}