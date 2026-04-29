// project/houses/static/houses/js/house_list.js
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const houseCards = document.querySelectorAll('.product-card');
            
            houseCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const location = card.querySelector('.card-location').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || location.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
            const filterValue = e.target.value.toLowerCase();
            const houseCards = document.querySelectorAll('.product-card');
            
            if (!filterValue) {
                houseCards.forEach(card => card.style.display = 'block');
                return;
            }
            
            houseCards.forEach(card => {
                const category = card.dataset.category || '';
                
                if (category.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const houseCards = document.querySelectorAll('.product-card');
    houseCards.forEach(card => {
        const categoryElement = card.querySelector('.card-category');
        if (categoryElement) {
            card.dataset.category = categoryElement.textContent.trim().toLowerCase();
        }
    });

    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('href');
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                window.location.href = targetPage;
            }, 500);
        });
    });

});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const houseId = this.getAttribute('data-item-id');
            toggleLike(houseId, this);
        });
    });
});

async function toggleLike(houseId, button) {
    try {
        const response = await fetch(`/en/houses/house/${houseId}/like/`, {
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
            // Update count text
            const countElement = button.querySelector('.interaction-count');
            if (countElement) {
                countElement.textContent = data.like_count;
            }

            // Toggle liked state
            if (button.classList.contains('liked')) {
                button.classList.remove('liked');
                button.innerHTML = `<i class="far fa-thumbs-up"></i> ${data.like_count}`;
            } else {
                button.classList.add('liked');
                button.innerHTML = `<i class="fas fa-thumbs-up"></i> ${data.like_count}`;
            }

            // Flash effect
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


async function shareHouse(houseId, button) {
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Check out this house!',
                text: 'I found this amazing house you might like',
                url: window.location.href,
            });
            
            await sendShareRequest(houseId, button);
        } else {
            
            await sendShareRequest(houseId, button);
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

async function sendShareRequest(houseId, button) {
    try {
        const response = await fetch(`/en/houses/house/${houseId}/share/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            const countElement = button.querySelector('.interaction-count');
            countElement.textContent = data.share_count;
            button.innerHTML = `<i class="fas fa-share-alt"></i> ${data.share_count}`;
            button.style.backgroundColor = '#e8f5e9';
            setTimeout(() => {
                button.style.backgroundColor = '';
            }, 500);
        }
    } catch (error) {
        console.error('Share count error:', error);
        throw error;
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