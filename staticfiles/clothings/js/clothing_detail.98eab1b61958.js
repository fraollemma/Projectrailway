// clothing_detail.js
document.addEventListener('DOMContentLoaded', function () {
    const likeButton = document.querySelector('.like-button');
    const shareButton = document.querySelector('.share-button');

    if (likeButton) {
        likeButton.addEventListener('click', function (e) {
            e.preventDefault();
            const clothingId = this.getAttribute('data-item-id');
            toggleLikeDetail(clothingId, this);
        });
    }
    if (shareButton) {
        shareButton.addEventListener('click', function (e) {
            e.preventDefault();
            const clothingId = this.getAttribute('data-item-id');
            shareclothingDetail(clothingId, this);
        });
    }
});

async function toggleLikeDetail(clothingId, button) {
    try {
        const response = await fetch(`/en/clothings/clothing/${clothingId}/like/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.status === 'success') {
            const countElement = document.getElementById('like-count');
            if (countElement) countElement.textContent = data.like_count;

            // Toggle liked state
            if (button.classList.contains('liked')) {
                button.classList.remove('liked');
                button.innerHTML = `<i class="far fa-thumbs-up"></i> 
                                    <span class="interaction-count" id="like-count">${data.like_count}</span>`;
            } else {
                button.classList.add('liked');
                button.innerHTML = `<i class="fas fa-thumbs-up"></i> 
                                    <span class="interaction-count" id="like-count">${data.like_count}</span>`;
            }

            // Flash effect
            button.style.backgroundColor = '#e3f2fd';
            setTimeout(() => { button.style.backgroundColor = ''; }, 400);
        }
    } catch (error) {
        console.error('Like toggle error:', error);
        alert('Failed to like/unlike. Please try again.');
    }
}

async function shareClothing(clothingId, button) {
    try {
        const response = await fetch(`/clothings/share/${clothingId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin'
        });

        const data = await response.json();
        if (data.status === 'success') {
            button.querySelector('.interaction-count').textContent = data.share_count;
        }
    } catch (err) {
        console.error(err);
    }
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
