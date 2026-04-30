// dairyfarm/static/dairyfarm/js/dairyfarm_list.js
document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const vehicleId = this.getAttribute('data-item-id');
            toggleLike(vehicleId, this);
        });
    });
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const vehicleId = this.getAttribute('data-item-id');
            shareVehicle(vehicleId, this);
        });
    });
});
async function toggleLike(vehicleId, button) {
    try {
        const response = await fetch(`/en/dairyfarm/vehicle/${vehicleId}/like/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'same-origin'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.status === 'success') {
            const countElement = button.querySelector('.interaction-count');
            if (countElement) {
                countElement.textContent = data.like_count;
            }

            button.classList.toggle('liked');
            button.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                button.style.backgroundColor = '';
            }, 400);
        }
    } catch (error) {
        console.error('Like toggle error:', error);
        alert('Failed to like/unlike. Please try again.');
    }
}

async function shareVehicle(vehicleId, button) {
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Check out this vehicle!',
                text: 'I found this amazing vehicle you might like',
                url: window.location.href,
            });
        } else {
            copyToClipboard(window.location.href);
            alert('Link copied to clipboard!');
        }

        await sendShareRequest(vehicleId, button);
    } catch (error) {
        console.error('Share error:', error);
        if (error.name !== 'AbortError') {
            alert('Failed to share. Please try again.');
        }
    }
}

async function sendShareRequest(vehicleId, button) {
    try {
        const response = await fetch(`/en/dairyfarm/vehicle/${vehicleId}/share/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'same-origin'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        if (data.status === 'success') {
            const countElement = button.querySelector('.interaction-count');
            if (countElement) {
                countElement.textContent = data.share_count;
            }

            button.style.backgroundColor = '#e8f5e9';
            setTimeout(() => {
                button.style.backgroundColor = '';
            }, 500);
        }
    } catch (error) {
        console.error('Share count error:', error);
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