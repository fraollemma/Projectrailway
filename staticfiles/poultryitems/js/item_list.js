/* ============================================
   Poultry Items List - Modern JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLikeButtons();
    initShareButtons();
    initViewToggle();
    initCardAnimations();
});

/* ---------- Like Buttons ---------- */
function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.dataset.itemId;
            toggleLike(itemId, this);
        });
    });
}

async function toggleLike(itemId, button) {
    try {
        const response = await fetch(`/en/items/${itemId}/like/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.status === 'success') {
            const countElement = button.querySelector('.count');
            if (countElement) {
                countElement.textContent = data.like_count;
            }

            // Toggle liked class
            button.classList.toggle('liked');
            
            // Add animation
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
            
            // Show notification
            showNotification(data.has_liked ? 'Item liked!' : 'Like removed!');
        }
    } catch (error) {
        console.error('Like toggle error:', error);
        showNotification('Failed to like item. Please try again.', 'error');
    }
}

/* ---------- Share Buttons ---------- */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.dataset.itemId;
            handleShare(itemId, this);
        });
    });
}

async function handleShare(itemId, button) {
    try {
        // Try native share API first
        if (navigator.share) {
            await navigator.share({
                title: 'Check out this poultry item!',
                text: 'I found this amazing poultry item on Ethiopian Sheger Market',
                url: window.location.href,
            });
        } else {
            // Fallback to clipboard
            await navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard!');
        }
        
        // Send share count to server
        const response = await fetch(`/en/items/${itemId}/share/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
                const countElement = button.querySelector('.count');
                countElement.textContent = data.share_count;
                
                // Add animation
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }
        }
    } catch (error) {
        console.error('Share error:', error);
        if (error.name !== 'AbortError') {
            showNotification('Failed to share. Please try again.', 'error');
        }
    }
}

/* ---------- View Toggle ---------- */
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-toggle .view-btn');
    const grid = document.querySelector('.poultry-grid');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle view
            const view = this.dataset.view;
            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

/* ---------- Card Animations ---------- */
function initCardAnimations() {
    const cards = document.querySelectorAll('.poultry-card');
    
    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate in
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/* ---------- Notifications ---------- */
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.poultry-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'poultry-notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
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
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* ---------- Utility Functions ---------- */
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