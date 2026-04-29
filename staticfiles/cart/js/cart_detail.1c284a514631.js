/* ============================================
   Cart Detail Page - Modern JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initQuantityControls();
    initRemoveButtons();
    initCheckoutButton();
    initAnimations();
});

/* ---------- Quantity Controls ---------- */
function initQuantityControls() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach(item => {
        const minusBtn = item.querySelector('.qty-minus');
        const plusBtn = item.querySelector('.qty-plus');
        const qtyInput = item.querySelector('.qty-input');
        
        if (minusBtn && plusBtn && qtyInput) {
            // Decrease quantity
            minusBtn.addEventListener('click', () => {
                let currentQty = parseInt(qtyInput.value);
                if (currentQty > 1) {
                    qtyInput.value = currentQty - 1;
                    updateQuantity(item, qtyInput.value);
                }
            });
            
            // Increase quantity
            plusBtn.addEventListener('click', () => {
                let currentQty = parseInt(qtyInput.value);
                if (currentQty < 99) {
                    qtyInput.value = currentQty + 1;
                    updateQuantity(item, qtyInput.value);
                }
            });
            
            // Manual input change
            qtyInput.addEventListener('change', () => {
                let newQty = parseInt(qtyInput.value);
                if (newQty < 1) {
                    qtyInput.value = 1;
                    newQty = 1;
                } else if (newQty > 99) {
                    qtyInput.value = 99;
                    newQty = 99;
                }
                updateQuantity(item, newQty);
            });
        }
    });
}

function updateQuantity(item, newQuantity) {
    const itemId = item.dataset.itemId;
    const input = item.querySelector('.qty-input');
    
    // Add loading state
    item.classList.add('updating');
    
    // Send AJAX request
    fetch('/cart/update-quantity/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            item_id: itemId,
            quantity: parseInt(newQuantity)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update subtotal display
            const subtotalEl = item.querySelector('.item-subtotal span');
            if (subtotalEl && data.item_total !== undefined) {
                subtotalEl.textContent = `ETB ${data.item_total}`;
            }
            
            // Update cart total
            updateCartTotal(data.cart_total);
            
            // Show success feedback
            showNotification('Quantity updated!', 'success');
        } else {
            alert('Error: ' + data.error);
            // Revert to previous value
            input.value = input.dataset.oldValue || input.value;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error updating quantity', 'error');
    })
    .finally(() => {
        item.classList.remove('updating');
    });
}

function updateCartTotal(total) {
    const totalElements = document.querySelectorAll('.total-value, .summary-value:not(.free)');
    totalElements.forEach(el => {
        if (!el.classList.contains('free')) {
            el.textContent = `ETB ${total}`;
        }
    });
}

/* ---------- Remove Buttons ---------- */
function initRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    const modal = document.getElementById('removeModal');
    const cancelBtn = document.getElementById('cancelRemove');
    const confirmBtn = document.getElementById('confirmRemove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Store the href for removal
            const removeUrl = this.href;
            
            // Show modal
            modal.classList.add('show');
            
            // Set up confirm button
            confirmBtn.onclick = () => {
                modal.classList.remove('show');
                window.location.href = removeUrl;
            };
        });
    });
    
    // Close modal on cancel
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

/* ---------- Checkout Button ---------- */
function initCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-button');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            // Add loading state
            this.classList.add('loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Allow default navigation after a short delay
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        });
    }
}

/* ---------- Animations ---------- */
function initAnimations() {
    // Animate cart items on load
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate summary card
    const summaryCard = document.querySelector('.summary-card');
    if (summaryCard) {
        summaryCard.style.opacity = '0';
        summaryCard.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            summaryCard.style.transition = 'all 0.4s ease';
            summaryCard.style.opacity = '1';
            summaryCard.style.transform = 'translateX(0)';
        }, cartItems.length * 100 + 200);
    }
}

/* ---------- Notifications ---------- */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.cart-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
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
    
    .cart-item.updating {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .cart-item.updating::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255,255,255,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .checkout-button.loading {
        pointer-events: none;
    }
`;
document.head.appendChild(style);