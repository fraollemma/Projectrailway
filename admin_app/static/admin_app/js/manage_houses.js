// admin_app/static/admin_app/js/manage_houses.js

document.addEventListener('DOMContentLoaded', function() {

    function postData(url, successCallback) {
        fetch(url, {
            method: 'POST',
            headers: { 
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'Accept': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') successCallback(data);
        })
        .catch(err => console.error('Error:', err));
    }

    // Like button
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            postData(url, (data) => {
                document.getElementById(`like-count-${data.house_id}`).textContent = data.like_count;
                btn.textContent = "Liked";
                btn.disabled = true;
            });
        });
    });

    // Share button
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            postData(url, (data) => {
                document.getElementById(`share-count-${data.house_id}`).textContent = data.share_count;
                btn.textContent = "Shared";
                btn.disabled = true;
            });
        });
    });

});
