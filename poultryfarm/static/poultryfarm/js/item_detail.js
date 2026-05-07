// poultryfarm/static/poultryfarm/js/item_detail.js
document.addEventListener('DOMContentLoaded', function() {
    const likeBtn = document.querySelector('.like-btn');
    const shareBtn = document.querySelector('.share-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const mainImage = document.getElementById("mainImage");
    const thumbnails = document.querySelectorAll(".thumbnail");
    const zoomBtn = document.getElementById("zoomBtn");
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close-modal");
    function getCSRFToken() {
        const cookieValue = document.cookie.match('(^|; )csrftoken=([^;]*)');
        return cookieValue ? cookieValue[2] : '';
    }
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

    if (likeBtn) {
        likeBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const countSpan = this.querySelector('.count') || this.querySelector('span');
            try {
                const response = await fetch(this.dataset.likeUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Like request failed');
                }

                const data = await response.json();
                if (data.status === 'success') {
                    if (countSpan) {
                        countSpan.textContent = data.like_count;
                    }
                    if (data.has_liked) {
                        this.classList.add('liked');
                    } else {
                        this.classList.remove('liked');
                    }
                    showNotification(data.message || 'Like updated successfully');
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
                } else {
                    showNotification(data.message || 'Like failed', 'error');
                }
            } catch (err) {
                console.error('Like error:', err);
                showNotification('Like failed', 'error');
            }
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const countSpan = this.querySelector('.count') || this.querySelector('span');
            const pageUrl = window.location.href;
            try {
                if (navigator.share) {
                    await navigator.share({ title: document.title, url: pageUrl });
                } else {
                    await navigator.clipboard.writeText(pageUrl);
                    showNotification('Link copied to clipboard!');
                }

                const response = await fetch(this.dataset.shareUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Share request failed');
                }

                const data = await response.json();
                if (data.status === 'success') {
                    if (countSpan) {
                        countSpan.textContent = data.share_count;
                    }
                    showNotification(data.message || 'Share recorded successfully');
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
                } else {
                    showNotification(data.message || 'Share failed', 'error');
                }
            } catch (err) {
                console.error('Share error:', err);
                showNotification('Share failed', 'error');
            }
        });
    }

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
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Remove';
                        showNotification('Added to cart');
                    } else {
                        this.classList.remove('in-cart');
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add';
                        showNotification('Removed from cart');
                    }
                    this.style.transform = 'scale(1.05)';
                    setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
                } else {
                    showNotification(data.error || 'Cart update failed', 'error');
                }
            } catch (err) {
                console.error('Cart error:', err);
                showNotification('Cart update failed', 'error');
                this.innerHTML = originalText;
            }
        });
    }

    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.dataset.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

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