document.addEventListener('DOMContentLoaded', function () {
    const likeButton = document.querySelector('.like-button');
    const shareButton = document.querySelector('.share-button');

    if (likeButton) {
        likeButton.addEventListener('click', function (e) {
            e.preventDefault();
            const vehicleId = this.getAttribute('data-item-id');
            toggleLikeDetail(vehicleId, this);
        });
    }
    if (shareButton) {
        shareButton.addEventListener('click', function (e) {
            e.preventDefault();
            const vehicleId = this.getAttribute('data-item-id');
            shareVehicleDetail(vehicleId, this);
        });
    }
});

async function toggleLikeDetail(vehicleId, button) {
    try {
        const response = await fetch(`/en/vehicles/vehicle/${vehicleId}/like/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
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

async function shareVehicleDetail(vehicleId, button) {
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Check out this vehicle!',
                text: 'I found this amazing vehicle you might like',
                url: window.location.href,
            });
            await sendShareRequestDetail(vehicleId, button);
        } else {
            await sendShareRequestDetail(vehicleId, button);
            copyToClipboard(window.location.href);
            alert('Link copied to clipboard!');
        }
    } catch (error) {
        console.error('Share error:', error);
        if (error.name !== 'AbortError') {
            alert('Failed to share. Please try again.');
        }
    }
}

async function sendShareRequestDetail(vehicleId, button) {
    try {
        const response = await fetch(`/en/vehicles/vehicle/${vehicleId}/share/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'same-origin'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.status === 'success') {
            const countElement = document.getElementById('share-count');
            if (countElement) countElement.textContent = data.share_count;

            button.innerHTML = `<i class="fas fa-share-alt"></i> 
                                <span class="interaction-count" id="share-count">${data.share_count}</span>`;

            button.style.backgroundColor = '#e8f5e9';
            setTimeout(() => { button.style.backgroundColor = ''; }, 400);
        }
    } catch (error) {
        console.error('Share request error:', error);
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
