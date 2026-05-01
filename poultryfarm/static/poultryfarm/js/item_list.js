document.addEventListener('DOMContentLoaded', function() {
    
    initLikeButtons();
    initShareButtons();
    initCartButtons();
    initViewToggle();
    initCardAnimations();
});

function initLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const slug = this.dataset.itemId;
            toggleLike(slug, this);
        });
    });
}

async function toggleLike(slug, button) {
    try {
        const response = await fetch(`/poultry/items/${slug}/like/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });

        const data = await response.json();

        if (data.status === 'success') {
            button.querySelector('.count').textContent = data.like_count;

            // keep red if liked
            if (data.has_liked) {
                button.classList.add('liked');
            } else {
                button.classList.remove('liked');
            }

            animate(button);
        }
    } catch (err) {
        console.error(err);
        showNotification('Like failed', 'error');
    }
}

/* ---------- Share Buttons ---------- */
function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const slug = this.dataset.itemId;
            handleShare(slug, this);
        });
    });
}

async function handleShare(slug, button) {
    try {
        await navigator.clipboard.writeText(window.location.href);

        const response = await fetch(`/poultry/items/${slug}/share/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });

        const data = await response.json();

        if (data.status === 'success') {
            button.querySelector('.count').textContent = data.share_count;
            animate(button);
        }
    } catch (err) {
        console.error(err);
        showNotification('Share failed', 'error');
    }
}

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
function initCartButtons() {
    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            this.classList.toggle('in-cart');
            animate(this);

            showNotification(
                this.classList.contains('in-cart')
                    ? 'Added to cart'
                    : 'Removed from cart'
            );
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

function showNotification(message, type = 'success') {
   
    const existing = document.querySelector('.poultry-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'poultry-notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* ---------- Add CSS Animations ---------- */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .list-view {
        grid-template-columns: 1fr !important;
    }
    
    .list-view .poultry-card {
        flex-direction: row;
    }
    
    .list-view .card-image {
        width: 200px;
        aspect-ratio: 1;
    }
`;
document.head.appendChild(style);