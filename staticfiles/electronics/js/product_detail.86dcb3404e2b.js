document.addEventListener('DOMContentLoaded', function() {
    // Like button click handler
    const likeButton = document.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const productId = this.dataset.itemId;
            try {
                const response = await fetch(`/en/electronics/product/${productId}/like/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    credentials: 'same-origin',
                });
                if (!response.ok) throw new Error('Network error');
                const data = await response.json();
                if (data.status === 'success') {
                    this.querySelector('.interaction-count').textContent = data.like_count;
                    this.classList.add('liked');
                    this.style.backgroundColor = '#e3f2fd';
                    setTimeout(() => this.style.backgroundColor = '', 500);
                }
            } catch (error) {
                alert('Failed to like product. Try again.');
                console.error(error);
            }
        });
    }

    // Share button click handler
    const shareButton = document.querySelector('.share-button');
    if (shareButton) {
        shareButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const productId = this.dataset.itemId;
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: 'Check out this product!',
                        text: 'I found this great product you might like.',
                        url: window.location.href,
                    });
                    await sendShareRequest(productId, this);
                } else {
                    await sendShareRequest(productId, this);
                    copyToClipboard(window.location.href);
                    alert('Product link copied to clipboard!');
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    alert('Failed to share product. Try again.');
                    console.error(error);
                }
            }
        });
    }

    async function sendShareRequest(productId, button) {
        const response = await fetch(`/en/electronics/product/${productId}/share/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'same-origin',
        });
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        if (data.status === 'success') {
            button.querySelector('.interaction-count').textContent = data.share_count;
            button.style.backgroundColor = '#e8f5e9';
            setTimeout(() => button.style.backgroundColor = '', 500);
        }
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
