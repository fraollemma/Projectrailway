// poultryfarm/static/poultryfarm/js/item_detail.js
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const likeBtn = document.querySelector('.like-btn');
    const shareBtn = document.querySelector('.share-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const mainImage = document.getElementById("mainImage");
    const thumbnails = document.querySelectorAll(".thumbnail");
    const zoomBtn = document.getElementById("zoomBtn");
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close-modal");

    // Helper to get CSRF token from cookie 
    function getCSRFToken() {
        const cookieValue = document.cookie.match('(^|; )csrftoken=([^;]*)');
        return cookieValue ? cookieValue[2] : '';
    }

    // Helper to show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white; padding: 1rem 1.5rem; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000; animation: slideIn 0.3s ease;
            font-family: inherit;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ---------- LIKE BUTTON ----------
    if (likeBtn) {
        likeBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const slug = this.dataset.itemId;
            const countSpan = this.querySelector('.count');
            try {
                const response = await fetch(likeBtn.dataset.likeUrl, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': getCSRFToken() }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    countSpan.textContent = data.like_count;
                    if (data.has_liked) {
                        this.classList.add('liked');
                    } else {
                        this.classList.remove('liked');
                    }
                    // Animation
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
                }
            } catch (err) {
                console.error('Like error:', err);
                showNotification('Like failed', 'error');
            }
        });
    }

    // ---------- SHARE BUTTON ----------
    if (shareBtn) {
        shareBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const slug = this.dataset.itemId;
            const countSpan = this.querySelector('.count');
            const url = window.location.href;
            try {
                // Copy to clipboard or use native share
                if (navigator.share) {
                    await navigator.share({ title: document.title, url });
                } else {
                    await navigator.clipboard.writeText(url);
                    showNotification('Link copied to clipboard!');
                }
                const response = await fetch(shareBtn.dataset.shareUrl, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': getCSRFToken() }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    countSpan.textContent = data.share_count;
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
                }
            } catch (err) {
                console.error('Share error:', err);
                showNotification('Share failed', 'error');
            }
        });
    }

    // ---------- CART BUTTON ----------
    if (cartBtn) {
        cartBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const slug = this.dataset.itemId;
            const originalText = this.innerHTML;
            try {
                const response = await fetch(cartBtn.dataset.cartUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    if (data.in_cart) {
                        this.classList.add('in-cart');
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Remove from Cart';
                        showNotification('Added to cart');
                    } else {
                        this.classList.remove('in-cart');
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                        showNotification('Removed from cart');
                    }
                    // Animation
                    this.style.transform = 'scale(1.05)';
                    setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
                } else {
                    showNotification(data.error || 'Cart update failed', 'error');
                }
            } catch (error) {
                console.error('Cart error:', error);
                showNotification('Cart update failed', 'error');
                this.innerHTML = originalText; // revert text on error
            }
        });
    }

    // ---------- THUMBNAIL GALLERY ----------
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.dataset.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ---------- ZOOM MODAL ----------
    if (zoomBtn && modal && modalImg) {
        zoomBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = mainImage.src;
        });
        if (closeModal) {
            closeModal.addEventListener('click', () => { modal.style.display = 'none'; });
        }
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
});

if (!document.querySelector('#item-detail-animations')) {
    const style = document.createElement('style');
    style.id = 'item-detail-animations';
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        .notification { font-family: inherit; }
    `;
    document.head.appendChild(style);
}