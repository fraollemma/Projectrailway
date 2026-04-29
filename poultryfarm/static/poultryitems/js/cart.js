// cart.js
document.addEventListener('DOMContentLoaded', function() {
    // Quantity update handler with debounce
    const quantityInputs = document.querySelectorAll('.cart-quantity-input');
    
    quantityInputs.forEach(input => {
        let timeout = null;
        input.dataset.oldValue = input.value;
        
        input.addEventListener('change', function() {
            clearTimeout(timeout);
            
            // Add loading state
            this.disabled = true;
            const row = this.closest('.cart-table-row');
            if (row) row.classList.add('loading');
            
            timeout = setTimeout(() => {
                const url = this.dataset.updateUrl;
                const quantity = parseInt(this.value);
                
                // Validate input - FIXED SYNTAX ERROR HERE
                if (isNaN(quantity)) {
                    resetInputState(this, row);
                    showToast('Please enter a valid quantity', 'error');
                    return;
                }
                
                if (quantity < 1) {
                    this.value = 1;
                    resetInputState(this, row);
                    showToast('Quantity cannot be less than 1', 'error');
                    return;
                }
                
                updateCartItem(url, quantity, this, row);
            }, 300);
        });
    });
    
    // Remove item handlers
    document.querySelectorAll('.cart-remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!confirm('Are you sure you want to remove this item from your cart?')) {
                return;
            }
            
            // Add loading state
            this.disabled = true;
            const row = this.closest('.cart-table-row');
            if (row) row.classList.add('loading');
            
            const url = this.dataset.removeUrl;
            removeCartItem(url, this, row);
        });
    });
    
    // Helper functions
    function updateCartItem(url, quantity, input, row) {
        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `quantity=${quantity}`
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Failed to update quantity');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showToast('Quantity updated successfully', 'success');
                updateCartDisplay(data, row);
                input.dataset.oldValue = quantity;
            } else {
                throw new Error(data.error || 'Failed to update quantity');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast(error.message || 'An error occurred', 'error');
            input.value = input.dataset.oldValue;
        })
        .finally(() => {
            resetInputState(input, row);
        });
    }
    
    function removeCartItem(url, button, row) {
        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Failed to remove item');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showToast('Item removed successfully', 'success');
                if (data.cart_empty) {
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    row.remove();
                    updateCartTotal(data.cart_total);
                }
            } else {
                throw new Error(data.error || 'Failed to remove item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast(error.message || 'An error occurred', 'error');
        })
        .finally(() => {
            button.disabled = false;
            if (row) row.classList.remove('loading');
        });
    }
    
    function updateCartDisplay(data, row) {
        // Update item total
        const totalElement = row.querySelector('.cart-table-total');
        if (totalElement && data.total_price) {
            totalElement.textContent = `$${data.total_price}`;
        }
        
        // Update cart total
        updateCartTotal(data.cart_total);
    }
    
    function updateCartTotal(total) {
        const cartTotalElement = document.querySelector('.cart-table-footer-total');
        if (cartTotalElement && total) {
            cartTotalElement.innerHTML = `<strong>$${total}</strong>`;
        }
    }
    
    function resetInputState(input, row) {
        input.disabled = false;
        if (row) row.classList.remove('loading');
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
    
    function showToast(message, type = 'success') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => {
            toast.remove();
        });
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                hideToast(toast);
            });
        }
        
        // Auto-hide after 5 seconds
        const autoHide = setTimeout(() => {
            hideToast(toast);
        }, 5000);
        
        // Pause auto-hide on hover
        toast.addEventListener('mouseenter', () => {
            clearTimeout(autoHide);
        });
        
        toast.addEventListener('mouseleave', () => {
            setTimeout(() => {
                hideToast(toast);
            }, 1000);
        });
    }
    
    function hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }
});